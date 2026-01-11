import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';

function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    interests: [],
    profilePicture: null
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Available interests
  const interests = [
    '💻 Coding', '🎵 Music', '🎬 Movies', '🏔 Travel', 
    '📚 Reading', '🎨 Art', '🎮 Gaming', '⚽ Sports',
    '🍳 Cooking', '🧘 Meditation', '📸 Photography', '🎯 Productivity'
  ];

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file
      });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      // Prepare form data
      const finalData = {
        bio: formData.bio,
        interests: selectedInterests,
        profilePicture: formData.profilePicture ? formData.profilePicture.name : ''
      };

      // Call the complete profile API
      const response = await fetch(`https://backend-confession.vercel.app/api/onboarding/complete-profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user info in localStorage
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Redirect to home
        navigate('/');
      } else {
        alert(data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred during profile update');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already onboarded or not logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (user && user.isOnboarded) {
      navigate('/');
    } else if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0F1014] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-white/60">Tell us more about yourself</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full ${
                    step === s ? 'bg-[#875124]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1B1C24] rounded-2xl p-8 border border-white/10">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Upload Profile Picture</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4">
                    {formData.profilePicture ? (
                      <img 
                        src={URL.createObjectURL(formData.profilePicture)} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : 'A'}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#875124] rounded-full p-2 cursor-pointer">
                    <Upload size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <p className="text-white/60 mb-6">
                Choose a profile picture that represents you
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#875124] text-white rounded-xl font-semibold hover:bg-[#a36d48] transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Tell Us About Yourself</h2>
              <p className="text-white/60 mb-6 text-center">
                Share a little about yourself
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0F1014] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#875124] min-h-[120px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-[#0F1014] border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#875124] text-white rounded-xl font-semibold hover:bg-[#a36d48] transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Choose Your Interests</h2>
              <p className="text-white/60 mb-6 text-center">
                Select up to 4 interests that describe you
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border transition ${
                      selectedInterests.includes(interest)
                        ? 'bg-[#875124] border-[#875124] text-white'
                        : 'bg-[#0F1014] border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-[#0F1014] border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-[#875124] text-white rounded-xl font-semibold hover:bg-[#a36d48] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Completing...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
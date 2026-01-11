import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateConfession() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please enter your confession');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await fetch('https://backend-confession.vercel.app/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content,
          author: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate back to home/feed after successful creation
        navigate('/');
      } else {
        alert(data.message || 'Failed to create confession');
      }
    } catch (error) {
      console.error('Error creating confession:', error);
      alert('An error occurred while creating your confession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1014] text-white p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create Confession</h1>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1B1C24] rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#1B1C24] rounded-xl p-6 border border-white/10 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {JSON.parse(localStorage.getItem('user'))?.profilePicture || JSON.parse(localStorage.getItem('user'))?.displayName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your confession anonymously..."
                  className="w-full bg-transparent text-white placeholder-white/50 resize-none focus:outline-none min-h-[200px] max-h-64"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/50">{content.length}/500</span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#875124] px-6 py-3 rounded-xl font-semibold hover:bg-[#a36d48] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                    {loading ? 'Posting...' : 'Post Confession'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1B1C24] rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Tips for Sharing</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-[#875124] mt-1">•</span>
                <span>Be respectful and kind to others</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#875124] mt-1">•</span>
                <span>Your confession will appear anonymously</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#875124] mt-1">•</span>
                <span>Focus on positive or constructive thoughts</span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateConfession;
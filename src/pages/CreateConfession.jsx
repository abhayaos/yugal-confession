import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateConfession() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const MAX_LENGTH = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Please write something before posting');
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`Confession is too long (${content.length}/${MAX_LENGTH})`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('User information missing');

      const response = await fetch('https://backend-confession.vercel.app/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          author: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Failed to post confession');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const charCountClass = 
    content.length > MAX_LENGTH * 0.9
      ? 'text-red-400'
      : content.length > MAX_LENGTH * 0.75
      ? 'text-amber-400'
      : 'text-zinc-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1014] to-black text-white pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            New Confession
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full hover:bg-white/5 transition backdrop-blur-sm"
            aria-label="Close"
          >
            <X size={24} className="text-zinc-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main input area */}
          <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-2xl shadow-black/40">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-lg font-semibold text-white ring-2 ring-amber-500/30 shadow-inner">
                    {JSON.parse(localStorage.getItem('user') || '{}')?.displayName?.[0]?.toUpperCase() || 'A'}
                  </div>
                </div>

                {/* Textarea wrapper */}
                <div className="flex-1 relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind...?"
                    className="
                      w-full bg-transparent text-lg text-white placeholder-zinc-500 
                      resize-none focus:outline-none min-h-[180px] sm:min-h-[220px]
                      caret-amber-400
                    "
                    maxLength={MAX_LENGTH}
                    disabled={loading}
                  />

                  {/* Floating character counter */}
                  <div className={`absolute bottom-3 right-3 text-sm font-medium ${charCountClass}`}>
                    {content.length} / {MAX_LENGTH}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit bar */}
            <div className="px-5 sm:px-6 py-4 border-t border-zinc-800/60 flex items-center justify-between bg-black/20 backdrop-blur-sm rounded-b-2xl">
              {error ? (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              ) : (
                <div className="text-sm text-zinc-500">
                  Your confession will be anonymous
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !content.trim() || content.length > MAX_LENGTH}
                className={`
                  flex items-center gap-2.5 px-6 py-2.5 rounded-full font-medium
                  transition-all duration-200 shadow-lg
                  ${
                    loading
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : content.trim() && content.length <= MAX_LENGTH
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white shadow-amber-900/40 hover:shadow-amber-900/60 hover:scale-[1.03] active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }
                `}
              >
                <Send size={18} className={loading ? 'animate-pulse' : ''} />
                {loading ? 'Posting...' : 'Share'}
              </button>
            </div>
          </div>

          {/* Guidelines / Tips */}
          <div className="bg-zinc-900/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/40">
            <h3 className="text-lg font-semibold mb-4 text-amber-300">Before you share</h3>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Be kind — confessions are public and permanent</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Your identity remains completely anonymous</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Avoid sharing personal information or targeting others</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Keep it real — authenticity creates connection</span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateConfession;
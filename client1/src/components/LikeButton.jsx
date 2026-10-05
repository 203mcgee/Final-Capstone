// components/LikeButton.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LikeButton({ itemId, initialLikes = [], onLikeUpdated }) {
  const { user, authenticatedFetch } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync internal likes state when parent props update
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  // Safely extract current user ID (handles null user during initial load)
  const currentUserId = user?._id || user?.id;

  // Safely check if current user has already liked this item
  const hasLiked =
    Boolean(currentUserId) &&
    Array.isArray(likes) &&
    likes.some((id) => {
      if (!id) return false;
      const targetId = typeof id === 'string' ? id : id._id || id.id;
      return targetId === currentUserId;
    });

  const handleLike = async () => {
    if (!user) {
      setMessage('Please log in to endorse items.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await authenticatedFetch(`/api/skills/${itemId}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Action failed.');
      } else {
        // Fallback safely using currentUserId if array returned from server isn't available
        const updatedLikes =
          data.likes ||
          (data.skill && data.skill.likes) ||
          [...likes, currentUserId].filter(Boolean);

        setLikes(updatedLikes);
        setMessage(data.message || 'Endorsement updated!');

        if (onLikeUpdated) {
          onLikeUpdated(data.likeCount ?? updatedLikes.length);
        }
      }
    } catch (err) {
      setMessage('Network error. Could not save your endorsement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="like-container flex flex-col items-end gap-1">
      <button 
        onClick={handleLike} 
        disabled={isSubmitting || (Boolean(user) && hasLiked)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          hasLiked
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
            : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
        } disabled:opacity-60`}
      >
        <span>{hasLiked ? '✓ Endorsed' : '👍 Endorse'}</span>
        <span className="px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-[11px]">
          {Array.isArray(likes) ? likes.length : 0}
        </span>
      </button>

      {message && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{message}</p>}
    </div>
  );
}
// components/LikeButton.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LikeButton({ itemId, initialLikes = [], onLikeUpdated }) {
  const { user, authenticatedFetch } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasLiked = user && likes.some((id) => (typeof id === 'string' ? id : id._id) === user.id);

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
        setLikes((prev) => [...prev, user.id]);
        setMessage(data.message);
        if (onLikeUpdated) onLikeUpdated(data.likeCount);
      }
    } catch (err) {
      setMessage('Network error. Could not save your endorsement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="like-container">
      <button 
        onClick={handleLike} 
        disabled={isSubmitting || hasLiked}
        className={`like-btn ${hasLiked ? 'liked' : ''}`}
      >
        {hasLiked ? '✓ Endorsed' : '👍 Endorse'} ({likes.length})
      </button>

      {message && <p className="like-feedback">{message}</p>}
    </div>
  );
}
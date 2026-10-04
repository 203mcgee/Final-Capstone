// components/ItemCard.jsx
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';

export default function ItemCard({ item, onDelete, onApprove }) {
  const { user, authenticatedFetch } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm('Delete this item permanently?')) return;
    const res = await authenticatedFetch(`/api/admin/items/${item._id}`, {
      method: 'DELETE',
    });
    if (res.ok) onDelete(item._id);
  };

  const handleApprove = async () => {
    const res = await authenticatedFetch(`/api/admin/items/${item._id}/approve`, {
      method: 'PATCH',
    });
    if (res.ok) onApprove(item._id);
  };

  return (
    <div className="item-card">
      <h3>{item.title}</h3>
      <p>Status: {item.isApproved ? 'Approved' : 'Pending Review'}</p>

      {/* Public / Standard User Feature */}
      <LikeButton itemId={item._id} initialLikes={item.likes} />

      {/* Admin Courtesy Rendering */}
      {isAdmin && (
        <div className="admin-actions">
          {!item.isApproved && (
            <button onClick={handleApprove} className="btn-approve">
              Approve
            </button>
          )}
          <button onClick={() => alert('Navigate to edit form')} className="btn-edit">
            Edit
          </button>
          <button onClick={handleDelete} className="btn-delete">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
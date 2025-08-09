function EmptyState({ onAdd }) {
  return (
    <div className="empty">
      <p>No products available.</p>
      {onAdd ? (
        <button className="add-link" onClick={onAdd}>+ Add Product</button>
      ) : (
        <button className="add-link" disabled style={{ background: "#ccc", cursor: "not-allowed" }}>
          + Add Product
        </button>
      )}
      <style>{`
        .empty {
          text-align: center;
          margin-top: 4rem;
        }
        .add-link {
          margin-top: 1rem;
          font-size: 1.1rem;
          background: #3498db;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 1.2rem;
          cursor: pointer;
        }
        .add-link:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .empty {
            margin-top: 2rem;
          }
          .add-link {
            width: 100%;
            font-size: 1rem;
            padding: 0.7rem 0;
          }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;

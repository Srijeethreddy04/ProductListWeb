import "../styles/productCard.css";

function ProductCard({ product, onEdit, onDelete, canBuy }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="card-img" />
      <div className="card-info">
        <div className="card-name">{product.name}</div>
        <div className="card-price">₹{product.price}</div>
      </div>
      <div className="card-actions">
        {onEdit && (
          <button className="edit-btn" onClick={() => onEdit(product)}>
            Update
          </button>
        )}
        {onDelete && (
          <button
            className="delete-btn"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </button>
        )}
        {canBuy && (
          <button
            className="buy-btn"
            onClick={() => alert(`Buying ${product.name}`)}
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

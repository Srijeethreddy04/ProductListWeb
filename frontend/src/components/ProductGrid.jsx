import ProductCard from "./ProductCard";
import "../styles/productGrid.css";


function ProductGrid({ products, onEdit, onDelete, canBuy }) {
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          canBuy={canBuy}
        />
      ))}
    </div>
  );
}

export default ProductGrid;

"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productService";
import { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!products.length) return <p>Loading…</p>;

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {products.map(p => (
        <ProductCard
          key={p.id}
          id={String(p.id)}
          title={p.title}
          description={p.description}              
          price={p.price}
          image={`/images/${p.images[0]}`}
          category={p.category}
        />
      ))}
    </div>
  );
}



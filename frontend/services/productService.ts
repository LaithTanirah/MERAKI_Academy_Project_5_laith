import { Product } from "../types/product";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${API}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }
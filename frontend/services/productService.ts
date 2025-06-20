
  import { Product } from "../types/product";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductsByCategoryId(
  categoryId: string
): Promise<Product[]> {
  const res = await fetch(`${API}/api/products/category/${categoryId}`);
  if (!res.ok) throw new Error("Failed to fetch products by category");
  return res.json();
}

export async function fetchCategoryById(id: string): Promise<{ id: number; title: string }> {
  const res = await fetch(`${API}/api/categories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

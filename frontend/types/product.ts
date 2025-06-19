export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string[];
  images: string[];
  isdeleted: boolean;
  categoryid: number;
  category: string;
}

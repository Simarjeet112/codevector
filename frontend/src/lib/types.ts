export type CatalogCategory = string;
export type CategoryOption = string;
export type CatalogViewMode = 'grid' | 'table';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  next_cursor: string | null;
}

export interface CategoriesResponse {
  data: string[];
}

export type ViewMode = CatalogViewMode;
export type ProductPage = ProductsResponse;

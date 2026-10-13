export type ProductCategory = 
  | 'all'
  | 'retro-high'
  | 'low-runners'
  | 'designer-street'
  | 'collabs'
  | 'skate';

export type ProductBrand = 
  | 'Nike'
  | 'Jordan'
  | 'Adidas'
  | 'New Balance'
  | 'Off-White'
  | 'Travis Scott'
  | 'Balenciaga'
  | 'Salomon';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ProductStockBySize {
  [size: string]: number; // e.g., "US 9": 4, "US 10": 0
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: ProductBrand;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  story: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stockBySize: ProductStockBySize;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  sku: string;
  releaseYear: number;
  isGrail?: boolean;
  isLimitedDrop?: boolean;
  isFeatured?: boolean;
  isNewRelease?: boolean;
  colorway: string;
}

export type SortOption = 
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export type PriceBracket = 
  | 'all'
  | 'under-250'
  | '250-500'
  | '500-1000'
  | '1000-plus';

export interface FilterState {
  searchQuery: string;
  category: ProductCategory;
  brand: ProductBrand | 'all';
  priceBracket: PriceBracket;
  priceRange: [number, number];
  onlyInStock: boolean;
  sortBy: SortOption;
  selectedSize?: string;
}

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types/product';

const inStockProduct: Product = {
  id: 'shp-test-1',
  name: 'Air Jordan 1 Chicago Lost & Found',
  slug: 'air-jordan-1-chicago-lost-and-found',
  brand: 'Jordan',
  category: 'retro-high',
  price: 485,
  originalPrice: 550,
  colorway: 'Varsity Red / Black',
  sku: 'DZ5485-612',
  releaseYear: 2022,
  rating: 4.9,
  reviewCount: 142,
  inStock: true,
  isGrail: true,
  description: 'Vintage retro',
  story: 'Historic design',
  images: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
  ],
  colors: ['Chicago Red'],
  sizes: ['US 9', 'US 10'],
  stockBySize: { 'US 9': 4, 'US 10': 2 },
  reviews: [],
};

const outOfStockProduct: Product = {
  ...inStockProduct,
  id: 'shp-test-2',
  name: 'Sold Out Grail Sneaker',
  inStock: false,
  stockBySize: { 'US 9': 0, 'US 10': 0 },
};

describe('ProductCard component', () => {
  it('renders product name, brand, price and badges', () => {
    render(
      <BrowserRouter>
        <ProductCard product={inStockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Air Jordan 1 Chicago Lost & Found')).toBeInTheDocument();
    expect(screen.getByText('Jordan')).toBeInTheDocument();
    expect(screen.getByText('$485')).toBeInTheDocument();
    expect(screen.getByText('Grail')).toBeInTheDocument();
  });

  it('renders "Sold Out" state and disables action for out-of-stock items', () => {
    render(
      <BrowserRouter>
        <ProductCard product={outOfStockProduct} />
      </BrowserRouter>
    );

    const soldOutBadges = screen.getAllByText(/Sold Out/i);
    expect(soldOutBadges.length).toBeGreaterThan(0);

    const button = screen.getByRole('button', { name: /Sold Out/i });
    expect(button).toBeDisabled();
  });
});

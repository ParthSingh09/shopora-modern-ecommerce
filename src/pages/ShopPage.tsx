import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, FilterState, ProductCategory, ProductBrand, SortOption, PriceBracket } from '../types/product';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Initialize filter state from search params
  const categoryParam = (searchParams.get('category') as ProductCategory) || 'all';
  const brandParam = (searchParams.get('brand') as ProductBrand | 'all') || 'all';
  const priceParam = (searchParams.get('price') as PriceBracket) || 'all';
  const queryParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: queryParam,
    category: categoryParam,
    brand: brandParam,
    priceBracket: priceParam,
    priceRange: [0, 5000],
    onlyInStock: inStockParam,
    sortBy: sortParam,
  });

  // Sync state with URL params
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: ((searchParams.get('category') as ProductCategory) || 'all'),
      brand: ((searchParams.get('brand') as ProductBrand | 'all') || 'all'),
      priceBracket: ((searchParams.get('price') as PriceBracket) || 'all'),
      searchQuery: searchParams.get('q') || '',
      sortBy: ((searchParams.get('sort') as SortOption) || 'featured'),
      onlyInStock: searchParams.get('inStock') === 'true',
    }));
  }, [searchParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getProducts(filters).then((res) => {
      if (isMounted) {
        setProducts(res.products);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Update URL query parameters
    const params = new URLSearchParams();
    if (updated.category && updated.category !== 'all') params.set('category', updated.category);
    if (updated.brand && updated.brand !== 'all') params.set('brand', updated.brand);
    if (updated.priceBracket && updated.priceBracket !== 'all') params.set('price', updated.priceBracket);
    if (updated.searchQuery) params.set('q', updated.searchQuery);
    if (updated.sortBy && updated.sortBy !== 'featured') params.set('sort', updated.sortBy);
    if (updated.onlyInStock) params.set('inStock', 'true');

    setSearchParams(params, { replace: true });
  };

  const handleReset = () => {
    const resetState: FilterState = {
      searchQuery: '',
      category: 'all',
      brand: 'all',
      priceBracket: 'all',
      priceRange: [0, 5000],
      onlyInStock: false,
      sortBy: 'featured',
    };
    setFilters(resetState);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in" id="main-content">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Header */}
      <div className="border-b border-shopora-border/60 pb-5">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
          SNEAKER ARCHIVE &amp; CATALOG
        </h1>
        <p className="text-xs sm:text-sm text-shopora-muted mt-1 max-w-2xl leading-relaxed">
          Filter through authenticated silhouettes by brand, price range, and in-stock inventory.
        </p>
      </div>

      {/* Filter Toolbar */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalResults={products.length}
      />

      {/* Products Grid / Loading / Empty States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-shopora-card border border-shopora-border h-96 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center bg-shopora-surface rounded-2xl border border-shopora-border p-8">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-shopora-muted mb-3">
            <AlertCircle className="w-6 h-6 text-shopora-crimson" />
          </div>
          <h2 className="font-display font-bold text-xl text-white">No drops match your filters</h2>
          <p className="text-xs sm:text-sm text-shopora-muted max-w-md mt-1 mb-6 leading-relaxed">
            No sneakers in the archive match this combination of filters. Try broadening your criteria or reset all filters.
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

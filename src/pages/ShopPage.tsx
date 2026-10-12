import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, FilterState, ProductCategory, ProductBrand, SortOption } from '../types/product';
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
  const queryParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: queryParam,
    category: categoryParam,
    brand: brandParam,
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
      priceRange: [0, 5000],
      onlyInStock: false,
      sortBy: 'featured',
    };
    setFilters(resetState);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Header */}
      <div className="border-b border-shopora-border/60 pb-6">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          THE VAULT CATALOG
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Browse authenticated deadstock releases, vintage retros, and limited designer collaborations.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-shopora-card/50 border border-shopora-border h-96 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-shopora-card/30 rounded-3xl border border-shopora-border p-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-shopora-muted mb-4">
            <AlertCircle className="w-8 h-8 text-shopora-crimson" />
          </div>
          <h3 className="font-display font-bold text-2xl text-white">No drops match your filters</h3>
          <p className="text-sm text-shopora-muted max-w-md mt-2 mb-6 leading-relaxed">
            We couldn't find any sneakers matching your current search query or filter combination.
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-semibold text-xs uppercase tracking-wider shadow-glow-accent transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

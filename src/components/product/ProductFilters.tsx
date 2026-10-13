import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { ProductCategory, ProductBrand, SortOption, FilterState, PriceBracket } from '../../types/product';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'All Silhouettes', value: 'all' },
  { label: 'Retro Highs', value: 'retro-high' },
  { label: 'Collabs & Drops', value: 'collabs' },
  { label: 'Low Runners', value: 'low-runners' },
  { label: 'Designer Street', value: 'designer-street' },
  { label: 'Nike SB Skate', value: 'skate' },
];

const BRANDS: { label: string; value: ProductBrand | 'all' }[] = [
  { label: 'All Brands', value: 'all' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Travis Scott', value: 'Travis Scott' },
  { label: 'Nike', value: 'Nike' },
  { label: 'Off-White', value: 'Off-White' },
  { label: 'New Balance', value: 'New Balance' },
  { label: 'Balenciaga', value: 'Balenciaga' },
  { label: 'Adidas', value: 'Adidas' },
  { label: 'Salomon', value: 'Salomon' },
];

const PRICE_BRACKETS: { label: string; value: PriceBracket }[] = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $250', value: 'under-250' },
  { label: '$250 – $500', value: '250-500' },
  { label: '$500 – $1,000', value: '500-1000' },
  { label: '$1,000+', value: '1000-plus' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured / Grails', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating-desc' },
  { label: 'Newest Releases', value: 'newest' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = Boolean(
    (filters.searchQuery && filters.searchQuery.trim()) ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    (filters.priceBracket && filters.priceBracket !== 'all') ||
    filters.onlyInStock
  );

  return (
    <div className="space-y-4" aria-label="Product Catalog Filters">
      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Category tabs">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ category: cat.value })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-shopora-accent ${
                isActive
                  ? 'bg-shopora-accent text-black font-bold'
                  : 'bg-shopora-surface hover:bg-shopora-card text-slate-300 border border-shopora-border'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search, Brand, Price Bracket, Sort, In-Stock, Reset */}
      <div className="p-3.5 rounded-2xl bg-shopora-surface border border-shopora-border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search by name, SKU, or colorway..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-8 pr-8 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
          />
          <Search className="w-3.5 h-3.5 text-shopora-muted absolute left-2.5 top-2.5" />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-2 text-shopora-muted hover:text-white"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Brand Dropdown */}
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value as ProductBrand | 'all' })}
            aria-label="Filter by Brand"
            className="px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-shopora-accent cursor-pointer"
          >
            {BRANDS.map((brand) => (
              <option key={brand.value} value={brand.value} className="bg-shopora-card text-white">
                {brand.label}
              </option>
            ))}
          </select>

          {/* Price Bracket Dropdown */}
          <select
            value={filters.priceBracket || 'all'}
            onChange={(e) => onFilterChange({ priceBracket: e.target.value as PriceBracket })}
            aria-label="Filter by Price Range"
            className="px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-shopora-accent cursor-pointer"
          >
            {PRICE_BRACKETS.map((bracket) => (
              <option key={bracket.value} value={bracket.value} className="bg-shopora-card text-white">
                {bracket.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
            aria-label="Sort products"
            className="px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-shopora-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((sort) => (
              <option key={sort.value} value={sort.value} className="bg-shopora-card text-white">
                {sort.label}
              </option>
            ))}
          </select>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl cursor-pointer select-none text-xs text-slate-200 hover:border-shopora-borderLight">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => onFilterChange({ onlyInStock: e.target.checked })}
              className="accent-[#CCFF00] w-3.5 h-3.5 rounded cursor-pointer"
            />
            <span>In Stock</span>
          </label>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-shopora-muted hover:text-white text-xs transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Result Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-shopora-muted px-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span>Active filters:</span>
          {!hasActiveFilters && <span className="text-slate-400">None (Showing all)</span>}

          {filters.category !== 'all' && (
            <button
              onClick={() => onFilterChange({ category: 'all' })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-shopora-surface border border-shopora-border text-slate-200 hover:text-shopora-crimson"
            >
              <span>{CATEGORIES.find((c) => c.value === filters.category)?.label}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {filters.brand !== 'all' && (
            <button
              onClick={() => onFilterChange({ brand: 'all' })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-shopora-surface border border-shopora-border text-slate-200 hover:text-shopora-crimson"
            >
              <span>Brand: {filters.brand}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {filters.priceBracket && filters.priceBracket !== 'all' && (
            <button
              onClick={() => onFilterChange({ priceBracket: 'all' })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-shopora-surface border border-shopora-border text-slate-200 hover:text-shopora-crimson"
            >
              <span>{PRICE_BRACKETS.find((b) => b.value === filters.priceBracket)?.label}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {filters.onlyInStock && (
            <button
              onClick={() => onFilterChange({ onlyInStock: false })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-shopora-surface border border-shopora-border text-slate-200 hover:text-shopora-crimson"
            >
              <span>In Stock Only</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-shopora-surface border border-shopora-border text-slate-200 hover:text-shopora-crimson"
            >
              <span>"{filters.searchQuery}"</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div>
          Showing <strong className="text-white font-mono">{totalResults}</strong> matching pair{totalResults === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};

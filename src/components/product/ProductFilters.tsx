import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { ProductCategory, ProductBrand, SortOption, FilterState } from '../../types/product';

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
  return (
    <div className="space-y-6">
      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ category: cat.value })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-shopora-accent text-black font-bold shadow-glow-accent'
                  : 'bg-shopora-card hover:bg-shopora-cardHover text-slate-300 border border-shopora-border'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search, Brand, Sort, In-Stock, Reset */}
      <div className="p-4 rounded-2xl bg-shopora-card/70 border border-shopora-border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, SKU, or colorway..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-9 py-2.5 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
          />
          <Search className="w-4 h-4 text-shopora-muted absolute left-3 top-3" />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-3 text-shopora-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Brand Dropdown */}
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value as ProductBrand | 'all' })}
            aria-label="Filter by Brand"
            className="px-3.5 py-2.5 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-shopora-accent cursor-pointer"
          >
            {BRANDS.map((brand) => (
              <option key={brand.value} value={brand.value} className="bg-shopora-card text-white">
                {brand.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
            aria-label="Sort products"
            className="px-3.5 py-2.5 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-shopora-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((sort) => (
              <option key={sort.value} value={sort.value} className="bg-shopora-card text-white">
                {sort.label}
              </option>
            ))}
          </select>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl cursor-pointer select-none text-xs text-slate-200 hover:border-shopora-border/80">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => onFilterChange({ onlyInStock: e.target.checked })}
              className="accent-[#CCFF00] w-4 h-4 rounded cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          {/* Reset Button */}
          {(filters.searchQuery || filters.category !== 'all' || filters.brand !== 'all' || filters.onlyInStock) && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-shopora-muted hover:text-white text-xs transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Filter summary */}
      <div className="flex items-center justify-between text-xs text-shopora-muted px-1">
        <div>
          Showing <span className="font-mono font-bold text-white">{totalResults}</span> deadstock pair{totalResults === 1 ? '' : 's'}
        </div>
        {filters.searchQuery && (
          <div>
            Results for: <strong className="text-shopora-accent">"{filters.searchQuery}"</strong>
          </div>
        )}
      </div>
    </div>
  );
};

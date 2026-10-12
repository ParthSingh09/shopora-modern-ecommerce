import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag, Check, Shield } from 'lucide-react';
import { Product } from '../../types/product';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => (product.stockBySize[s] ?? 0) > 0) || product.sizes[0]
  );
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart, setDrawerOpen } = useCartStore();
  const { addToast } = useToastStore();

  const isOutOfStock = !product.inStock || Object.values(product.stockBySize).every((qty) => qty <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (!showSizePicker) {
      setShowSizePicker(true);
      return;
    }

    const res = addToCart(product, selectedSize);
    if (res.success) {
      setIsAdded(true);
      addToast(res.message, 'success');
      setTimeout(() => {
        setIsAdded(false);
        setShowSizePicker(false);
      }, 1200);
      setDrawerOpen(true);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleSizeSelect = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-shopora-card border border-shopora-border hover:border-shopora-border/90 hover:shadow-card-elevated transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-shopora-dark/80 flex items-center justify-center">
        {/* Main & Secondary Image Transition */}
        <Link to={`/product/${product.slug}`} className="w-full h-full block">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {isOutOfStock ? (
            <Badge variant="out-of-stock">Sold Out</Badge>
          ) : (
            <>
              {product.isGrail && <Badge variant="grail">Grail</Badge>}
              {product.isLimitedDrop && <Badge variant="limited">Vault Drop</Badge>}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge variant="sale">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Top Right Authenticity Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            <Shield className="w-3 h-3 text-shopora-accent" />
            Verified
          </span>
        </div>

        {/* Quick View Button (Desktop overlay) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 z-10 p-2.5 rounded-xl bg-black/75 hover:bg-black text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/10 shadow-lg hover:scale-105"
            aria-label="Quick view product"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-shopora-muted mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-shopora-accent font-mono">
            {product.brand}
          </span>
          <span className="font-mono text-[11px] text-shopora-muted">{product.sku}</span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.slug}`}
          className="font-display font-bold text-sm sm:text-base text-white hover:text-shopora-accent transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.name}
        </Link>

        {/* Colorway */}
        <p className="text-xs text-shopora-muted truncate mb-3">
          {product.colorway}
        </p>

        {/* Rating and Price row */}
        <div className="mt-auto pt-3 border-t border-shopora-border/40 flex items-center justify-between">
          <div>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono font-bold text-base sm:text-lg text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-xs text-shopora-muted line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Bag or Out of Stock Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 text-xs font-semibold uppercase cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                isAdded
                  ? 'bg-shopora-accent text-black shadow-glow-accent'
                  : 'bg-white/10 hover:bg-shopora-accent hover:text-black text-white hover:shadow-glow-accent'
              }`}
              aria-label={`Add ${product.name} to bag`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Locked</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">{showSizePicker ? 'Confirm' : 'Add'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Expandable Size Selector Drawer inside card on Quick Add */}
        {showSizePicker && !isOutOfStock && (
          <div className="mt-3 pt-3 border-t border-shopora-border animate-fade-in">
            <div className="flex items-center justify-between text-[11px] text-shopora-muted mb-1.5">
              <span>Select Size:</span>
              <span className="text-shopora-accent font-mono font-bold">{selectedSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((s) => {
                const stock = product.stockBySize[s] ?? 0;
                const isAvailable = stock > 0;
                const isSelected = selectedSize === s;

                return (
                  <button
                    key={s}
                    disabled={!isAvailable}
                    onClick={(e) => handleSizeSelect(s, e)}
                    className={`py-1 text-[11px] font-mono rounded border transition-colors ${
                      isSelected
                        ? 'bg-shopora-accent text-black border-shopora-accent font-bold'
                        : isAvailable
                        ? 'bg-shopora-dark text-slate-300 border-shopora-border hover:border-slate-400'
                        : 'bg-transparent text-slate-600 border-white/5 line-through cursor-not-allowed'
                    }`}
                  >
                    {s.replace('US ', '')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

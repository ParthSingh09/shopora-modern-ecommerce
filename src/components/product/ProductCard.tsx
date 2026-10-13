import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isOutOfStock = !product.inStock || Object.values(product.stockBySize).every((qty) => qty <= 0);

  return (
    <article
      className="group relative flex flex-col h-full rounded-2xl bg-shopora-card border border-shopora-border hover:border-shopora-borderLight transition-colors duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-shopora-surface flex items-center justify-center">
        <Link
          to={`/product/${product.slug}`}
          className="w-full h-full block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shopora-accent"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={`${product.name} - ${product.colorway}`}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-50' : ''
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
              {product.isLimitedDrop && <Badge variant="limited">Vault Release</Badge>}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge variant="sale">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Quick View Button (hover / focus trigger) */}
        {onQuickView && !isOutOfStock && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 border border-white/10 text-xs flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-shopora-accent"
            aria-label={`Quick view ${product.name}`}
            title="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Quick View</span>
          </button>
        )}
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-shopora-muted mb-1 font-mono">
          <span className="font-bold text-shopora-accent uppercase tracking-wider">
            {product.brand}
          </span>
          <span>{product.sku}</span>
        </div>

        {/* Title */}
        <h3 className="mb-1">
          <Link
            to={`/product/${product.slug}`}
            className="font-display font-bold text-sm sm:text-base text-white hover:text-shopora-accent transition-colors line-clamp-2 leading-snug focus-visible:ring-2 focus-visible:ring-shopora-accent rounded"
          >
            {product.name}
          </Link>
        </h3>

        {/* Colorway */}
        <p className="text-xs text-shopora-muted truncate mb-3">
          {product.colorway}
        </p>

        {/* Rating and Price row - Pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-shopora-border/60 flex items-center justify-between gap-2">
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

          {/* Action Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-xs font-semibold uppercase cursor-not-allowed select-none"
              aria-label="Sold out"
            >
              Sold Out
            </button>
          ) : (
            <Link
              to={`/product/${product.slug}`}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-shopora-surface hover:bg-shopora-accent hover:text-black text-white border border-shopora-border hover:border-shopora-accent font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-shopora-accent"
              aria-label={`View details and select size for ${product.name}`}
            >
              <span className="hidden sm:inline">Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

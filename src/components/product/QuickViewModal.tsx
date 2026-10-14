import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Check, Shield } from 'lucide-react';
import { Product } from '../../types/product';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  // Keyed by product so size/image selection resets when a different product opens
  return <QuickViewContent key={product.id} product={product} onClose={onClose} />;
};

const QuickViewContent: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => (product.stockBySize[s] ?? 0) > 0) || product.sizes[0]
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart, setDrawerOpen } = useCartStore();
  const { addToast } = useToastStore();

  const isOutOfStock = !product.inStock || Object.values(product.stockBySize).every((s) => s <= 0);
  const currentStockForSize = product.stockBySize[selectedSize] ?? 0;

  const handleAddToCart = () => {
    if (isOutOfStock || currentStockForSize <= 0) return;

    const res = addToCart(product, selectedSize);
    if (res.success) {
      setIsAdded(true);
      addToast(res.message, 'success');
      setTimeout(() => {
        setIsAdded(false);
        onClose();
        setDrawerOpen(true);
      }, 700);
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-shopora-card border border-shopora-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-shopora-muted hover:text-white rounded-lg bg-black/40 hover:bg-black/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:w-1/2 p-6 bg-shopora-dark/80 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-shopora-border">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-shopora-card border border-shopora-border/60 relative">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isGrail && (
              <div className="absolute top-3 left-3">
                <Badge variant="grail">Grail</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border p-0.5 transition-all ${
                    selectedImage === idx ? 'border-shopora-accent' : 'border-shopora-border opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-shopora-accent uppercase mb-1">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-shopora-muted">{product.sku}</span>
            </div>

            <h3 className="font-display font-bold text-xl text-white mb-2 leading-snug">
              {product.name}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <Shield className="w-3.5 h-3.5 text-shopora-accent" />
                <span>Deadstock Certified</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono font-bold text-2xl text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-sm text-shopora-muted line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Select US Size:</span>
                <span className="text-shopora-accent font-mono">
                  {currentStockForSize > 0
                    ? `${currentStockForSize} pairs in stock`
                    : 'Out of stock in this size'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {product.sizes.map((s) => {
                  const stock = product.stockBySize[s] ?? 0;
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === s;

                  return (
                    <button
                      key={s}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-mono rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-shopora-accent text-black border-shopora-accent font-bold'
                          : isAvailable
                          ? 'bg-shopora-dark text-slate-200 border-shopora-border hover:border-slate-400'
                          : 'bg-transparent text-slate-600 border-white/5 line-through cursor-not-allowed'
                      }`}
                    >
                      {s.replace('US ', '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-shopora-border space-y-3">
            <button
              disabled={isOutOfStock || currentStockForSize <= 0}
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isAdded
                  ? 'bg-shopora-accent text-black shadow-glow-accent'
                  : isOutOfStock || currentStockForSize <= 0
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                  : 'bg-shopora-accent hover:bg-shopora-accentHover text-black shadow-glow-accent'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {currentStockForSize <= 0 ? 'Size Out of Stock' : 'Add to Bag'}
                  </span>
                </>
              )}
            </button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-shopora-muted hover:text-white transition-colors"
            >
              <span>View Full Details &amp; Collector Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

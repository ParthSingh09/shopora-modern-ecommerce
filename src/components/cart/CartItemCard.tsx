import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface CartItemCardProps {
  item: CartItem;
  onCloseDrawer?: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onCloseDrawer }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { addToast } = useToastStore();
  const { product, size, color, quantity } = item;

  const maxStock = product.stockBySize[size] ?? 10;

  const handleIncrement = () => {
    if (quantity >= maxStock) {
      addToast(`Only ${maxStock} pairs available in size ${size}`, 'info');
      return;
    }
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeFromCart(item.id);
      addToast(`Removed ${product.name} from bag`, 'info');
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    addToast(`Removed ${product.name} from bag`, 'info');
  };

  return (
    <div className="flex gap-4 p-3.5 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border/70 transition-all group">
      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        onClick={onCloseDrawer}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-shopora-dark overflow-hidden shrink-0 border border-shopora-border/50 relative flex items-center justify-center"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${product.slug}`}
              onClick={onCloseDrawer}
              className="font-display font-bold text-sm text-white hover:text-shopora-accent transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <button
              onClick={handleRemove}
              className="text-shopora-muted hover:text-shopora-crimson p-1 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-shopora-muted mt-0.5">{product.brand}</p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
              {size}
            </span>
            <span className="text-[11px] text-shopora-muted truncate max-w-[120px]">
              {color}
            </span>
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-shopora-border/40">
          <div className="flex items-center border border-shopora-border rounded-lg bg-shopora-dark">
            <button
              onClick={handleDecrement}
              className="p-1.5 text-shopora-muted hover:text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-mono font-semibold text-white">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= maxStock}
              className={`p-1.5 transition-colors ${
                quantity >= maxStock
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-shopora-muted hover:text-white'
              }`}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-sm font-mono font-bold text-shopora-accent">
              ${(product.price * quantity).toLocaleString()}
            </span>
            {quantity > 1 && (
              <p className="text-[10px] text-shopora-muted font-mono">
                (${product.price.toLocaleString()} each)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

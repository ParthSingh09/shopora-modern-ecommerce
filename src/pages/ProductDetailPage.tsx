import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Check,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Product, ProductReview } from '../types/product';
import { api } from '../services/api';
import { ProductGallery } from '../components/product/ProductGallery';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Tagged with the id it was loaded for, so loading is derived rather than toggled
  const [loaded, setLoaded] = useState<{ id: string; product: Product | null } | null>(null);
  const product = loaded?.product ?? null;
  const loading = loaded?.id !== id;
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAdded, setIsAdded] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([]);

  const { addToCart, setDrawerOpen } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    api.getProductById(id).then((p) => {
      if (!isMounted) return;
      setLoaded({ id, product: p });
      if (p) {
        // Find first in-stock size if available
        const firstInStock = p.sizes.find((s) => (p.stockBySize[s] ?? 0) > 0) || '';
        setSelectedSize(firstInStock);
        setSizeError(false);
        setQuantity(1);
        setLocalReviews(p.reviews);

        // Fetch related products
        api.getProducts({ category: p.category }).then((res) => {
          if (!isMounted) return;
          setRelatedProducts(res.products.filter((item) => item.id !== p.id).slice(0, 3));
        });
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-shopora-card rounded-2xl border border-shopora-border" />
          <div className="space-y-4">
            <div className="h-5 bg-shopora-card rounded w-1/4" />
            <div className="h-8 bg-shopora-card rounded w-3/4" />
            <div className="h-6 bg-shopora-card rounded w-1/3" />
            <div className="h-32 bg-shopora-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center" id="main-content">
        <h1 className="text-2xl font-display font-bold text-white uppercase">Silhouette Not Found</h1>
        <p className="text-sm text-shopora-muted mt-2 mb-6">The sneaker grail you requested does not exist in the catalog.</p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-shopora-accent text-black font-bold uppercase text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isCompletelyOutOfStock =
    !product.inStock || Object.values(product.stockBySize).every((qty) => qty <= 0);
  const stockForSelectedSize = selectedSize ? (product.stockBySize[selectedSize] ?? 0) : 0;
  const isSelectedSizeOutOfStock = selectedSize ? stockForSelectedSize <= 0 : false;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      addToast('Please choose an available shoe size before adding to bag.', 'error');
      return;
    }

    if (isCompletelyOutOfStock || isSelectedSizeOutOfStock) {
      addToast('Selected size is currently out of stock.', 'error');
      return;
    }

    const res = addToCart(product, selectedSize, product.colors[0], quantity);
    if (res.success) {
      setIsAdded(true);
      setSizeError(false);
      addToast(res.message, 'success');
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
      setDrawerOpen(true);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      title: 'Verified Collector Feedback',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    addToast('Your demo review has been posted!', 'success');
    setReviewAuthor('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 animate-fade-in" id="main-content">
      {/* Sizing Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Top Nav: Breadcrumbs + Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-shopora-muted">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-white transition-colors">Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-white transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-shopora-accent font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-slate-300 hover:text-shopora-accent transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Drops</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Specifications & Bag Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Brand & Badges */}
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-shopora-accent">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5">
                {product.isGrail && <Badge variant="grail">Grail</Badge>}
                {product.isLimitedDrop && <Badge variant="limited">Vault Release</Badge>}
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* SKU and Colorway */}
            <div className="flex items-center gap-2 text-xs text-shopora-muted mt-2 font-mono">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>Release: {product.releaseYear}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Colorway: <strong className="text-white">{product.colorway}</strong>
            </p>

            {/* Star Rating */}
            <div className="mt-2.5">
              <RatingStars rating={product.rating} reviewCount={localReviews.length} size="md" />
            </div>

            {/* Price Card */}
            <div className="flex items-baseline gap-3 mt-4 p-3.5 rounded-xl bg-shopora-surface border border-shopora-border">
              <span className="font-mono font-black text-2xl sm:text-3xl text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-mono text-sm text-shopora-muted line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select US Size:
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-shopora-accent hover:underline font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((s) => {
                const stock = product.stockBySize[s] ?? 0;
                const isAvailable = stock > 0;
                const isSelected = selectedSize === s;

                return (
                  <button
                    key={s}
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                      setQuantity(1);
                    }}
                    className={`py-2.5 rounded-xl font-mono text-xs flex flex-col items-center justify-center border transition-all focus-visible:ring-2 focus-visible:ring-shopora-accent ${
                      isSelected
                        ? 'bg-shopora-accent text-black border-shopora-accent font-bold'
                        : isAvailable
                        ? 'bg-shopora-card text-slate-200 border-shopora-border hover:border-slate-400'
                        : 'bg-shopora-dark/40 text-slate-600 border-white/5 line-through cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>{s.replace('US ', '')}</span>
                    <span className="text-[10px] opacity-75">
                      {isAvailable ? `${stock} left` : 'Sold'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Size Validation Warning */}
            {sizeError && (
              <p className="mt-2 text-xs text-shopora-crimson flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please select an available size to add to your bag.</span>
              </p>
            )}

            {/* Stock Availability Indicator */}
            <div className="mt-2.5 text-xs">
              {isCompletelyOutOfStock ? (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This deadstock silhouette is completely sold out.</span>
                </div>
              ) : isSelectedSizeOutOfStock ? (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Size {selectedSize} is sold out. Please select another size above.</span>
                </div>
              ) : stockForSelectedSize <= 2 && stockForSelectedSize > 0 ? (
                <p className="text-amber-400 font-mono font-medium">
                  Low inventory: Only {stockForSelectedSize} pair remaining in size {selectedSize}.
                </p>
              ) : stockForSelectedSize > 0 ? (
                <p className="text-emerald-400 font-mono">
                  ✓ Size {selectedSize} is in stock and ready to ship.
                </p>
              ) : null}
            </div>
          </div>

          {/* Quantity Selector + Add to Bag */}
          <div className="flex items-center gap-3 pt-1">
            {/* Quantity */}
            <div className="flex items-center border border-shopora-border rounded-xl bg-shopora-card p-1">
              <button
                disabled={quantity <= 1 || isSelectedSizeOutOfStock || !selectedSize}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-shopora-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                disabled={quantity >= stockForSelectedSize || isSelectedSizeOutOfStock || !selectedSize}
                onClick={() => setQuantity((q) => Math.min(stockForSelectedSize, q + 1))}
                className="p-2 text-shopora-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              id="add-to-cart-button"
              disabled={isCompletelyOutOfStock || isSelectedSizeOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-shopora-accent ${
                isAdded
                  ? 'bg-shopora-accent text-black font-black'
                  : isCompletelyOutOfStock || isSelectedSizeOutOfStock
                  ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  : 'bg-shopora-accent hover:bg-shopora-accentHover text-black'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isCompletelyOutOfStock || isSelectedSizeOutOfStock
                      ? 'Sold Out'
                      : !selectedSize
                      ? 'Choose Size'
                      : 'Add to Bag'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Value Props Box */}
          <div className="p-4 rounded-xl bg-shopora-surface border border-shopora-border space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-shopora-accent shrink-0" />
              <span>100% Deadstock Guarantee • Verified in-hand</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-shopora-cyan shrink-0" />
              <span>Free Insured Courier Shipping on orders over $250</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-shopora-muted shrink-0" />
              <span>14-day unworn returns in original packaging</span>
            </div>
          </div>

          {/* Story & Specifications */}
          <div className="space-y-4 pt-3 border-t border-shopora-border/60">
            <div>
              <h2 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-1.5">
                Silhouette Story &amp; Provenance
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{product.story}</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-1.5">
                Craftsmanship &amp; Materials
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pt-8 border-t border-shopora-border/60" aria-label="Customer Reviews">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Review Summary & Submission */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
                COLLECTOR REVIEWS
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <RatingStars rating={product.rating} reviewCount={localReviews.length} size="md" />
                <span className="text-xs text-emerald-400 font-mono">Curated Demo Feedback</span>
              </div>
            </div>

            {/* Interactive Feedback Form */}
            <form
              onSubmit={handleAddReview}
              className="p-4 rounded-xl bg-shopora-surface border border-shopora-border space-y-3"
            >
              <h3 className="font-display font-bold text-xs text-white uppercase">
                Leave Demo Feedback
              </h3>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus V."
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-lg text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
                />
              </div>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-lg text-xs text-white focus:outline-none focus:border-shopora-accent"
                >
                  <option value={5}>5 Stars - Deadstock Condition</option>
                  <option value={4}>4 Stars - Great Quality</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about fit, materials, or silhouette..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-lg text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-shopora-accent hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-3">
            {localReviews.length === 0 ? (
              <p className="text-xs text-shopora-muted">No reviews yet for this silhouette.</p>
            ) : (
              localReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-shopora-surface border border-shopora-border space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{rev.author}</span>
                    <span className="text-shopora-muted font-mono text-[11px]">{rev.date}</span>
                  </div>

                  <RatingStars rating={rev.rating} />

                  <h3 className="font-semibold text-xs text-white">{rev.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-6 border-t border-shopora-border/60 space-y-4" aria-label="Related Silhouettes">
          <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
            RELATED SILHOUETTES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

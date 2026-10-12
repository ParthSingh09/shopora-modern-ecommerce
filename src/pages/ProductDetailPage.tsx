import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Check,
  Sparkles,
  ChevronRight,
  Minus,
  Plus,
  AlertTriangle,
  Lock,
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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAdded, setIsAdded] = useState(false);

  // New review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([]);

  const { addToCart, setDrawerOpen } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        // Set default size to first in-stock size
        const firstInStock = p.sizes.find((s) => (p.stockBySize[s] ?? 0) > 0) || p.sizes[0];
        setSelectedSize(firstInStock);
        setQuantity(1);
        setLocalReviews(p.reviews);

        // Fetch related products
        api.getProducts({ category: p.category }).then((res) => {
          setRelatedProducts(res.products.filter((item) => item.id !== p.id).slice(0, 3));
        });
      }
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-shopora-card rounded-3xl border border-shopora-border" />
          <div className="space-y-6">
            <div className="h-6 bg-shopora-card rounded w-1/4" />
            <div className="h-10 bg-shopora-card rounded w-3/4" />
            <div className="h-8 bg-shopora-card rounded w-1/3" />
            <div className="h-40 bg-shopora-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-display font-bold text-white">Product Not Found</h2>
        <p className="text-shopora-muted mt-2 mb-6">The sneaker grail you are looking for has been archived.</p>
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
  const stockForSelectedSize = product.stockBySize[selectedSize] ?? 0;
  const isSelectedSizeOutOfStock = stockForSelectedSize <= 0;

  const handleAddToCart = () => {
    if (isCompletelyOutOfStock || isSelectedSizeOutOfStock) return;

    const res = addToCart(product, selectedSize, product.colors[0], quantity);
    if (res.success) {
      setIsAdded(true);
      addToast(res.message, 'success');
      setTimeout(() => {
        setIsAdded(false);
      }, 1200);
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
      title: 'Verified Collector Review',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    addToast('Your review has been verified and posted!', 'success');
    setReviewAuthor('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-fade-in">
      {/* Sizing Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-shopora-muted">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white transition-colors">Drops</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-shopora-accent font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Purchase Controls & Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Brand & Badges */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-shopora-accent">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                {product.isGrail && <Badge variant="grail">Grail</Badge>}
                {product.isLimitedDrop && <Badge variant="limited">Vault Release</Badge>}
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* SKU and Colorway */}
            <div className="flex items-center gap-3 text-xs text-shopora-muted mt-2 font-mono">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>Release Year: {product.releaseYear}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Colorway: <strong className="text-white">{product.colorway}</strong>
            </p>

            {/* Rating Stars */}
            <div className="mt-3">
              <RatingStars rating={product.rating} reviewCount={localReviews.length} size="md" />
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-5 p-4 rounded-2xl bg-shopora-card border border-shopora-border">
              <span className="font-mono font-black text-3xl sm:text-4xl text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-mono text-base text-shopora-muted line-through">
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
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select US Men's Size:
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-shopora-accent hover:underline font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
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
                      setQuantity(1);
                    }}
                    className={`py-3 rounded-xl font-mono text-xs flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-shopora-accent text-black border-shopora-accent font-bold shadow-glow-accent scale-105'
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

            {/* Stock Availability Alert */}
            <div className="mt-3">
              {isCompletelyOutOfStock ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-900/40 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>This grail is completely deadstock sold out. Check back for vault restocks.</span>
                </div>
              ) : isSelectedSizeOutOfStock ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-900/40 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Size {selectedSize} is out of stock. Please select another size above.</span>
                </div>
              ) : stockForSelectedSize <= 2 ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>High demand: Only {stockForSelectedSize} pair remaining in size {selectedSize}!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>In Stock &amp; ready for immediate vault dispatch</span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector and Add to Bag */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity */}
            <div className="flex items-center border border-shopora-border rounded-xl bg-shopora-card p-1">
              <button
                disabled={quantity <= 1 || isSelectedSizeOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-shopora-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                disabled={quantity >= stockForSelectedSize || isSelectedSizeOutOfStock}
                onClick={() => setQuantity((q) => Math.min(stockForSelectedSize, q + 1))}
                className="p-2.5 text-shopora-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
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
              className={`flex-1 py-4 rounded-xl font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isAdded
                  ? 'bg-shopora-accent text-black shadow-glow-accent'
                  : isCompletelyOutOfStock || isSelectedSizeOutOfStock
                  ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                  : 'bg-shopora-accent hover:bg-shopora-accentHover text-black shadow-glow-accent hover:scale-[1.02]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Locked into Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isSelectedSizeOutOfStock ? 'Selected Size Sold Out' : 'Lock into Bag'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Value Props Box */}
          <div className="p-4 rounded-2xl bg-shopora-card/50 border border-shopora-border space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-shopora-accent shrink-0" />
              <span>100% Guaranteed Authentic with NFC Tamper Seal Tag</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-shopora-cyan shrink-0" />
              <span>Free Insured Armored Shipping on orders over $250</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-shopora-muted shrink-0" />
              <span>14-day unworn deadstock return guarantee</span>
            </div>
          </div>

          {/* Story & Materials Accordion */}
          <div className="space-y-4 pt-4 border-t border-shopora-border">
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2">
                Silhouette Story &amp; Provenance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{product.story}</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2">
                Materials &amp; Craftsmanship
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collector Reviews Section */}
      <section className="pt-8 border-t border-shopora-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Review Summary & Write Form */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                COLLECTOR VERIFIED REVIEWS
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <RatingStars rating={product.rating} reviewCount={localReviews.length} size="md" />
                <span className="text-xs text-emerald-400 font-mono">100% Verified Buyers</span>
              </div>
            </div>

            {/* Interactive Write Review Form */}
            <form
              onSubmit={handleAddReview}
              className="p-5 rounded-2xl bg-shopora-card border border-shopora-border space-y-4"
            >
              <h4 className="font-display font-bold text-sm text-white uppercase">
                Submit In-Hand Feedback
              </h4>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan V."
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
                />
              </div>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white focus:outline-none focus:border-shopora-accent"
                >
                  <option value={5}>5 Stars - Deadstock Grail Condition</option>
                  <option value={4}>4 Stars - High Quality</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-shopora-muted mb-1">Your Thoughts</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell other collectors about materials, fit, or packaging..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-shopora-accent hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Post Collector Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {localReviews.length === 0 ? (
              <p className="text-sm text-shopora-muted">No reviews yet for this silhouette.</p>
            ) : (
              localReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-shopora-card border border-shopora-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{rev.author}</span>
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-shopora-accent px-2 py-0.5 rounded bg-shopora-accent/10 border border-shopora-accent/30">
                          <Check className="w-3 h-3" />
                          VERIFIED PURCHASE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-shopora-muted">{rev.date}</span>
                  </div>

                  <RatingStars rating={rev.rating} />

                  <h5 className="font-semibold text-xs text-white">{rev.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-shopora-border space-y-6">
          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            MORE FROM THIS SILHOUETTE CATEGORY
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

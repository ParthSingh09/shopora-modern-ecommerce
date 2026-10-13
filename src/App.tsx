import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LookbookPage } from './pages/LookbookPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  const basename =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/shopora-modern-ecommerce')
      ? '/shopora-modern-ecommerce'
      : undefined;

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0A0B0E] text-slate-100 flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
        {/* Floating notifications */}
        <ToastContainer />

        {/* Global Cart Slide-Over Drawer */}
        <CartDrawer />

        {/* Announcement Ticker Bar */}
        <AnnouncementBar />

        {/* Sticky Glass Navbar */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Street Culture Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

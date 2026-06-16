import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Search, Menu, X, ChevronRight, Globe, Package, Truck, ArrowRight } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function EcommerceStore() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, suppliersRes] = await Promise.all([
          fetch(`${API_URL}/products`).then(r => r.json()),
          fetch(`${API_URL}/suppliers`).then(r => r.json())
        ]);
        setProducts(productsRes);
        setSuppliers(suppliersRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    updateCartTotal(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    updateCartTotal(newCart);
  };

  const updateCartTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    updateCartTotal(newCart);
  };

  const getFilteredProducts = () => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              ✨ LUXE
            </div>
            <span className="text-xs font-semibold text-gray-600">SA</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-sm font-medium transition ${currentPage === 'home' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`}
            >
              Shop
            </button>
            <button
              onClick={() => setCurrentPage('suppliers')}
              className={`text-sm font-medium transition ${currentPage === 'suppliers' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-sm font-medium transition ${currentPage === 'about' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`}
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-700 hover:text-pink-600 transition"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden pb-4 space-y-3">
            <button
              onClick={() => { setCurrentPage('home'); setMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50"
            >
              Shop
            </button>
            <button
              onClick={() => { setCurrentPage('suppliers'); setMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50"
            >
              Suppliers
            </button>
            <button
              onClick={() => { setCurrentPage('about'); setMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50"
            >
              About
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Home Page with Hero
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Beauty</span> Game
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Premium fashion accessories, hair extensions, and professional nail products. Sourced directly from top South African suppliers at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                Shop Now
              </button>
              <button
                onClick={() => setCurrentPage('suppliers')}
                className="px-8 py-3 border-2 border-pink-600 text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition"
              >
                Find Suppliers
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="text-9xl">✨💅👑</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Nationwide delivery in 2-5 business days</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Wholesale prices passed directly to you</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products verified and tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            >
              <option value="all">All Categories</option>
              <option value="hair">Hair Products</option>
              <option value="nails">Nail Products</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12">Featured Products</h2>
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredProducts().map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-8 text-center text-6xl h-48 flex items-center justify-center">
                  {product.image}
                </div>
                <div className="p-6">
                  <p className="text-xs text-pink-600 font-semibold mb-2">{product.category.toUpperCase()}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Supplier: {product.supplier}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-pink-600">R{product.price}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {product.stock} in stock
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  // Suppliers Page
  const SuppliersPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Premium Suppliers</h1>
          <p className="text-pink-100 text-lg">Connect directly with verified, affordable South African suppliers</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-8">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{supplier.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-semibold text-gray-900">{supplier.rating}/5</span>
                </div>
                <p className="text-pink-600 font-semibold text-sm mb-3">{supplier.category}</p>
              </div>

              <div className="space-y-2 mb-6 text-gray-700 text-sm">
                <div className="flex items-start gap-2">
                  <Globe size={16} className="text-pink-600 mt-1 flex-shrink-0" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Package size={16} className="text-pink-600 mt-1 flex-shrink-0" />
                  <span>Min Order: {supplier.minOrder}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck size={16} className="text-pink-600 mt-1 flex-shrink-0" />
                  <span>Lead Time: {supplier.leadTime}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span> {supplier.contact}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Phone:</span> {supplier.phone}
                </p>
              </div>

              <button
                onClick={() => alert(`Opening contact form for ${supplier.name}. In production, this opens a contact modal.`)}
                className="w-full mt-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                Get in Touch <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About LUXE SA</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Premier Beauty & Fashion Destination</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            LUXE SA was founded with a mission to democratize access to premium beauty and fashion products across South Africa. We partner exclusively with verified, affordable suppliers to bring you the best quality at unbeatable prices.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Whether you're looking for luxury hair extensions, professional nail supplies, or stunning fashion accessories, we've got you covered with products sourced directly from trusted South African distributors.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Why Choose LUXE SA?</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-gray-700"><strong>Direct from Suppliers:</strong> We bypass middlemen to offer unbeatable prices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-gray-700"><strong>Quality Verified:</strong> Every product is tested and approved by our team</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-gray-700"><strong>Local Focus:</strong> Supporting South African suppliers and businesses</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-gray-700"><strong>Fast Delivery:</strong> Nationwide delivery in 2-5 business days</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-gray-700"><strong>Secure Payments:</strong> PayFast integration for safe transactions</span>
            </li>
          </ul>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-gray-900 mb-2">Newsletter</h3>
            <p className="text-gray-700 mb-4">Get exclusive deals and new product announcements.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Cart Sidebar
  const CartSidebar = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
        showCart ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowCart(false)}
    >
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={() => setShowCart(false)} className="text-gray-600 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-pink-600 font-bold">R{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-300 rounded text-sm"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-300 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-6 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-pink-600">R{cartTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              setCurrentPage('checkout');
              setShowCart(false);
            }}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );

  // Checkout Page
  const CheckoutPage = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Secure Checkout</h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 border-b pb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-semibold">R{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-4">
                  <span>Total:</span>
                  <span className="text-pink-600">R{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                alert('Payment integration with PayFast would process here. Order confirmed!');
                setCart([]);
                setCurrentPage('home');
              }}>
                <div className="space-y-4">
                  <h2 className="text-lg font-bold">Delivery Information</h2>
                  <input type="text" placeholder="Full Name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="email" placeholder="Email Address" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="tel" placeholder="Phone Number" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="text" placeholder="Street Address" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="text" placeholder="City" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-bold hover:shadow-lg transition text-lg"
                >
                  Proceed to Payment (PayFast)
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'suppliers':
        return <SuppliersPage />;
      case 'about':
        return <AboutPage />;
      case 'checkout':
        return <CheckoutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {renderPage()}
      <CartSidebar />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">LUXE SA</h3>
              <p className="text-sm">Premium beauty & fashion products for South Africa.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Shop</h4>
              <ul className="text-sm space-y-2">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-pink-600">Hair Products</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-pink-600">Nail Products</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-pink-600">Accessories</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="text-sm space-y-2">
                <li><button onClick={() => setCurrentPage('suppliers')} className="hover:text-pink-600">Find Suppliers</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-pink-600">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-pink-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-pink-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 LUXE SA. All rights reserved. | Premium South African Beauty & Fashion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

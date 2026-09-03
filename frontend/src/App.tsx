import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import SplashScreen from './components/common/SplashScreen'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import AddressesPage from './pages/AddressesPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import RewardsPage from './pages/RewardsPage'
import RecommendationsPage from './pages/RecommendationsPage'
import WishlistPage from './pages/WishlistPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminBooksPage from './pages/admin/AdminBooksPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminBrandsPage from './pages/admin/AdminBrandsPage'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashDone = () => setShowSplash(false)

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />

        {/* Protected (authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="rewards" element={<RewardsPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/books" element={<AdminBooksPage />} />
          <Route path="admin/categories" element={<AdminCategoriesPage />} />
          <Route path="admin/brands" element={<AdminBrandsPage />} />
        </Route>
      </Route>
    </Routes>
    </>
  )
}

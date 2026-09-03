import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useTheme } from '../../hooks/useTheme'
import Logo from '../common/Logo'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Logo size="sm" />

        {/* Desktop Nav Links — never shift, search is overlaid below */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
            Books
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
            Recommendations
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {/* Search icon — always fixed width, never expands inline */}
          <div className="navbar-search-wrap">
            <button
              className={`navbar-icon-btn${searchOpen ? ' search-active' : ''}`}
              onClick={() => setSearchOpen(s => !s)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              )}
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            className="navbar-icon-btn navbar-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link to="/wishlist" className="navbar-icon-btn navbar-cart" aria-label="Wishlist">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar-cart-badge" aria-label={`${wishlistCount} items in wishlist`}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" className="navbar-icon-btn navbar-cart" aria-label="Shopping cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="navbar-cart-badge" aria-label={`${itemCount} items in cart`}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Menu / Auth */}
          {isAuthenticated ? (
            <div className="navbar-user-menu" ref={userMenuRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="navbar-avatar" aria-hidden="true">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="navbar-username">{user?.firstName}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
                  style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown" role="menu">
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-name">{user?.firstName} {user?.lastName}</div>
                    <div className="navbar-dropdown-email">{user?.email}</div>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  <Link to="/orders" className="navbar-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                      <path d="M9 12h6M9 16h4" />
                    </svg>
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="navbar-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Wishlist {wishlistCount > 0 && <span className="navbar-dropdown-badge">{wishlistCount}</span>}
                  </Link>
                  <Link to="/rewards" className="navbar-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Rewards
                  </Link>
                  <Link to="/addresses" className="navbar-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    Addresses
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="navbar-dropdown-divider" />
                      <Link to="/admin" className="navbar-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                        </svg>
                        Admin Panel
                      </Link>
                    </>
                  )}
                  <div className="navbar-dropdown-divider" />
                  <button className="navbar-dropdown-item danger" role="menuitem" onClick={handleLogout}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Search overlay — absolutely positioned below navbar so nav links never shift */}
      {searchOpen && (
        <div className="navbar-search-overlay">
          <form onSubmit={handleSearch} className="navbar-search-overlay-form">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="overlay-search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="overlay-search-input"
              placeholder="Search books by title, author, or ISBN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setTimeout(() => setSearchOpen(false), 150) }}
              autoComplete="off"
            />
            {searchQuery && (
              <button type="button" className="navbar-icon-btn overlay-clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            <button type="submit" className="overlay-search-submit">Search</button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} className="mobile-search-form">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mobile-search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search books..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="mobile-menu-section">
            <NavLink to="/" end className="mobile-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/books" className="mobile-link" onClick={() => setMenuOpen(false)}>Books</NavLink>
            <NavLink to="/recommendations" className="mobile-link" onClick={() => setMenuOpen(false)}>Recommendations</NavLink>
          </div>

          {isAuthenticated ? (
            <>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-section">
                <NavLink to="/cart" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Cart {itemCount > 0 && <span className="mobile-badge">{itemCount}</span>}
                </NavLink>
                <NavLink to="/wishlist" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Wishlist {wishlistCount > 0 && <span className="mobile-badge">{wishlistCount}</span>}
                </NavLink>
                <NavLink to="/orders" className="mobile-link" onClick={() => setMenuOpen(false)}>Orders</NavLink>
                <NavLink to="/rewards" className="mobile-link" onClick={() => setMenuOpen(false)}>Rewards</NavLink>
                <NavLink to="/addresses" className="mobile-link" onClick={() => setMenuOpen(false)}>Addresses</NavLink>
              </div>
              {isAdmin && (
                <>
                  <div className="mobile-menu-divider" />
                  <NavLink to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
                </>
              )}
              <div className="mobile-menu-divider" />
              <button className="mobile-link danger" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <div className="mobile-menu-divider" />
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="mobile-link mobile-link-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--navbar-bg, #0d0c0a);
          height: var(--navbar-height);
          transition: box-shadow 0.2s ease, background 0.3s ease;
          border-bottom: 1px solid var(--navbar-border, rgba(255,255,255,0.08));
        }
        .navbar-scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .navbar-theme-btn { transition: all 0.2s; }
        .navbar-theme-btn:hover { background: rgba(255,255,255,0.12) !important; color: var(--accent, #f5df3a) !important; }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          gap: 1.5rem;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.125rem;
          flex: 1;
          justify-content: center;
        }
        .navbar-link {
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
          text-decoration: none;
        }
        .navbar-link:hover { background: rgba(255,255,255,0.1); color: white; }
        .navbar-link.active { background: rgba(26,86,219,0.4); color: white; font-weight: 700; }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-shrink: 0;
        }
        .navbar-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          color: rgba(255,255,255,0.75);
          transition: all 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }
        .navbar-icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .navbar-cart { position: relative; }
        .navbar-cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--danger);
          color: white;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 17px;
          height: 17px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 2px solid var(--navbar-badge-border, #0d0c0a);
          line-height: 1;
        }
        /* Search icon button — always fixed width, never expands inline */
        .navbar-search-wrap { display: flex; align-items: center; }
        .search-active { background: rgba(255,255,255,0.14) !important; color: white !important; }
        /* Search overlay — slides down below navbar without moving any nav items */
        .navbar-search-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--navbar-bg, #0d0c0a);
          border-bottom: 1px solid var(--navbar-border, rgba(255,255,255,0.1));
          padding: 0.75rem 1.5rem;
          z-index: 98;
          animation: slideDown 0.18s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        }
        .navbar-search-overlay-form {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-md);
          padding: 0 0.625rem;
          gap: 0.5rem;
          height: 42px;
        }
        .overlay-search-icon { color: rgba(255,255,255,0.5); flex-shrink: 0; }
        .overlay-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.9rem;
          min-width: 0;
        }
        .overlay-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .overlay-clear-btn { width: 28px; height: 28px; color: rgba(255,255,255,0.5); flex-shrink: 0; }
        .overlay-search-submit {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          padding: 0.3rem 0.875rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .overlay-search-submit:hover { background: var(--primary-dark, #1648b8); }
        /* User menu */
        .navbar-user-menu { position: relative; }
        .navbar-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.325rem 0.625rem 0.325rem 0.375rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.2s;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          height: 38px;
        }
        .navbar-user-btn:hover { background: rgba(255,255,255,0.14); color: white; }
        .navbar-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #7c3aed);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.75rem;
          flex-shrink: 0;
        }
        .navbar-username {
          font-size: 0.85rem;
          font-weight: 600;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .navbar-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          min-width: 228px;
          z-index: 200;
          overflow: hidden;
          animation: scaleIn 0.15s ease;
        }
        .navbar-dropdown-header {
          padding: 0.875rem 1rem;
          background: var(--bg-secondary);
        }
        .navbar-dropdown-name { font-weight: 700; font-size: 0.875rem; color: var(--text-primary); }
        .navbar-dropdown-email { font-size: 0.73rem; color: var(--text-secondary); margin-top: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .navbar-dropdown-divider { height: 1px; background: var(--border-light); }
        .navbar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          width: 100%;
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          text-align: left;
        }
        .navbar-dropdown-item:hover { background: var(--bg-secondary); }
        .navbar-dropdown-item.danger { color: var(--danger); }
        .navbar-dropdown-item.danger:hover { background: var(--danger-light); }
        .navbar-dropdown-badge {
          margin-left: auto;
          background: var(--primary);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.1em 0.45em;
          border-radius: 10px;
        }
        .navbar-auth { display: flex; align-items: center; gap: 0.5rem; }
        .navbar-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          color: rgba(255,255,255,0.8);
          background: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .navbar-hamburger:hover { background: rgba(255,255,255,0.1); color: white; }
        /* Mobile menu */
        .navbar-mobile-menu {
          background: var(--gray-900);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 0.75rem 0 1rem;
          animation: slideDown 0.2s ease;
        }
        .mobile-search-form {
          display: flex;
          align-items: center;
          margin: 0 1rem 0.75rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-md);
          padding: 0 0.875rem;
          gap: 0.5rem;
          height: 40px;
        }
        .mobile-search-icon { color: rgba(255,255,255,0.4); flex-shrink: 0; }
        .mobile-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.9rem;
        }
        .mobile-search-input::placeholder { color: rgba(255,255,255,0.35); }
        .mobile-menu-section { display: flex; flex-direction: column; }
        .mobile-menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0.5rem 0; }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }
        .mobile-link:hover, .mobile-link.active { background: rgba(255,255,255,0.07); color: white; }
        .mobile-link.danger { color: #fca5a5; }
        .mobile-link.danger:hover { background: rgba(239,68,68,0.12); color: #f87171; }
        .mobile-link-primary { color: #93c5fd; font-weight: 600; }
        .mobile-link-primary:hover { color: #bfdbfe; background: rgba(26,86,219,0.15); }
        .mobile-badge {
          background: var(--danger);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.1em 0.45em;
          border-radius: 10px;
          margin-left: 0.25rem;
        }
        @media (max-width: 900px) {
          .navbar-links { display: none; }
        }
        @media (max-width: 768px) {
          .navbar-username { display: none; }
          .navbar-hamburger { display: flex; }
          .navbar-auth .btn-ghost { display: none; }
          .navbar-search-form { width: 160px; }
        }
        @media (min-width: 769px) {
          .navbar-mobile-menu { display: none; }
        }
        @media (max-width: 480px) {
          .navbar-search-wrap { display: none; }
        }
      `}</style>
    </nav>
  )
}

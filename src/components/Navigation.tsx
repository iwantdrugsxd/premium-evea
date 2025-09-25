'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Info, Building, Users } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    // Check if user is logged in (this would come from your auth context)
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };

    // Close mobile menu on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    checkAuthStatus();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowAboutDropdown(false);
    setShowProfileDropdown(false);
  };

  const aboutMenuItems = [
    { href: '/about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { href: '/careers', label: 'Careers', icon: <Building className="w-4 h-4" /> },
    { href: '/community', label: 'Community', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-5 bg-black/90 backdrop-blur-md border-b border-white/5' 
          : 'py-8 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black">
            <span className="gradient-text">EVEA</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/plan-event">Plan Event</NavLink>
            
            {/* About EVEA Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                About EVEA
                <ChevronDown className={`w-4 h-4 transition-transform ${showAboutDropdown ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>

              {/* About Dropdown */}
              <AnimatePresence>
                {showAboutDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
                  >
                    <div className="py-2">
                      {aboutMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowAboutDropdown(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            
            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login"
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              whileTap={{ scale: 0.95 }}
              className="text-white p-2 relative z-50"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={showMobileMenu ? { rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  className="block w-6 h-0.5 bg-white mb-1"
                  animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white mb-1"
                  animate={showMobileMenu ? { rotate: -90, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white"
                  animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-50 pt-20 pb-8"
            >
              <div className="max-w-7xl mx-auto px-6">
                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-6">
                  <MobileNavLink href="/" onClick={closeMobileMenu}>
                    Home
                  </MobileNavLink>
                  
                  <MobileNavLink href="/plan-event" onClick={closeMobileMenu}>
                    Plan Event
                  </MobileNavLink>
                  
                  {/* Mobile About Section */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                      className="flex items-center justify-between w-full text-left text-white text-lg font-medium py-2"
                    >
                      About EVEA
                      <ChevronDown className={`w-5 h-5 transition-transform ${showAboutDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showAboutDropdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 space-y-3"
                        >
                          {aboutMenuItems.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2"
                              onClick={closeMobileMenu}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Mobile Auth Section */}
                  <div className="pt-4 border-t border-white/10">
                    {isLoggedIn ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <span className="text-white font-medium">{user?.fullName || 'User'}</span>
                        </div>
                        
                        <div className="space-y-2 pl-4">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2"
                            onClick={closeMobileMenu}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2"
                            onClick={closeMobileMenu}
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="block w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full font-semibold text-white text-center hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="text-white text-lg font-medium py-2 hover:text-pink-400 transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

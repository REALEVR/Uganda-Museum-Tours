import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [location] = useLocation();
  const { user, logout, openLoginModal, openRegisterModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Museums", path: "/museums" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md uganda-pattern-border top">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Name */}
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
              <i className="ri-gallery-line text-white text-xl"></i>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-xl text-primary">Uganda Virtual Museums</h1>
              <p className="text-xs text-black bg-white px-2 py-0.5 rounded">Ekiziba ky'Obuwangwa Bwaffe</p>
            </div>
          </div>
        </Link>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center">
  <div className="flex items-center space-x-1">
    {navLinks.map((link) => (
      <Link key={link.path} href={link.path}>
        <div className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          location === link.path 
            ? 'text-primary bg-primary/10' 
            : 'text-primary/70 hover:text-primary hover:bg-primary/5'
        }`}>
          {link.name}
        </div>
      </Link>
    ))}
  </div>
</nav>
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div className={`font-medium hover:text-primary transition cursor-pointer ${location === link.path ? 'text-primary' : 'text-primary/80'}`}>
                {link.name}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="px-4 py-2 text-primary/80 hover:text-primary button-hover-effect" aria-label="Search">
            <i className="ri-search-line mr-1"></i> <span className="hidden md:inline">Search</span>
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/account">
                <Button variant="ghost" className="px-4 py-2 text-primary/80 hover:text-primary button-hover-effect">
                  <i className="ri-user-line mr-1"></i> <span className="hidden md:inline">{user.username}</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="px-4 py-2 text-primary/80 hover:text-primary button-hover-effect">
                  <i className="ri-bar-chart-line mr-1"></i> <span className="hidden md:inline">Analytics</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white button-hover-effect"
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white button-hover-effect"
              onClick={openLoginModal}
            >
              Sign In
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" aria-label="Menu">
                <i className="ri-menu-line text-xl"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <div 
                      className={`py-2 px-4 rounded-md font-medium cursor-pointer ${location === link.path ? 'bg-primary/10 text-primary' : 'text-primary/80 hover:bg-primary/5'}`}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </div>
                  </Link>
                ))}
                
                {!user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary/90 button-hover-effect"
                      onClick={() => {
                        closeMenu();
                        openLoginModal();
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white button-hover-effect"
                      onClick={() => {
                        closeMenu();
                        openRegisterModal();
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
                
                {user && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href="/analytics">
                      <div 
                        className="py-2 px-4 rounded-md font-medium bg-primary/10 text-primary cursor-pointer"
                        onClick={closeMenu}
                      >
                        <i className="ri-bar-chart-line mr-1"></i> Analytics Dashboard
                      </div>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white button-hover-effect"
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

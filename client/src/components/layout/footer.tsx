import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-white/80 pt-16 pb-8 uganda-pattern-border bottom">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                <i className="ri-gallery-line text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Uganda Virtual Museums</h3>
                <p className="text-xs text-secondary">Ekiziba ky'Obuwangwa Bwaffe</p>
              </div>
            </div>
            <p className="mb-4">
              Bringing Uganda's rich cultural heritage to the global audience through immersive virtual experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition button-hover-effect" aria-label="Facebook">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition button-hover-effect" aria-label="Twitter">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition button-hover-effect" aria-label="Instagram">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition button-hover-effect" aria-label="YouTube">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <div className="hover:text-white transition cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/museums">
                  <div className="hover:text-white transition cursor-pointer">Museums</div>
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works">
                  <div className="hover:text-white transition cursor-pointer">How It Works</div>
                </Link>
              </li>
              <li>
                <Link href="/#pricing">
                  <div className="hover:text-white transition cursor-pointer">Pricing</div>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <div className="hover:text-white transition cursor-pointer">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <div className="hover:text-white transition cursor-pointer">Contact</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help">
                  <div className="hover:text-white transition cursor-pointer">Help Center</div>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <div className="hover:text-white transition cursor-pointer">FAQs</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="hover:text-secondary transition cursor-pointer">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <div className="hover:text-secondary transition cursor-pointer">Terms of Service</div>
                </Link>
              </li>
              <li>
                <Link href="/refund">
                  <div className="hover:text-secondary transition cursor-pointer">Refund Policy</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Stay Updated</h3>
            <p className="mb-4">Subscribe to our newsletter for updates on new museums and features.</p>
            <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-md w-full bg-white/10 border border-white/20 outline-none focus:border-secondary"
                  aria-label="Email address" 
                />
                <button 
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded-r-md hover:bg-secondary/90 transition button-hover-effect"
                  aria-label="Subscribe"
                >
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
            </form>
            <p className="text-xs text-white/60">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Uganda Virtual Museums. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="text-sm font-medium text-white/70">Secured by SSL</div>
            <div className="text-sm font-medium text-white/70">Privacy Verified</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

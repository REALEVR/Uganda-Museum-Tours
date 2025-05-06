import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/">
              <a className="text-2xl font-semibold tracking-tighter">
                <span className="sky-accent">Uganda</span>VR
              </a>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Explore Uganda's rich cultural heritage through immersive virtual tours of museums across the country.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-sm hover:text-primary transition-colors">
                    {t('common.home')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/museums">
                  <a className="text-sm hover:text-primary transition-colors">
                    {t('common.museums')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Museums</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/museums/1">
                  <a className="text-sm hover:text-primary transition-colors">
                    Ssemagulu Museum
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/museums/7">
                  <a className="text-sm hover:text-primary transition-colors">
                    Museum of Technology
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="text-sm hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-sm hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} UgandaVR. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://visituganda.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Visit Uganda Tourism Board
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
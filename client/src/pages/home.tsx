import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Globe, History, PanelTop } from 'lucide-react';
import MuseumCard from '@/components/museum-card';
import { Museum } from '@shared/schema';

const Home = () => {
  const { t } = useTranslation();
  const [heroVisible, setHeroVisible] = useState(false);

  // Fetch featured museums
  const { data: museums } = useQuery({
    queryKey: ['/api/museums'],
    select: (data: Museum[]) => {
      // Identify featured museums (Ssemagulu Museum and Museum of Technology)
      return data.map(museum => ({
        ...museum,
        featured: [1, 7].includes(museum.id), // IDs of Ssemagulu Museum and Museum of Technology
        technology: museum.id === 1 || museum.id === 7 ? 'RealEVR' : 'Panellum'
      })).slice(0, 3); // Only show 3 museums on homepage
    }
  });

  // Animate hero section on mount
  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const scrollToNextSection = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="tesla-section hero relative bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#3e6ae1_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto h-screen flex flex-col justify-between z-10">
          {/* Main Hero Content */}
          <div className="flex flex-col items-center justify-center text-center h-full pt-16">
            <div className={`transition-all duration-1000 ease-out transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="tesla-headline mb-4 max-w-4xl">
                {t('home.hero.title')}
              </h1>
              
              <p className="tesla-subheadline mb-10 text-muted-foreground">
                {t('home.hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link href="/museums">
                  <a className="tesla-button primary">
                    {t('home.hero.cta')}
                  </a>
                </Link>
                
                <Link href="/museums/1">
                  <a className="tesla-button secondary">
                    Ssemagulu Museum
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className={`pb-8 flex justify-center transition-opacity duration-1000 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={scrollToNextSection}
              className="animate-bounce bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
              aria-label="Scroll to features"
            >
              <ChevronDown className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="tesla-section py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-medium tracking-tight mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <PanelTop className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                {t('home.features.feature1.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.features.feature1.description')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                {t('home.features.feature2.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.features.feature2.description')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <History className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                {t('home.features.feature3.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.features.feature3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Museums Section */}
      <section className="tesla-section py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-medium tracking-tight">
              {t('home.museums.title')}
            </h2>
            
            <Link href="/museums">
              <a className="flex items-center text-primary hover:underline">
                {t('home.museums.viewAll')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {museums?.map((museum) => (
              <MuseumCard key={museum.id} museum={museum} />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Ugandan Museums Banner */}
      <section className="tesla-section py-24 bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl font-medium tracking-tight mb-4">
              Experience the Best of Ugandan Cultural Heritage
            </h2>
            
            <p className="mb-8 text-white/90">
              Our pioneering museums showcase Uganda's rich history, art, and technological innovation through cutting-edge virtual reality experiences.
            </p>
            
            <Link href="/museums/1">
              <a className="tesla-button bg-white text-primary hover:bg-white/90">
                Explore Ssemagulu Museum
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="tesla-section py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-medium tracking-tight text-center mb-16">
            {t('home.pricing.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Single Museum Pass */}
            <div className="tesla-card p-8 flex flex-col h-full">
              <h3 className="text-xl font-medium mb-2">{t('home.pricing.singlePass')}</h3>
              <div className="text-3xl font-medium mb-1">$8.99</div>
              <p className="text-muted-foreground text-sm mb-6">
                30 {t('home.pricing.days')} • 1 {t('home.pricing.perMuseum')}
              </p>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to one museum of your choice</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full 360° virtual tour experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Detailed cultural and historical information</span>
                </li>
              </ul>
              
              <Link href="/museums">
                <a className="tesla-button primary w-full">
                  {t('home.pricing.buyNow')}
                </a>
              </Link>
            </div>
            
            {/* Pioneer Museums Bundle */}
            <div className="tesla-card p-8 flex flex-col h-full relative bg-gradient-to-b from-primary/5 to-transparent border-primary/20">
              <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
              <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-sm font-medium uppercase tracking-wider">
                Popular
              </div>
              
              <h3 className="text-xl font-medium mb-2">{t('home.pricing.bundlePass')}</h3>
              <div className="text-3xl font-medium mb-1">$14.99</div>
              <p className="text-muted-foreground text-sm mb-6">
                30 {t('home.pricing.days')} • 2 {t('home.pricing.perMuseum')}
              </p>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to Ssemagulu Museum and Museum of Technology</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Premium RealEVR visualization technology</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save 20% compared to individual passes</span>
                </li>
              </ul>
              
              <Link href="/museums">
                <a className="tesla-button primary w-full">
                  {t('home.pricing.buyNow')}
                </a>
              </Link>
            </div>
            
            {/* All Access Pass */}
            <div className="tesla-card p-8 flex flex-col h-full">
              <h3 className="text-xl font-medium mb-2">{t('home.pricing.allAccess')}</h3>
              <div className="text-3xl font-medium mb-1">$29.99</div>
              <p className="text-muted-foreground text-sm mb-6">
                30 {t('home.pricing.days')} • {t('home.pricing.allMuseums')}
              </p>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited access to all museums</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All premium RealEVR and Panellum experiences</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save over 40% compared to individual passes</span>
                </li>
              </ul>
              
              <Link href="/museums">
                <a className="tesla-button primary w-full">
                  {t('home.pricing.buyNow')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
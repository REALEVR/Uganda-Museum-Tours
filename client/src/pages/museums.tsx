import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import MuseumCard from '@/components/museum-card';
import { Museum } from '@shared/schema';

const Museums = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'rating' | 'price'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch all museums
  const { data: museums = [], isLoading } = useQuery<Museum[]>({
    queryKey: ['/api/museums']
  });

  // Search and filter museums
  const filteredMuseums = museums.filter(museum => 
    museum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    museum.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort museums
  const sortedMuseums = [...filteredMuseums].sort((a, b) => {
    let comparison = 0;
    
    switch (sortOption) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        comparison = ratingA - ratingB;
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle sort option change
  const handleSortChange = (option: 'name' | 'rating' | 'price') => {
    if (sortOption === option) {
      toggleSortDirection();
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  return (
    <div className="py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium mb-4">
            {t('museums.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('museums.subtitle')}
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder={t('museums.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => handleSortChange('name')}
                className={`px-4 py-2 border rounded-md flex items-center ${
                  sortOption === 'name' ? 'border-primary text-primary' : 'border-input text-muted-foreground'
                }`}
              >
                {t('museums.sortName')}
                {sortOption === 'name' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={() => handleSortChange('rating')}
                className={`px-4 py-2 border rounded-md flex items-center ${
                  sortOption === 'rating' ? 'border-primary text-primary' : 'border-input text-muted-foreground'
                }`}
              >
                {t('museums.sortRating')}
                {sortOption === 'rating' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={() => handleSortChange('price')}
                className={`px-4 py-2 border rounded-md flex items-center ${
                  sortOption === 'price' ? 'border-primary text-primary' : 'border-input text-muted-foreground'
                }`}
              >
                {t('museums.sortPrice')}
                {sortOption === 'price' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Museum Listings */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
          </div>
        ) : sortedMuseums.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMuseums.map((museum) => {
              // Mark featured museums
              const museumWithFeatures = {
                ...museum,
                featured: [1, 7].includes(museum.id),
                technology: museum.id === 1 || museum.id === 7 ? 'RealEVR' : 'Panellum'
              };
              
              return (
                <MuseumCard 
                  key={museum.id} 
                  museum={museumWithFeatures} 
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center rounded-full bg-muted p-6 mb-4">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">{t('museums.noResults')}</h3>
            <p className="text-muted-foreground mt-2">{t('museums.tryAdjusting')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Museums;
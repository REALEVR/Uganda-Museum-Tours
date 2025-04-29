import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Museum } from "@shared/schema";
import MuseumCard from "@/components/museum-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const Museums = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, openLoginModal } = useAuth();
  
  // Fetch all museums
  const { data: museums = [], isLoading } = useQuery<Museum[]>({
    queryKey: ['/api/museums'],
  });
  
  // Filter museums based on search query
  const filteredMuseums = museums.filter(museum => 
    museum.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    museum.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Create loading skeletons for museums
  const loadingSkeletons = Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
      <Skeleton className="h-56 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  ));
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading font-bold text-4xl mb-4">Explore Our Virtual Museums</h1>
        <p className="text-dark/70 max-w-2xl mx-auto mb-8">
          Discover Uganda's rich cultural heritage through our collection of immersive virtual museum tours
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search museums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-dark/40"></i>
            {searchQuery && (
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <i className="ri-close-line"></i>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Museums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          loadingSkeletons
        ) : filteredMuseums.length > 0 ? (
          filteredMuseums.map((museum) => (
            <MuseumCard 
              key={museum.id} 
              museum={museum} 
              onPreviewClick={() => {
                if (!isAuthenticated) {
                  openLoginModal();
                } else {
                  window.location.href = `/museum/${museum.id}`;
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <i className="ri-search-eye-line text-primary text-4xl mb-3"></i>
            <h3 className="text-xl font-medium mb-2">No museums found</h3>
            <p className="text-dark/70">
              We couldn't find any museums matching your search. Please try different keywords.
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Museums;

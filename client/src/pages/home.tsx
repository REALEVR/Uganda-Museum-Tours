import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Museum } from "@shared/schema";
import MuseumCard from "@/components/museum-card";
import HowItWorks from "@/components/how-it-works";
import TourDemo from "@/components/tour-demo";
import Testimonials from "@/components/testimonials";
import Pricing from "@/components/pricing";
import CallToAction from "@/components/call-to-action";
import { useAuth } from "@/hooks/use-auth";

const Home = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  
  // Fetch featured museums
  const { data: museums = [] } = useQuery<Museum[]>({
    queryKey: ['/api/museums'],
  });

  // Slice to show only 3 featured museums
  const featuredMuseums = museums.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="bg-cover bg-center h-[500px] md:h-[600px]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544939514-aa98d908bc47?q=80&w=1470&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-white max-w-2xl mb-4">
              Experience Uganda's Cultural Heritage From Anywhere
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8">
              Virtual tours of Uganda's most prestigious museums and cultural sites, available 24/7 from any device
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/museums">
                <Button className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition flex items-center">
                  <i className="ri-play-circle-line mr-2"></i> Start Exploring
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="secondary" className="px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-neutral transition">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Museums */}
      <section id="museums" className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">Featured Museums</h2>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Discover Uganda's rich cultural heritage through our curated selection of virtual museum tours
          </p>
        </div>

        {/* Museums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMuseums.map((museum) => (
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
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/museums">
            <Button variant="outline" className="px-8 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition">
              View All Museums
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Tour Demo */}
      <TourDemo />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* Call to Action */}
      <CallToAction />
    </>
  );
};

export default Home;

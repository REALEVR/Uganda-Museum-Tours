import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HowItWorks = () => {
  const steps = [
    {
      icon: "ri-user-add-line",
      title: "Create Account",
      description: "Sign up for your free account to access preview content and purchase tours",
    },
    {
      icon: "ri-search-eye-line",
      title: "Explore Museums",
      description: "Browse our collection of virtual tours and preview available experiences",
    },
    {
      icon: "ri-secure-payment-line",
      title: "Purchase Access",
      description: "Pay a small fee to unlock full access to your selected museum tours",
    },
    {
      icon: "ri-360-view-line",
      title: "Enjoy Tour",
      description: "Experience immersive virtual tours with interactive exhibits and information",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">How It Works</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Get started with your virtual museum experience in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className={`${step.icon} text-2xl text-primary`}></i>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-dark/70 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-heading font-bold text-xl mb-4 text-center">Ready to experience Uganda's cultural heritage?</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/museums">
              <Button className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition">
                Get Started Now
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button variant="outline" className="px-8 py-3 border border-accent text-accent rounded-md font-medium hover:bg-accent hover:text-white transition">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

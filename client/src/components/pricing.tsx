import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Individual Tours",
      subtitle: "Access any single museum tour",
      price: "$4.99",
      unit: "per tour",
      features: [
        "Full access to one museum tour",
        "Interactive exhibits and information",
        "Access for 30 days",
        "Mobile and desktop compatibility",
      ],
      cta: "Select Tour",
      link: "/museums",
      highlight: false,
    },
    {
      title: "Museum Bundle",
      subtitle: "Access to any 3 museum tours",
      price: "$12.99",
      unit: "bundle",
      features: [
        "Full access to 3 museum tours",
        "Save over 15% compared to individual tours",
        "Access for 60 days",
        "Mobile and desktop compatibility",
        "Downloadable tour guides",
      ],
      cta: "Select Bundle",
      link: "/checkout/bundle/1",
      highlight: true,
      badge: "MOST POPULAR",
    },
    {
      title: "All Access Pass",
      subtitle: "Unlimited access to all museums",
      price: "$24.99",
      unit: "90 days",
      features: [
        "Full access to all museums (5+)",
        "Best value for cultural enthusiasts",
        "Access for 90 days",
        "Mobile and desktop compatibility",
        "Downloadable content & guides",
      ],
      cta: "Get All Access",
      link: "/checkout/bundle/2",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl mb-3">Simple, Affordable Pricing</h2>
        <p className="text-primary/80 max-w-2xl mx-auto">
          Pay only for the tours you want to experience, with no subscription required
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`
              bg-white rounded-lg overflow-hidden shadow-md 
              ${plan.highlight 
                ? 'border-2 border-primary transform md:-translate-y-4 shadow-xl' 
                : 'border border-gray-100'
              }
            `}
          >
            <div className={`
              ${plan.highlight ? 'bg-primary text-white' : 'bg-neutral'} 
              p-6 text-center
            `}>
              {plan.badge && (
                <div className="inline-block bg-white text-primary text-xs font-bold rounded-full px-3 py-1 mb-3">
                  {plan.badge}
                </div>
              )}
              <h3 className="font-heading font-bold text-xl mb-1">{plan.title}</h3>
              <p className={`${plan.highlight ? 'text-white/80' : 'text-primary/80'} text-sm mb-4`}>
                {plan.subtitle}
              </p>
              <div className={plan.highlight ? '' : 'text-primary'}>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className={plan.highlight ? 'text-white/80' : 'text-primary/80'}> / {plan.unit}</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.link}>
                <Button 
                  className={`w-full py-3 ${
                    plan.highlight 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'border border-primary text-primary hover:bg-primary hover:text-white'
                  } font-medium rounded-md transition`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-neutral/50 rounded-lg p-6 max-w-3xl mx-auto text-center">
        <h3 className="font-heading font-medium text-lg mb-2">Group & Educational Discounts</h3>
        <p className="text-primary/80 mb-4">
          Special rates available for schools, universities, and groups of 10+ visitors
        </p>
        <Link href="/#contact">
          <Button 
            variant="outline" 
            className="px-6 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition"
          >
            Contact for Group Rates
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Pricing;

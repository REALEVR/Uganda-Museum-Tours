import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Single Museum Tour",
      subtitle: "Access one virtual museum",
      price: "$4.99",
      unit: "per tour",
      features: [
        "Full access to one virtual museum tour",
        "Interactive 360° exploration of exhibits",
        "30 days of unlimited viewing",
        "Works on any device - mobile, tablet, desktop",
      ],
      cta: "Choose a Museum",
      link: "/museums",
      highlight: false,
    },
    {
      title: "Pioneering Museums Pass",
      subtitle: "Experience our featured museums",
      price: "$8.99",
      unit: "bundle",
      features: [
        "Access to Ssemagulu Museum virtual tour",
        "Access to Museum of Technology virtual tour",
        "Save 30% compared to buying separately",
        "60 days of unlimited viewing",
        "Exclusive behind-the-scenes content",
      ],
      cta: "Get Featured Museums",
      link: "/checkout/bundle/1",
      highlight: true,
      badge: "FEATURED",
    },
    {
      title: "All Access Pass",
      subtitle: "Explore all Uganda museums",
      price: "$24.99",
      unit: "all museums",
      features: [
        "Unlimited access to all 7+ virtual museums",
        "Best value for complete cultural experience",
        "90 days of unlimited viewing",
        "Priority access to new museum additions",
        "Downloadable cultural guides & certificates",
      ],
      cta: "Get Complete Access",
      link: "/checkout/bundle/2",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl mb-3">Virtual Tour Pricing Options</h2>
        <p className="text-primary/80 max-w-2xl mx-auto">
          Choose the perfect option to explore Uganda's museums with our featured Ssemagulu Museum and Museum of Technology tours
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
        <h3 className="font-heading font-medium text-lg mb-2">Educational & Group Virtual Tours</h3>
        <p className="text-primary/80 mb-4">
          Bring Ugandan culture to your classroom or organization with special rates for schools and groups of 10+ viewers
        </p>
        <Link href="/#contact">
          <Button 
            variant="outline" 
            className="px-6 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition"
          >
            Get Group Access
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Pricing;

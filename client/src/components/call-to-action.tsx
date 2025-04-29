import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-bold text-3xl mb-6 max-w-2xl mx-auto">
          Begin Your Cultural Journey Through Uganda's Museums Today
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/80">
          Join thousands of visitors exploring Uganda's rich cultural heritage from anywhere in the world
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/museums">
            <Button className="px-8 py-3 bg-white text-primary rounded-md font-medium hover:bg-neutral transition">
              Start Exploring Now
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="outline" className="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white/10 transition">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

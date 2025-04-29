import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Museum, Bundle } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// Note: We're transitioning from Stripe to Flutterwave, so Stripe is now optional

// Initialize Stripe if the key is available
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Checkout form component
const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-confirmation",
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred with your payment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-primary text-white font-medium py-3" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <i className="ri-lock-line mr-2"></i> Pay Securely
          </span>
        )}
      </Button>
    </form>
  );
};

// Main checkout page
const Checkout = () => {
  const [match, params] = useRoute("/checkout/:type/:id");
  const type = params?.type || "";
  const itemId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated, openLoginModal } = useAuth();
  const { toast } = useToast();
  
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  
  // Fetch item details based on type
  const { data: itemData, isLoading: itemLoading } = useQuery<Museum | Bundle>({
    queryKey: [`/api/${type === 'museum' ? 'museums' : 'bundles'}/${itemId}`],
    enabled: !!itemId && !!type,
  });
  
  // Handle the creation of a payment intent
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    
    if (!itemData || !type || !itemId) return;
    
    const createPaymentIntent = async () => {
      try {
        const amount = itemData.price;
        const response = await apiRequest("POST", "/api/payment/create-intent", { 
          amount, 
          type, 
          itemId 
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    };
    
    createPaymentIntent();
  }, [isAuthenticated, itemData, type, itemId, toast, openLoginModal]);
  
  // Handle successful payment
  const handlePaymentSuccess = async () => {
    if (!paymentIntentId) return;
    
    try {
      // Confirm payment on the backend
      const response = await apiRequest("POST", "/api/payment/confirm", { 
        paymentIntentId 
      });
      const data = await response.json();
      
      if (data.success) {
        setPaymentSuccess(true);
        
        toast({
          title: "Purchase Confirmed",
          description: "Your tour access has been activated.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Confirmation Error",
        description: error.message || "Failed to confirm payment on server",
        variant: "destructive",
      });
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };
  
  // Determine if item is a museum or bundle
  const isMuseum = type === 'museum';
  const title = itemData ? (isMuseum ? (itemData as Museum).name : (itemData as Bundle).name) : '';
  const description = itemData ? (isMuseum ? (itemData as Museum).description : (itemData as Bundle).description) : '';
  const price = itemData ? itemData.price : 0;
  
  // If item is a bundle, get museums in the bundle
  const { data: bundleMuseums = [] } = useQuery<Museum[]>({
    queryKey: [`/api/bundles/${itemId}/museums`],
    enabled: !isMuseum && !!itemId,
  });
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please sign in to proceed with checkout.</p>
        <Button onClick={openLoginModal} className="bg-primary text-white hover:bg-primary/90">
          Sign In
        </Button>
      </div>
    );
  }
  
  if (itemLoading || (!clientSecret && !paymentSuccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!itemData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the item you're trying to purchase.</p>
        <Link href="/museums">
          <Button>Return to Museums</Button>
        </Link>
      </div>
    );
  }
  
  // Show success screen after payment
  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-success text-3xl"></i>
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-dark/70">Thank you for your purchase</p>
            </div>
            
            <div className="bg-neutral/30 p-6 rounded-lg mb-8">
              <h2 className="font-heading font-bold text-lg mb-4">Purchase Details</h2>
              <div className="flex justify-between mb-2">
                <span>Item:</span>
                <span className="font-medium">{title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Amount:</span>
                <span className="font-medium">${formatPrice(price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid for:</span>
                <span className="font-medium">{isMuseum ? '30 days' : 
                  type === 'bundle' && itemId === 1 ? '60 days' : '90 days'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isMuseum ? (
                <Link href={`/tour/${itemId}`}>
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    <i className="ri-play-circle-line mr-2"></i> Start Your Tour Now
                  </Button>
                </Link>
              ) : (
                <Link href="/museums">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    <i className="ri-gallery-line mr-2"></i> Browse Your Museums
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Purchase</h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Payment Form */}
          <div className="w-full md:w-1/2 p-8">
            <h3 className="font-heading font-bold text-xl mb-6">Payment Information</h3>
            {clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800">
                <h4 className="font-medium mb-2">We're upgrading our payment system!</h4>
                <p className="text-sm">
                  We're transitioning to Flutterwave for easier payments. Please check back soon or contact support for alternative payment options.
                </p>
              </div>
            )}
            <div className="mt-4 text-center text-dark/60 text-xs">
              <i className="ri-shield-check-line text-success mr-1"></i>
              Your payment information is encrypted and secure
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full md:w-1/2 bg-neutral p-8 border-t md:border-t-0 md:border-l border-gray-200">
            <h3 className="font-heading font-bold text-xl mb-4">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium">{title}</h4>
                  <p className="text-dark/70 text-sm">
                    {isMuseum ? 'Single Museum Access' : 
                      type === 'bundle' && itemId === 1 ? 'Access to 3 museum tours' : 'All Museums Access'}
                  </p>
                </div>
                <span className="font-medium">${formatPrice(price)}</span>
              </div>
              <div className="flex justify-between text-sm text-dark/70">
                <span>Subtotal</span>
                <span>${formatPrice(price)}</span>
              </div>
              <div className="flex justify-between text-sm text-dark/70">
                <span>Transaction Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-medium pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">${formatPrice(price)}</span>
              </div>
            </div>
            
            <div className="bg-accent/5 p-4 rounded-md">
              <h4 className="font-medium text-accent mb-2">What's included:</h4>
              <ul className="space-y-2 text-sm">
                {isMuseum ? (
                  <>
                    <li className="flex items-start">
                      <i className="ri-check-line text-success mt-1 mr-2"></i>
                      <span>Access to {title}</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-success mt-1 mr-2"></i>
                      <span>30 days of access from purchase</span>
                    </li>
                  </>
                ) : (
                  bundleMuseums.map((museum, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-success mt-1 mr-2"></i>
                      <span>Access to {museum.name}</span>
                    </li>
                  ))
                )}
                <li className="flex items-start">
                  <i className="ri-check-line text-success mt-1 mr-2"></i>
                  <span>
                    {isMuseum ? '30 days' : 
                      type === 'bundle' && itemId === 1 ? '60 days' : '90 days'} of access from purchase
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-success mt-1 mr-2"></i>
                  <span>Interactive virtual tour experience</span>
                </li>
                {!isMuseum && (
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Downloadable tour guides (PDF)</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-6">
        <div className="flex items-center">
          <i className="ri-bank-card-line text-primary text-2xl mr-2"></i>
          <span>Credit Card</span>
        </div>
        <div className="flex items-center">
          <i className="ri-paypal-line text-primary text-2xl mr-2"></i>
          <span>PayPal</span>
        </div>
        <div className="flex items-center">
          <i className="ri-smartphone-line text-primary text-2xl mr-2"></i>
          <span>Mobile Money</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

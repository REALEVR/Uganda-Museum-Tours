import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Museums from "@/pages/museums";
import MuseumDetail from "@/pages/museum-detail";
import TourView from "@/pages/tour-view";
import Checkout from "@/pages/checkout";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/museums" component={Museums} />
      <Route path="/museum/:id" component={MuseumDetail} />
      <Route path="/tour/:id" component={TourView} />
      <Route path="/checkout/:type/:id" component={Checkout} />
      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          
          <LoginModal />
          <RegisterModal />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

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
import Layout from "@/components/layout/layout";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";

// Initialize i18n
import "./lib/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/museums" component={Museums} />
      <Route path="/museums/:id" component={MuseumDetail} />
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
          <Layout>
            <Router />
          </Layout>
          
          <LoginModal />
          <RegisterModal />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import UserPanel from "@/pages/UserPanel";
import Scanner from "@/pages/Scanner";
import Inventory from "@/pages/Inventory";
import Donations from "@/pages/Donations";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center medical-gradient">
        <div className="text-center">
          <div className="medicine-logo" style={{ margin: '0 auto 1rem', fontSize: '3rem' }}>
            <i className="fas fa-plus fa-spin"></i>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem' }}>
            Loading Medicine Tracker...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={() => {
        window.location.href = '/';
        return null;
      }} />
      <Route path="/" component={isAdmin ? Dashboard : UserPanel} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/user" component={UserPanel} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/donations" component={Donations} />
      {isAdmin && <Route path="/admin" component={Admin} />}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Header />
          <Router />
          <Toast />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

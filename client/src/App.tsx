import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Scanner from "@/pages/Scanner";
import Inventory from "@/pages/Inventory";
import Donations from "@/pages/Donations";
import Admin from "@/pages/Admin";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/donations" component={Donations} />
      <Route path="/admin" component={Admin} />
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

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CodesPage from "@/pages/codes";
import CodeDetailPage from "@/pages/code-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import LoginPage from "@/pages/dashboard/login";
import CallbackPage from "@/pages/dashboard/callback";
import DashboardOverview from "@/pages/dashboard/index";
import BotsPage from "@/pages/dashboard/bots";
import StaffPage from "@/pages/dashboard/staff";
import AuditPage from "@/pages/dashboard/audit";
import PreviewPage from "@/pages/dashboard/preview";
import DashboardLayout from "@/pages/dashboard/layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/codes" component={CodesPage} />
      <Route path="/codes/:id" component={CodeDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/dashboard/login" component={LoginPage} />
      <Route path="/dashboard/callback" component={CallbackPage} />
      <Route path="/dashboard">
        <DashboardLayout>
          <DashboardOverview />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/bots">
        <DashboardLayout>
          <BotsPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/staff">
        <DashboardLayout>
          <StaffPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/audit">
        <DashboardLayout>
          <AuditPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/preview">
        <DashboardLayout>
          <PreviewPage />
        </DashboardLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

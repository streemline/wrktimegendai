import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import Navbar from "@/components/layouts/navbar";
import Statistics from "@/pages/statistics";
import Profile from "@/pages/profile";
import AddEntryModal from "@/components/modals/add-entry-modal";
import AuthPage from "@/pages/auth-page";
import SplashScreen from "@/pages/splash-screen";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { TranslationProvider } from "@/hooks/use-translations";

function MainApp() {
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("statistics");
  useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {currentPage === "statistics" && <Statistics />}
      {currentPage === "profile" && <Profile />}

      <Navbar
        activePage={currentPage}
        onNavigation={setCurrentPage}
        onAddEntry={() => setIsAddEntryModalOpen(true)}
      />

      <AddEntryModal
        open={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
      />
    </div>
  );
}

function Router() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Показываем сплэш-экран на 3 секунды
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Switch>
      <ProtectedRoute path="/" component={MainApp} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TranslationProvider>
          <Router />
          <Toaster />
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

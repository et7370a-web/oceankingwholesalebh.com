import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import FishSpecies from "./pages/FishSpecies";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AccountCallback from "./pages/AccountCallback";
import { useMemberStore } from "@/stores/memberStore";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  const { pathname } = useLocation();
  const refreshMember = useMemberStore((state) => state.refresh);
  useEffect(() => {
    if (pathname !== "/account/callback") refreshMember();
  }, [pathname, refreshMember]);
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/fish/:species" element={<FishSpecies />} />
      <Route path="/fish/:species/:productId" element={<ProductDetail />} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="/account/callback" element={<AccountCallback />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

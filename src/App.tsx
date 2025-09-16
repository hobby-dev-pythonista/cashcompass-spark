import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Expenses Page</h1>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/expense-types" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Expense Types Page</h1>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/recurring" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Recurring Expenses Page</h1>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/bulk-upload" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Bulk Upload Page</h1>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

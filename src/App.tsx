import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components for better performance
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Showcase = lazy(() => import("./pages/Showcase"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePlatform = lazy(() => import("./pages/CreatePlatform"));
const PlatformDetails = lazy(() => import("./pages/PlatformDetails"));
const DomainSettings = lazy(() => import("./pages/DomainSettings"));
const PlatformSettings = lazy(() => import("./pages/PlatformSettings"));
const SubscriptionTiers = lazy(() => import("./pages/SubscriptionTiers"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-platform" element={<CreatePlatform />} />
          <Route path="/platform/:platformId" element={<PlatformDetails />} />
          <Route
            path="/platform/:platformId/domain-settings"
            element={<DomainSettings />}
          />
          <Route
            path="/platform/:platformId/settings"
            element={<PlatformSettings />}
          />
          <Route
            path="/platform/:platformId/subscription-tiers"
            element={<SubscriptionTiers />}
          />

          {/* Add tempobook route before the catch-all */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

import React, { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AuthProvider } from "./lib/auth";

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
const Analytics = lazy(() => import("./pages/Analytics"));
const ContentManager = lazy(() => import("./pages/ContentManager"));
const ContentEditor = lazy(() => import("./pages/ContentEditor"));
const MemberManagement = lazy(() => import("./pages/MemberManagement"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const PlatformPreview = lazy(() => import("./pages/PlatformPreview"));
const MemberLogin = lazy(() => import("./pages/MemberLogin"));
const MemberSignup = lazy(() => import("./pages/MemberSignup"));

// Member-facing pages (white-labeled for each creator)
const MemberHomePage = lazy(() => import("./templates/MemberHomePage"));
const MemberContentPage = lazy(() => import("./templates/MemberContentPage"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Signup />
                </ProtectedRoute>
              }
            />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/showcase" element={<Showcase />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-platform"
              element={
                <ProtectedRoute>
                  <CreatePlatform />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId"
              element={
                <ProtectedRoute>
                  <PlatformDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/preview"
              element={
                <ProtectedRoute>
                  <PlatformPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/domain-settings"
              element={
                <ProtectedRoute>
                  <DomainSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/settings"
              element={
                <ProtectedRoute>
                  <PlatformSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/subscription-tiers"
              element={
                <ProtectedRoute>
                  <SubscriptionTiers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/content"
              element={
                <ProtectedRoute>
                  <ContentManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/content/:contentId"
              element={
                <ProtectedRoute>
                  <ContentEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/members"
              element={
                <ProtectedRoute>
                  <MemberManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/members/:memberId"
              element={
                <ProtectedRoute>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform/:platformId/view"
              element={<MemberDashboard />}
            />
            <Route
              path="/platform/:platformId/view/"
              element={<MemberDashboard />}
            />
            <Route
              path="/platform/:platformId/view/content"
              element={<MemberContentPage />}
            />
            <Route
              path="/platform/:platformId/view/content/:contentId"
              element={<div>Content Detail Page</div>}
            />
            <Route
              path="/platform/:platformId/view/pricing"
              element={<div>Membership Pricing Page</div>}
            />
            <Route
              path="/platform/:platformId/view/account"
              element={<div>Member Account Page</div>}
            />
            <Route
              path="/platform/:platformId/view/login"
              element={<MemberLogin />}
            />
            <Route
              path="/platform/:platformId/view/signup"
              element={<MemberSignup />}
            />

            {/* Member-facing routes (these would typically be on a custom domain) */}
            <Route
              path="/view/:platformId"
              element={<MemberHomePage key={window.location.pathname} />}
            />
            <Route
              path="/view/:platformId/content"
              element={<MemberContentPage key={window.location.pathname} />}
            />
            <Route
              path="/view/:platformId/content/:contentId"
              element={<div>Content Detail Page</div>}
            />
            <Route
              path="/view/:platformId/pricing"
              element={<div>Membership Pricing Page</div>}
            />
            <Route
              path="/view/:platformId/account"
              element={<div>Member Account Page</div>}
            />

            {/* Add tempobook route before the catch-all */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

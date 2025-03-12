import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import MemberHeader from "../components/platform/MemberHeader";
import MemberFooter from "../components/platform/MemberFooter";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";

const MemberLogin: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (platformId) {
      fetchPlatformData();
    }
  }, [platformId]);

  const fetchPlatformData = async () => {
    try {
      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      setPlatformData(data);
    } catch (error: any) {
      console.error("Error fetching platform:", error);
      toast({
        title: "Error",
        description: "Failed to load platform data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) throw error;

      toast({
        title: "Login successful",
        description: `Welcome back to ${platformData?.name || "the platform"}!`,
      });

      navigate(`/platform/${platformId}/view`);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description:
          error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Custom styles based on platform branding
  const buttonStyle = {
    backgroundColor: platformData?.secondary_color || "var(--primary)",
    color: "white",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MemberHeader
        platformName={platformData?.name || "Platform"}
        platformLogo={platformData?.logo_url}
        primaryColor={platformData?.primary_color}
        secondaryColor={platformData?.secondary_color}
      />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to your {platformData?.name || "platform"} account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to={`/platform/${platformId}/view/forgot-password`}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  style={buttonStyle}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to={`/platform/${platformId}/view/signup`}
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <MemberFooter
        platformName={platformData?.name || "Platform"}
        platformLogo={platformData?.logo_url}
        primaryColor={platformData?.primary_color}
        secondaryColor={platformData?.secondary_color}
      />
    </div>
  );
};

export default MemberLogin;

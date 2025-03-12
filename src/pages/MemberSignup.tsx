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
import { Checkbox } from "../components/ui/checkbox";
import { Loader2 } from "lucide-react";

const MemberSignup: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
      );

      if (error) throw error;

      // Create member record for this platform
      const { data: userData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", formData.email)
        .single();

      if (userData?.id) {
        // Get the free tier for this platform
        const { data: tierData } = await supabase
          .from("subscription_tiers")
          .select("id")
          .eq("platform_id", platformId)
          .eq("price", 0)
          .single();

        // Create member record
        await supabase.from("members").insert({
          platform_id: platformId,
          user_id: userData.id,
          tier_id: tierData?.id,
          status: "active",
          joined_at: new Date().toISOString(),
        });
      }

      toast({
        title: "Account created",
        description: `Welcome to ${platformData?.name || "the platform"}! Your account has been created successfully.`,
      });

      navigate(`/platform/${platformId}/view`);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description:
          error.message || "Failed to create account. Please try again.",
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
                Create an Account
              </CardTitle>
              <CardDescription className="text-center">
                Join {platformData?.name || "the platform"} to access exclusive
                content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    I agree to the{" "}
                    <Link
                      to={`/platform/${platformId}/view/terms`}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to={`/platform/${platformId}/view/privacy`}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  style={buttonStyle}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                      account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={`/platform/${platformId}/view/login`}
                  className="text-primary hover:underline"
                >
                  Sign in
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

export default MemberSignup;

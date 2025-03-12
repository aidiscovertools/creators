import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
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
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  ArrowLeft,
  Check,
  CreditCard,
  DollarSign,
  Grip,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

interface TierType {
  id: string;
  name: string;
  price: string;
  description: string;
  benefits: string[];
  isPopular: boolean;
  isPublic: boolean;
}

const SubscriptionTiers: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true);

  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchSubscriptionTiers();
    }
  }, [platformId, user]);

  const fetchPlatformData = async () => {
    try {
      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      if (error) throw error;
      setPlatformData(data);
    } catch (error: any) {
      console.error("Error fetching platform:", error);
      toast({
        title: "Error",
        description: "Failed to load platform data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlatform(false);
    }
  };

  const fetchSubscriptionTiers = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_tiers")
        .select("*")
        .eq("platform_id", platformId)
        .order("price", { ascending: true });

      if (error) throw error;
      setSubscriptionTiers(data || []);
    } catch (error: any) {
      console.error("Error fetching subscription tiers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription tiers",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTiers(false);
    }
  };

  // Sample subscription tiers for initial state
  const sampleSubscriptionTiers = [
    {
      id: "1",
      name: "Basic",
      price: "9.99",
      description: "Access to basic content and features",
      benefits: [
        "Access to basic workout videos",
        "Monthly fitness newsletter",
        "Community forum access",
      ],
      isPopular: false,
      isPublic: true,
    },
    {
      id: "2",
      name: "Premium",
      price: "19.99",
      description: "Full access to all content and premium features",
      benefits: [
        "Access to all workout videos",
        "Personalized workout plans",
        "Direct messaging with trainers",
        "Exclusive live sessions",
        "Priority support",
      ],
      isPopular: true,
      isPublic: true,
    },
  ];

  const handleAddTier = () => {
    const newTier: TierType = {
      id: Date.now().toString(),
      name: "New Tier",
      price: "0.00",
      description: "Description for this tier",
      benefits: ["Feature 1", "Feature 2"],
      isPopular: false,
      isPublic: true,
    };
    setSubscriptionTiers([...subscriptionTiers, newTier]);
  };

  const handleRemoveTier = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subscription_tiers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscriptionTiers(subscriptionTiers.filter((tier) => tier.id !== id));
      toast({
        title: "Tier deleted",
        description: "Your subscription tier has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting tier:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription tier",
        variant: "destructive",
      });
    }
  };

  const handleTierChange = (id: string, field: keyof TierType, value: any) => {
    setSubscriptionTiers(
      subscriptionTiers.map((tier) => {
        if (tier.id === id) {
          return { ...tier, [field]: value };
        }
        return tier;
      }),
    );
  };

  const handleFeatureChange = (
    tierId: string,
    index: number,
    value: string,
  ) => {
    setSubscriptionTiers(
      subscriptionTiers.map((tier) => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.benefits];
          newFeatures[index] = value;
          return { ...tier, benefits: newFeatures };
        }
        return tier;
      }),
    );
  };

  const handleAddFeature = (tierId: string) => {
    setSubscriptionTiers(
      subscriptionTiers.map((tier) => {
        if (tier.id === tierId) {
          return { ...tier, benefits: [...tier.benefits, "New feature"] };
        }
        return tier;
      }),
    );
  };

  const handleRemoveFeature = (tierId: string, index: number) => {
    setSubscriptionTiers(
      subscriptionTiers.map((tier) => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.benefits];
          newFeatures.splice(index, 1);
          return { ...tier, benefits: newFeatures };
        }
        return tier;
      }),
    );
  };

  const handleUpdateTier = async (id: string, updates: any) => {
    try {
      // Format the updates to match the database schema
      const tierUpdates = {
        name: updates.name,
        price: updates.price,
        description: updates.description,
        benefits: Array.isArray(updates.benefits)
          ? JSON.stringify(updates.benefits)
          : updates.benefits,
        is_popular:
          updates.isPopular !== undefined
            ? updates.isPopular
            : updates.is_popular,
        is_public:
          updates.isPublic !== undefined ? updates.isPublic : updates.is_public,
      };

      const { data, error } = await supabase
        .from("subscription_tiers")
        .update(tierUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setSubscriptionTiers(
        subscriptionTiers.map((tier) => (tier.id === id ? data : tier)),
      );

      toast({
        title: "Tier updated",
        description: "Your subscription tier has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating tier:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription tier",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    // Here you would save the subscription tiers to your backend
    console.log("Saving subscription tiers:", subscriptionTiers);
    navigate(`/platform/${platformId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platform
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoadingPlatform
                ? "Loading..."
                : platformData?.name || "Subscription Tiers"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription tiers
            </p>
          </div>

          <div className="space-y-6">
            {isLoadingTiers ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Loading subscription tiers
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Please wait while we load your subscription tiers...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(subscriptionTiers.length > 0
                  ? subscriptionTiers
                  : sampleSubscriptionTiers
                ).map((tier) => (
                  <Card
                    key={tier.id}
                    className={
                      tier.isPopular || tier.is_popular ? "border-primary" : ""
                    }
                  >
                    <CardHeader className="relative">
                      {(tier.isPopular || tier.is_popular) && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-md rounded-tr-md">
                          Popular
                        </div>
                      )}
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold">
                            {tier.price}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tier.description}
                      </p>
                      <div className="space-y-2">
                        {(Array.isArray(tier.benefits)
                          ? tier.benefits
                          : JSON.parse(tier.benefits || "[]")
                        ).map((benefit, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-primary mr-2 mt-1" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <span className="text-sm text-muted-foreground">
                        {tier.isPublic || tier.is_public ? "Public" : "Private"}
                      </span>
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-1" /> Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {/* Add new tier card */}
                <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-center mb-2">Add New Tier</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Create a new subscription tier for your platform
                  </p>
                </Card>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/platform/${platformId}`)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionTiers;

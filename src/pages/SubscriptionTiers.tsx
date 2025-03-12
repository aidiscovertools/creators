import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  features: string[];
  isPopular: boolean;
  isPublic: boolean;
}

const SubscriptionTiers: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();

  // Mock platform data
  const [platformName, setPlatformName] = useState("Fitness Revolution");

  // Mock subscription tiers
  const [tiers, setTiers] = useState<TierType[]>([
    {
      id: "1",
      name: "Basic",
      price: "9.99",
      description: "Access to basic content and features",
      features: [
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
      features: [
        "Access to all workout videos",
        "Personalized workout plans",
        "Direct messaging with trainers",
        "Exclusive live sessions",
        "Priority support",
      ],
      isPopular: true,
      isPublic: true,
    },
  ]);

  const handleAddTier = () => {
    const newTier: TierType = {
      id: Date.now().toString(),
      name: "New Tier",
      price: "0.00",
      description: "Description for this tier",
      features: ["Feature 1", "Feature 2"],
      isPopular: false,
      isPublic: true,
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    setTiers(tiers.filter((tier) => tier.id !== id));
  };

  const handleTierChange = (id: string, field: keyof TierType, value: any) => {
    setTiers(
      tiers.map((tier) => {
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
    setTiers(
      tiers.map((tier) => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.features];
          newFeatures[index] = value;
          return { ...tier, features: newFeatures };
        }
        return tier;
      }),
    );
  };

  const handleAddFeature = (tierId: string) => {
    setTiers(
      tiers.map((tier) => {
        if (tier.id === tierId) {
          return { ...tier, features: [...tier.features, "New feature"] };
        }
        return tier;
      }),
    );
  };

  const handleRemoveFeature = (tierId: string, index: number) => {
    setTiers(
      tiers.map((tier) => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.features];
          newFeatures.splice(index, 1);
          return { ...tier, features: newFeatures };
        }
        return tier;
      }),
    );
  };

  const handleSave = () => {
    // Here you would save the subscription tiers to your backend
    console.log("Saving subscription tiers:", tiers);
    navigate(`/platform/${platformId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

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
              {platformName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription tiers
            </p>
          </div>

          <div className="space-y-6">
            {tiers.map((tier, index) => (
              <Card
                key={tier.id}
                className={tier.isPopular ? "border-primary" : ""}
              >
                <CardHeader className="pb-4">
                  {tier.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-md rounded-tr-md">
                      Popular
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className="mr-2 text-muted-foreground">
                      <Grip className="h-5 w-5" />
                    </div>
                    <Input
                      value={tier.name}
                      onChange={(e) =>
                        handleTierChange(tier.id, "name", e.target.value)
                      }
                      className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <div className="flex items-center">
                          <div className="bg-muted flex items-center justify-center w-10 h-10 rounded-l-md border border-r-0 border-input">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            value={tier.price}
                            onChange={(e) =>
                              handleTierChange(tier.id, "price", e.target.value)
                            }
                            className="rounded-l-none"
                            type="number"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={tier.description}
                          onChange={(e) =>
                            handleTierChange(
                              tier.id,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="block mb-1">Mark as Popular</Label>
                          <p className="text-sm text-muted-foreground">
                            Highlight this tier to your members
                          </p>
                        </div>
                        <Switch
                          checked={tier.isPopular}
                          onCheckedChange={(checked) => {
                            // Only one tier can be popular
                            if (checked) {
                              setTiers(
                                tiers.map((t) => ({
                                  ...t,
                                  isPopular: t.id === tier.id,
                                })),
                              );
                            } else {
                              handleTierChange(tier.id, "isPopular", false);
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="block mb-1">Public Tier</Label>
                          <p className="text-sm text-muted-foreground">
                            Make this tier visible to potential members
                          </p>
                        </div>
                        <Switch
                          checked={tier.isPublic}
                          onCheckedChange={(checked) =>
                            handleTierChange(tier.id, "isPublic", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label>Features</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddFeature(tier.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Feature
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex-grow">
                            <Input
                              value={feature}
                              onChange={(e) =>
                                handleFeatureChange(
                                  tier.id,
                                  featureIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="Feature description"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveFeature(tier.id, featureIndex)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveTier(tier.id)}
                    disabled={tiers.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Tier
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddTier}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Tier
            </Button>

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

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Save,
  User,
  UserCog,
} from "lucide-react";

const MemberProfile: React.FC = () => {
  const navigate = useNavigate();
  const { platformId, memberId } = useParams<{
    platformId: string;
    memberId: string;
  }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [platformData, setPlatformData] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [memberActivity, setMemberActivity] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tier_id: "",
    status: "active",
    notes: "",
  });

  useEffect(() => {
    if (platformId && memberId && user) {
      fetchPlatformData();
      fetchMemberData();
      fetchSubscriptionTiers();
      fetchMemberActivity();
    }
  }, [platformId, memberId, user]);

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
    }
  };

  const fetchMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select(
          `
          *, 
          profiles:user_id(id, name, email, avatar_url), 
          subscription_tiers:tier_id(id, name, price)
        `,
        )
        .eq("id", memberId)
        .single();

      if (error) throw error;
      setMemberData(data);

      // Initialize form data
      setFormData({
        name: data.profiles?.name || "",
        email: data.profiles?.email || "",
        tier_id: data.tier_id || "",
        status: data.status || "active",
        notes: data.notes || "",
      });
    } catch (error: any) {
      console.error("Error fetching member:", error);
      toast({
        title: "Error",
        description: "Failed to load member data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    }
  };

  const fetchMemberActivity = async () => {
    // In a real app, this would fetch actual activity data
    // For now, we'll use mock data
    const mockActivity = [
      {
        id: "1",
        type: "subscription",
        description: "Subscribed to Premium tier",
        date: "2023-10-01T10:30:00Z",
      },
      {
        id: "2",
        type: "content",
        description: "Viewed 'Advanced Workout Techniques' video",
        date: "2023-10-05T15:45:00Z",
      },
      {
        id: "3",
        type: "payment",
        description: "Monthly subscription payment - $19.99",
        date: "2023-11-01T08:15:00Z",
      },
      {
        id: "4",
        type: "content",
        description: "Viewed 'Nutrition Fundamentals' article",
        date: "2023-11-03T14:20:00Z",
      },
      {
        id: "5",
        type: "login",
        description: "Logged in to platform",
        date: "2023-11-10T09:05:00Z",
      },
    ];

    setMemberActivity(mockActivity);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update member record
      const { error: memberError } = await supabase
        .from("members")
        .update({
          tier_id: formData.tier_id,
          status: formData.status,
          notes: formData.notes,
        })
        .eq("id", memberId);

      if (memberError) throw memberError;

      // Update profile record if needed
      if (
        memberData.profiles &&
        (formData.name !== memberData.profiles.name ||
          formData.email !== memberData.profiles.email)
      ) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            name: formData.name,
            email: formData.email,
          })
          .eq("id", memberData.profiles.id);

        if (profileError) throw profileError;
      }

      // Refresh member data
      fetchMemberData();

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Member profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "content":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case "login":
        return <User className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The member you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate(`/platform/${platformId}/members`)}>
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}/members`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  {memberData.profiles?.avatar_url ? (
                    <AvatarImage
                      src={memberData.profiles.avatar_url}
                      alt={memberData.profiles?.name || "Member"}
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {(memberData.profiles?.name || "U")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {memberData.profiles?.name || "Member Profile"}
                  </h1>
                  <p className="text-muted-foreground">
                    {memberData.profiles?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCog className="mr-2 h-5 w-5" /> Member Information
                  </CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Edit member details"
                      : "View member details and subscription information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Member name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="member@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tier">Subscription Tier</Label>
                          <Select
                            value={formData.tier_id}
                            onValueChange={(value) =>
                              handleSelectChange("tier_id", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionTiers.map((tier) => (
                                <SelectItem key={tier.id} value={tier.id}>
                                  {tier.name} (${tier.price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              handleSelectChange("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Add notes about this member"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Subscription
                          </h3>
                          <p className="text-lg font-medium">
                            {memberData.subscription_tiers?.name ||
                              "No subscription"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${memberData.subscription_tiers?.price || "0"}/month
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Status
                          </h3>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                memberData.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : memberData.status === "inactive"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {memberData.status?.charAt(0).toUpperCase() +
                                memberData.status?.slice(1) || "Active"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Joined Date
                          </h3>
                          <p className="text-base">
                            {memberData.joined_at
                              ? new Date(
                                  memberData.joined_at,
                                ).toLocaleDateString()
                              : "Unknown"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Last Active
                          </h3>
                          <p className="text-base">
                            {memberData.last_active
                              ? new Date(
                                  memberData.last_active,
                                ).toLocaleDateString()
                              : "Never"}
                          </p>
                        </div>
                      </div>

                      {memberData.notes && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Notes
                          </h3>
                          <p className="text-base">{memberData.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Summary</CardTitle>
                  <CardDescription>
                    Overview of member's engagement with your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Content Views
                      </p>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-muted-foreground">
                        +3 this month
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-xs text-muted-foreground">
                        +1 this month
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">$59.97</p>
                      <p className="text-xs text-muted-foreground">3 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Member's recent interactions with your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {memberActivity.length > 0 ? (
                      <div className="space-y-4">
                        {memberActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-4 pb-4 border-b last:border-0"
                          >
                            <div className="mt-0.5">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {activity.description}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(
                                  activity.date,
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(activity.date).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No activity recorded yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>
                    Manage member's subscription and payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {memberData.subscription_tiers?.name ||
                              "No Subscription"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ${memberData.subscription_tiers?.price || "0"}/month
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Payment History</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Monthly subscription</p>
                            <p className="text-sm text-muted-foreground">
                              Nov 1, 2023
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${memberData.subscription_tiers?.price || "19.99"}
                            </p>
                            <p className="text-xs text-green-600">Successful</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Monthly subscription</p>
                            <p className="text-sm text-muted-foreground">
                              Oct 1, 2023
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${memberData.subscription_tiers?.price || "19.99"}
                            </p>
                            <p className="text-xs text-green-600">Successful</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Monthly subscription</p>
                            <p className="text-sm text-muted-foreground">
                              Sep 1, 2023
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${memberData.subscription_tiers?.price || "19.99"}
                            </p>
                            <p className="text-xs text-green-600">Successful</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberProfile;

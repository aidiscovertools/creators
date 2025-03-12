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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import {
  ArrowLeft,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

interface MemberType {
  id: string;
  name: string;
  email: string;
  tier: "free" | "basic" | "premium";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  lastActive: string;
  avatar?: string;
  revenue?: string;
  selected?: boolean;
}

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteTier, setInviteTier] = useState("basic");
  const [selectAll, setSelectAll] = useState(false);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const [members, setMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchMembers();
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

  const fetchMembers = async () => {
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
        .eq("platform_id", platformId)
        .order("joined_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMembers(false);
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

  // Sample members data for initial state
  const sampleMembers = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      tier: "premium",
      status: "active",
      joinDate: "2023-08-15",
      lastActive: "2023-10-18",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      revenue: "$59.97",
      selected: false,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.c@example.com",
      tier: "basic",
      status: "active",
      joinDate: "2023-09-02",
      lastActive: "2023-10-17",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      revenue: "$29.97",
      selected: false,
    },
    {
      id: "3",
      name: "Emma Williams",
      email: "emma.w@example.com",
      tier: "premium",
      status: "active",
      joinDate: "2023-09-10",
      lastActive: "2023-10-15",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      revenue: "$59.97",
      selected: false,
    },
    {
      id: "4",
      name: "David Brown",
      email: "david.b@example.com",
      tier: "basic",
      status: "inactive",
      joinDate: "2023-07-22",
      lastActive: "2023-09-30",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      revenue: "$19.98",
      selected: false,
    },
    {
      id: "5",
      name: "Olivia Martinez",
      email: "olivia.m@example.com",
      tier: "free",
      status: "active",
      joinDate: "2023-10-05",
      lastActive: "2023-10-18",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
      revenue: "$0.00",
      selected: false,
    },
    {
      id: "6",
      name: "James Wilson",
      email: "james.w@example.com",
      tier: "premium",
      status: "pending",
      joinDate: "2023-10-12",
      lastActive: "-",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      revenue: "$0.00",
      selected: false,
    },
  ];

  const handleInviteMember = async () => {
    try {
      // In a real implementation, this would send an invitation email
      // For now, we'll create a placeholder member record

      // First check if a user with this email exists
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmails)
        .maybeSingle();

      if (userError) throw userError;

      // If user doesn't exist, we'd normally send an invitation email
      // For demo purposes, we'll create a placeholder profile
      let userId = userData?.id;

      if (!userId) {
        // Create a placeholder profile (in a real app, this would be done when the user signs up)
        const { data: newUser, error: createError } = await supabase
          .from("profiles")
          .insert({
            email: inviteEmails,
            name: inviteEmails.split("@")[0],
          })
          .select()
          .single();

        if (createError) throw createError;
        userId = newUser.id;
      }

      // Find the tier based on selection
      const selectedTier = subscriptionTiers.find(
        (tier) => tier.id === inviteTier,
      );

      // Create the member record
      const { data: newMember, error: memberError } = await supabase
        .from("members")
        .insert({
          platform_id: platformId,
          user_id: userId,
          tier_id: selectedTier?.id,
          status: "pending",
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (memberError) throw memberError;

      // Refresh the members list
      fetchMembers();

      setInviteEmails("");
      setIsInviteDialogOpen(false);

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmails}.`,
      });
    } catch (error: any) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);

      if (error) throw error;

      setMembers(members.filter((member) => member.id !== id));
      toast({
        title: "Member removed",
        description: "The member has been removed from your platform.",
      });
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleSelectMember = (id: string, selected: boolean) => {
    setMembers(
      members.map((member) => {
        if (member.id === id) {
          return { ...member, selected };
        }
        return member;
      }),
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectAll(selected);
    setMembers(members.map((member) => ({ ...member, selected })));
  };

  const handleBulkAction = (action: string) => {
    const selectedIds = members.filter((m) => m.selected).map((m) => m.id);

    if (action === "delete") {
      setMembers(members.filter((member) => !member.selected));
    } else if (action === "change-tier") {
      // This would open another dialog to select the tier
      console.log("Change tier for:", selectedIds);
    } else if (action === "export") {
      console.log("Export data for:", selectedIds);
    }

    setSelectAll(false);
    setBulkActionOpen(false);
  };

  const handleUpdateMemberTier = async (id: string, tierId: string) => {
    try {
      const { error } = await supabase
        .from("members")
        .update({ tier_id: tierId })
        .eq("id", id);

      if (error) throw error;

      // Refresh the members list to get the updated data with joins
      fetchMembers();

      toast({
        title: "Member updated",
        description: "The member's subscription tier has been updated.",
      });
    } catch (error: any) {
      console.error("Error updating member tier:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member tier",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "free":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMembers = (members.length > 0 ? members : sampleMembers).filter(
    (member) => {
      const memberName = member.profiles?.name || member.name || "";
      const memberEmail = member.profiles?.email || member.email || "";

      const matchesSearch =
        memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memberEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const memberTier = member.tier_id || member.tier;
      const matchesTier = filterTier === "all" || memberTier === filterTier;

      const memberStatus = member.status || "active";
      const matchesStatus =
        filterStatus === "all" || memberStatus === filterStatus;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && memberStatus === "active") ||
        (activeTab === "inactive" && memberStatus === "inactive") ||
        (activeTab === "pending" && memberStatus === "pending");

      return matchesSearch && matchesTier && matchesStatus && matchesTab;
    },
  );

  const selectedCount = members.filter((m) => m.selected).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platform
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isLoadingPlatform
                    ? "Loading..."
                    : platformData?.name || "Member Management"}
                </h1>
                <p className="text-muted-foreground mt-1">Member Management</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                <Dialog
                  open={isInviteDialogOpen}
                  onOpenChange={setIsInviteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" /> Invite Members
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Invite New Members</DialogTitle>
                      <DialogDescription>
                        Send invitations to join your platform. Enter email
                        addresses separated by commas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="emails">Email Addresses</Label>
                        <Input
                          id="emails"
                          placeholder="email1@example.com, email2@example.com"
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter multiple emails separated by commas
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tier">Subscription Tier</Label>
                        <Select
                          value={inviteTier}
                          onValueChange={setInviteTier}
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
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="sendWelcome" />
                        <Label htmlFor="sendWelcome">Send welcome email</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsInviteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleInviteMember}
                        disabled={!inviteEmails.trim()}
                      >
                        Send Invites
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filter by Tier</Label>
                    <Select value={filterTier} onValueChange={setFilterTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        {subscriptionTiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filter by Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedCount > 0 && (
            <div className="bg-muted p-4 rounded-md mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="mr-2"
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
                  {selectedCount} {selectedCount === 1 ? "member" : "members"}{" "}
                  selected
                </Label>
              </div>
              <DropdownMenu
                open={bulkActionOpen}
                onOpenChange={setBulkActionOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("change-tier")}
                  >
                    Change Tier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("export")}>
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("delete")}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <TabsContent value={activeTab} className="mt-0 p-0">
            {isLoadingMembers ? (
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
                <h3 className="text-lg font-medium mb-2">Loading members</h3>
                <p className="text-muted-foreground max-w-md">
                  Please wait while we load your platform members...
                </p>
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="w-[40px] text-left p-3">
                          <Checkbox
                            id="select-all-table"
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left p-3 font-medium">Member</th>
                        <th className="text-left p-3 font-medium">Tier</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Joined</th>
                        <th className="text-left p-3 font-medium">
                          Last Active
                        </th>
                        <th className="text-left p-3 font-medium">Revenue</th>
                        <th className="w-[60px] p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="border-t hover:bg-muted/30"
                        >
                          <td className="p-3">
                            <Checkbox
                              checked={member.selected}
                              onCheckedChange={(checked) =>
                                handleSelectMember(member.id, !!checked)
                              }
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                {member.avatar ||
                                member.profiles?.avatar_url ? (
                                  <AvatarImage
                                    src={
                                      member.avatar ||
                                      member.profiles?.avatar_url
                                    }
                                    alt={
                                      member.profiles?.name ||
                                      member.name ||
                                      "Member"
                                    }
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {(
                                      member.profiles?.name ||
                                      member.name ||
                                      "U"
                                    )
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {member.profiles?.name ||
                                    member.name ||
                                    "Unknown User"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {member.profiles?.email ||
                                    member.email ||
                                    "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getTierColor(member.subscription_tiers?.name || member.tier || "free")}`}
                            >
                              {(
                                member.subscription_tiers?.name ||
                                member.tier ||
                                "Free"
                              )
                                .charAt(0)
                                .toUpperCase() +
                                (
                                  member.subscription_tiers?.name ||
                                  member.tier ||
                                  "Free"
                                ).slice(1)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status || "active")}`}
                            >
                              {(member.status || "active")
                                .charAt(0)
                                .toUpperCase() +
                                (member.status || "active").slice(1)}
                            </span>
                          </td>
                          <td className="p-3 text-sm">
                            {member.joined_at
                              ? new Date(member.joined_at).toLocaleDateString()
                              : member.joinDate}
                          </td>
                          <td className="p-3 text-sm">
                            {member.last_active || member.lastActive || "-"}
                          </td>
                          <td className="p-3 text-sm">
                            {member.revenue || "$0.00"}
                          </td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(
                                      `/platform/${platformId}/members/${member.id}`,
                                    )
                                  }
                                >
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" /> Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>Change Tier</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No members found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {searchQuery || filterTier !== "all" || filterStatus !== "all"
                    ? "No members match your current filters. Try adjusting your search or filters."
                    : "You haven't added any members to your platform yet. Invite members to get started."}
                </p>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" /> Invite Members
                </Button>
              </div>
            )}
          </TabsContent>

          {filteredMembers.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredMembers.length} of{" "}
              {members.length || sampleMembers.length} members
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberManagement;

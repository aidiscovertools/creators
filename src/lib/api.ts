import { supabase } from "./supabase";

// Platform API
export const platformApi = {
  // Get all platforms for the current user
  getUserPlatforms: async () => {
    const { data, error } = await supabase
      .from("platforms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single platform by ID
  getPlatform: async (id: string) => {
    const { data, error } = await supabase
      .from("platforms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new platform
  createPlatform: async (platformData: any) => {
    const { data, error } = await supabase
      .from("platforms")
      .insert(platformData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a platform
  updatePlatform: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("platforms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a platform
  deletePlatform: async (id: string) => {
    const { error } = await supabase.from("platforms").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Subscription Tiers API
export const tierApi = {
  // Get all tiers for a platform
  getPlatformTiers: async (platformId: string) => {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*")
      .eq("platform_id", platformId)
      .order("price", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create a new tier
  createTier: async (tierData: any) => {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .insert(tierData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a tier
  updateTier: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a tier
  deleteTier: async (id: string) => {
    const { error } = await supabase
      .from("subscription_tiers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Content API
export const contentApi = {
  // Get all content for a platform
  getPlatformContent: async (platformId: string) => {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .eq("platform_id", platformId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single content item
  getContent: async (id: string) => {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new content
  createContent: async (contentData: any) => {
    const { data, error } = await supabase
      .from("content")
      .insert(contentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update content
  updateContent: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("content")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete content
  deleteContent: async (id: string) => {
    const { error } = await supabase.from("content").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Members API
export const memberApi = {
  // Get all members for a platform
  getPlatformMembers: async (platformId: string) => {
    const { data, error } = await supabase
      .from("members")
      .select(
        `*, 
        profiles:user_id(id, name, email, avatar_url), 
        subscription_tiers:tier_id(id, name, price)`,
      )
      .eq("platform_id", platformId)
      .order("joined_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Invite a member
  inviteMember: async (memberData: any) => {
    // In a real app, this would send an email invitation
    // For now, we'll just create the member record
    const { data, error } = await supabase
      .from("members")
      .insert(memberData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a member
  updateMember: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("members")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a member
  deleteMember: async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

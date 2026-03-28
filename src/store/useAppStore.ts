import { create } from 'zustand';
import { User, PetService, Banner, LostFoundPost, CommunityPost, CommunityComment, Inquiry, Notification } from '../types';
import { leadsApi } from '../api/leads.api';
import { vendorApi } from '../api/vendor.api';
import { listingsApi } from '../api/listings.api';
import { lostFoundApi } from '../api/lostfound.api';
import { communityApi } from '../api/community.api';
import { bannersApi } from '../api/banners.api';
import { notificationsApi } from '../api/notifications.api';
import { userApi } from '../api/user.api';
import { subscriptionApi } from '../api/subscription.api';

interface AppState {
  user: User | null;
  services: PetService[];
  banners: Banner[];
  isLoading: boolean;
  location: string;
  lostFoundPosts: LostFoundPost[];
  favorites: string[];
  inquiries: Inquiry[];
  communityPosts: CommunityPost[];
  notifications: Notification[];
  userRole: 'user' | 'vendor' | 'admin';
  leadCredits: number;
  subscription: {
    plan: 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    expiryDate?: string;
    isActive: boolean;
  };
  isInquiryModalOpen: boolean;
  selectedServiceForInquiry: { id: string; vendorId: string; name: string; initialType?: string } | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: 'user' | 'vendor' | 'admin') => void;
  buyLeads: (amount: number) => void;
  updateSubscription: (plan: 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM') => Promise<void>;
  cancelSubscription: () => void;
  setServices: (services: PetService[]) => void;
  addService: (service: Omit<PetService, 'id'>) => void;
  updateService: (id: string, service: Partial<PetService>) => void;
  deleteService: (id: string) => void;
  approveService: (id: string) => void;
  deleteLostFoundPost: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setLocation: (location: string) => void;
  addLostFoundPost: (post: Omit<LostFoundPost, 'id' | 'createdAt' | 'userName' | 'userImage'>) => void;
  updateLostFoundPost: (id: string, post: Partial<LostFoundPost>) => void;
  toggleFavorite: (serviceId: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'userId' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'userName' | 'userImage' | 'userId' | 'likes' | 'comments'>) => void;
  updateCommunityPost: (id: string, post: Partial<CommunityPost>) => void;
  deleteCommunityPost: (id: string) => void;
  toggleLikeCommunityPost: (postId: string) => void;
  addCommunityComment: (postId: string, text: string) => void;
  setLostFoundPosts: (posts: LostFoundPost[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  fetchVendorStats: (vendorId: string) => Promise<void>;
  openInquiryModal: (service: { id: string; vendorId: string; name: string; initialType?: string }) => void;
  closeInquiryModal: () => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  userRole: 'user',
  leadCredits: 0,
  subscription: {
    plan: 'FREE',
    isActive: true
  },
  isInquiryModalOpen: false,
  selectedServiceForInquiry: null,
  location: 'Mumbai',
  favorites: [],
  inquiries: [],
  notifications: [],
  banners: [],
  services: [],
  lostFoundPosts: [],
  communityPosts: [],
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const [banners, listingsResponse, communityPosts, lostFoundPosts] = await Promise.all([
        bannersApi.getBanners(),
        listingsApi.getListings(),
        communityApi.getPosts(),
        lostFoundApi.getLostFoundPosts(),
      ]);

      set({
        banners,
        services: listingsResponse.data,
        communityPosts,
        lostFoundPosts,
      });

      // If user is logged in, fetch their profile and notifications
      const user = get().user;
      if (user) {
        const [notifications, profile] = await Promise.all([
          notificationsApi.getNotifications(),
          userApi.getProfile(),
        ]);
        set({ notifications, user: profile, userRole: profile.role });
        if (profile.role === 'vendor') {
          await get().fetchVendorStats(profile.id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await userApi.login(email, password);
      localStorage.setItem('auth_token', token);
      set({ user, userRole: user.role });
      await get().initialize();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      user: null,
      userRole: 'user',
      notifications: [],
      inquiries: [],
      leadCredits: 0,
      subscription: { plan: 'FREE', isActive: true },
    });
  },

  fetchVendorStats: async (vendorId) => {
    try {
      const stats = await vendorApi.getStats(vendorId);
      set({
        leadCredits: stats.leadCredits,
        subscription: stats.subscription,
      });
    } catch (error) {
      console.error('Failed to fetch vendor stats:', error);
    }
  },
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  buyLeads: async (amount) => {
    const state = get();
    // In a real app, we'd get the vendorId from the user's profile
    const vendorId = 'v1'; 
    try {
      const newBalance = await leadsApi.buyLeads(vendorId, amount);
      set({ leadCredits: newBalance });
    } catch (error) {
      console.error('Failed to buy leads:', error);
      // Fallback to local state if API fails
      set((state) => ({ leadCredits: state.leadCredits + amount }));
    }
  },
  updateSubscription: async (plan) => {
    set({ isLoading: true });
    try {
      const { subscription } = await subscriptionApi.upgrade(plan);
      set({ subscription });
      // Refresh listings to reflect premium status
      const response = await listingsApi.getListings();
      set({ services: response.data });
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  cancelSubscription: () => set({
    subscription: {
      plan: 'FREE',
      isActive: true
    }
  }),
  setServices: (services) => set({ services }),
  addService: async (serviceData) => {
    set({ isLoading: true });
    try {
      const newService = await listingsApi.createListing(serviceData);
      set((state) => ({
        services: [newService, ...state.services]
      }));
    } catch (error) {
      console.error('Failed to add service:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateService: async (id, updatedService) => {
    set({ isLoading: true });
    try {
      const updated = await listingsApi.updateListing(id, updatedService);
      set((state) => ({
        services: state.services.map(s => s.id === id ? updated : s)
      }));
    } catch (error) {
      console.error('Failed to update service:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteService: async (id) => {
    set({ isLoading: true });
    try {
      await listingsApi.deleteListing(id);
      set((state) => ({
        services: state.services.filter(s => s.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete service:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  approveService: async (id) => {
    try {
      await listingsApi.updateListing(id, { isVerified: true });
      set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, isVerified: true } : s)
      }));
    } catch (error) {
      console.error('Failed to approve service:', error);
    }
  },
  deleteLostFoundPost: async (id) => {
    try {
      await lostFoundApi.deletePost(id);
      set((state) => ({
        lostFoundPosts: state.lostFoundPosts.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete lost/found post:', error);
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setLocation: (location) => set({ location }),
  addLostFoundPost: async (postData) => {
    set({ isLoading: true });
    try {
      const newPost = await lostFoundApi.createPost(postData);
      set((state) => ({
        lostFoundPosts: [newPost, ...state.lostFoundPosts]
      }));
    } catch (error) {
      console.error('Failed to add lost/found post:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateLostFoundPost: (id, updatedPost) => set((state) => ({
    lostFoundPosts: state.lostFoundPosts.map(p => p.id === id ? { ...p, ...updatedPost } : p)
  })),
  toggleFavorite: (serviceId) => set((state) => ({
    favorites: state.favorites.includes(serviceId)
      ? state.favorites.filter(id => id !== serviceId)
      : [...state.favorites, serviceId]
  })),
  addInquiry: async (inquiryData) => {
    const state = get();
    set({ isLoading: true });
    try {
      const newInquiry = await leadsApi.createLead({
        ...inquiryData,
        userId: state.user?.id || 'guest',
        status: 'new',
      });
      set((state) => ({
        inquiries: [newInquiry, ...state.inquiries]
      }));
      
      // Add notification for the vendor
      get().addNotification({
        userId: newInquiry.vendorId,
        type: 'lead',
        title: 'New Lead Received!',
        message: `${newInquiry.userName} is interested in "${newInquiry.serviceName}".`,
        link: '/vendor/dashboard'
      });
    } catch (error) {
      console.error('Failed to create lead:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateInquiryStatus: async (id, status) => {
    try {
      await leadsApi.updateLeadStatus(id, status);
      set((state) => ({
        inquiries: state.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
      }));
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  },
  addCommunityPost: async (postData) => {
    set({ isLoading: true });
    try {
      const newPost = await communityApi.createPost(postData);
      set((state) => ({
        communityPosts: [newPost, ...state.communityPosts]
      }));
    } catch (error) {
      console.error('Failed to add community post:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateCommunityPost: async (id, updatedPost) => {
    try {
      const updated = await communityApi.updatePost(id, updatedPost);
      set((state) => ({
        communityPosts: state.communityPosts.map(p => p.id === id ? updated : p)
      }));
    } catch (error) {
      console.error('Failed to update community post:', error);
    }
  },
  deleteCommunityPost: async (id) => {
    try {
      await communityApi.deletePost(id);
      set((state) => ({
        communityPosts: state.communityPosts.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete community post:', error);
    }
  },
  toggleLikeCommunityPost: async (postId) => {
    try {
      const { likes } = await communityApi.toggleLike(postId);
      set((state) => ({
        communityPosts: state.communityPosts.map(post => 
          post.id === postId ? { ...post, likes } : post
        )
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  },
  addCommunityComment: async (postId, text) => {
    try {
      const newComment = await communityApi.addComment(postId, text);
      set((state) => ({
        communityPosts: state.communityPosts.map(post => 
          post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  },
  setLostFoundPosts: (lostFoundPosts) => set({ lostFoundPosts }),
  addNotification: async (notificationData) => {
    // This might be called from other actions, or automatically by the backend
    // For now, let's assume we can add them locally if needed, but usually they come from API
    set((state) => ({
      notifications: [
        {
          ...notificationData,
          id: Math.random().toString(36).substring(7),
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...state.notifications
      ]
    }));
  },
  markNotificationAsRead: async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  markAllNotificationsAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
  clearNotifications: async () => {
    try {
      await notificationsApi.clearAll();
      set({ notifications: [] });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },
  openInquiryModal: (service) => set({ 
    selectedServiceForInquiry: service, 
    isInquiryModalOpen: true 
  }),
  closeInquiryModal: () => set({ 
    isInquiryModalOpen: false,
    // Keep selectedServiceForInquiry until modal animation finishes if needed, 
    // but usually resetting it is fine if the modal handles its own exit animation state
  }),
}));

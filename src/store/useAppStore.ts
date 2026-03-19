import { create } from 'zustand';
import { User, PetService, Banner, LostFoundPost, CommunityPost, CommunityComment, Inquiry, Notification } from '../types';

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
    plan: 'free' | 'premium';
    expiryDate?: string;
    status: 'active' | 'expired' | 'none';
  };
  isInquiryModalOpen: boolean;
  selectedServiceForInquiry: { id: string; name: string } | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: 'user' | 'vendor' | 'admin') => void;
  buyLeads: (amount: number) => void;
  updateSubscription: (plan: 'free' | 'premium') => void;
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
  toggleFavorite: (serviceId: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'userId' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'userName' | 'userImage' | 'userId' | 'likes' | 'comments'>) => void;
  toggleLikeCommunityPost: (postId: string) => void;
  addCommunityComment: (postId: string, text: string) => void;
  setLostFoundPosts: (posts: LostFoundPost[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  openInquiryModal: (service: { id: string; name: string }) => void;
  closeInquiryModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'u1',
    name: 'Antriksh Shah',
    email: 'shah.antriksh@gmail.com',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    role: 'admin',
  },
  userRole: 'admin', // Defaulting to admin for testing the dashboard
  leadCredits: 50,
  subscription: {
    plan: 'free',
    status: 'none'
  },
  isInquiryModalOpen: false,
  selectedServiceForInquiry: null,
  location: 'Mumbai',
  favorites: [],
  inquiries: [],
  notifications: [
    {
      id: 'n1',
      type: 'lead',
      title: 'New Lead Received!',
      message: 'Someone is interested in "Happy Paws Grooming". Check it out!',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      link: '/vendor/dashboard'
    },
    {
      id: 'n2',
      type: 'reminder',
      title: 'Complete Your Profile',
      message: 'A complete profile gets 3x more leads. Add your business images now!',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      link: '/vendor/dashboard'
    },
    {
      id: 'n3',
      type: 'lost_found',
      title: 'Lost Pet Alert!',
      message: 'A Golden Retriever was reported lost near your location.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      link: '/lost-found'
    }
  ],
  banners: [
    {
      id: 'b1',
      title: 'Monsoon Pet Care Sale',
      image: 'https://picsum.photos/seed/petbanner1/800/400',
      link: '/offers'
    },
    {
      id: 'b2',
      title: 'Free Vet Consultation',
      image: 'https://picsum.photos/seed/petbanner2/800/400',
      link: '/vets'
    }
  ],
  services: [
    {
      id: 's1',
      vendorId: 'u1',
      name: 'Happy Paws Grooming',
      category: 'Grooming',
      rating: 4.8,
      reviewCount: 124,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
      location: 'Andheri West, Mumbai',
      price: '₹800',
      description: 'Professional grooming services for all breeds. We use organic shampoos and provide a stress-free environment.',
      phone: '9876543210',
      whatsapp: '9876543210',
      isVerified: true,
      isPremium: true,
      isTopRated: true
    },
    {
      id: 's2',
      vendorId: 'u1',
      name: 'Doggy Daycare Center',
      category: 'Daycare',
      rating: 4.5,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1df0?auto=format&fit=crop&q=80&w=400',
      location: 'Bandra East, Mumbai',
      price: '₹500/day',
      description: 'Safe and fun daycare for your furry friends. Large play area and experienced staff.',
      phone: '9876543211',
      whatsapp: '9876543211',
      isVerified: true,
      isPremium: false,
      isMostBooked: true
    }
  ],
  lostFoundPosts: [],
  communityPosts: [
    {
      id: 'cp1',
      userId: 'u2',
      userName: 'Sarah Jenkins',
      userImage: 'https://picsum.photos/seed/user3/100/100',
      category: 'Tips',
      content: 'Always keep your pets hydrated during the summer months. Carry a portable water bowl whenever you go out!',
      image: 'https://picsum.photos/seed/pettip1/600/400',
      likes: ['u1'],
      comments: [
        {
          id: 'c1',
          userId: 'u1',
          userName: 'Antriksh Shah',
          userImage: 'https://picsum.photos/seed/user1/100/100',
          text: 'Great tip! I always carry one for my Lab.',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'cp2',
      userId: 'u3',
      userName: 'Michael Chen',
      userImage: 'https://picsum.photos/seed/user4/100/100',
      category: 'Stories',
      content: 'Adopted this little guy yesterday. He was so scared at the shelter, but now he won\'t stop wagging his tail!',
      image: 'https://picsum.photos/seed/petstory1/600/400',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
  ],
  isLoading: false,
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  buyLeads: (amount) => set((state) => ({ leadCredits: state.leadCredits + amount })),
  updateSubscription: (plan) => set({
    subscription: {
      plan,
      status: 'active',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }),
  cancelSubscription: () => set({
    subscription: {
      plan: 'free',
      status: 'none'
    }
  }),
  setServices: (services) => set({ services }),
  addService: (service) => set((state) => ({
    services: [...state.services, { ...service, id: `s${state.services.length + 1}` }]
  })),
  updateService: (id, updatedService) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, ...updatedService } : s)
  })),
  deleteService: (id) => set((state) => ({
    services: state.services.filter(s => s.id !== id)
  })),
  approveService: (id) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, isVerified: true } : s)
  })),
  deleteLostFoundPost: (id) => set((state) => ({
    lostFoundPosts: state.lostFoundPosts.filter(p => p.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setLocation: (location) => set({ location }),
  addLostFoundPost: (post) => set((state) => ({
    lostFoundPosts: [
      {
        ...post,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        userName: state.user?.name || 'Guest User',
        userImage: state.user?.avatar || 'https://picsum.photos/seed/guest/100/100'
      },
      ...state.lostFoundPosts
    ]
  })),
  toggleFavorite: (serviceId) => set((state) => ({
    favorites: state.favorites.includes(serviceId)
      ? state.favorites.filter(id => id !== serviceId)
      : [...state.favorites, serviceId]
  })),
  addInquiry: (inquiry) => set((state) => ({
    inquiries: [
      {
        ...inquiry,
        id: Math.random().toString(36).substring(7),
        userId: state.user?.id || 'guest',
        status: 'new',
        createdAt: new Date().toISOString()
      },
      ...state.inquiries
    ]
  })),
  updateInquiryStatus: (id, status) => set((state) => ({
    inquiries: state.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
  })),
  addCommunityPost: (post) => set((state) => ({
    communityPosts: [
      {
        ...post,
        id: Math.random().toString(36).substring(7),
        userId: state.user?.id || 'guest',
        userName: state.user?.name || 'Guest User',
        userImage: state.user?.avatar || 'https://picsum.photos/seed/guest/100/100',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      },
      ...state.communityPosts
    ]
  })),
  toggleLikeCommunityPost: (postId) => set((state) => ({
    communityPosts: state.communityPosts.map(post => {
      if (post.id === postId) {
        const userId = state.user?.id || 'guest';
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    })
  })),
  addCommunityComment: (postId, text) => set((state) => ({
    communityPosts: state.communityPosts.map(post => {
      if (post.id === postId) {
        const newComment: CommunityComment = {
          id: Math.random().toString(36).substring(7),
          userId: state.user?.id || 'guest',
          userName: state.user?.name || 'Guest User',
          userImage: state.user?.avatar || 'https://picsum.photos/seed/guest/100/100',
          text,
          createdAt: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    })
  })),
  setLostFoundPosts: (lostFoundPosts) => set({ lostFoundPosts }),
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Math.random().toString(36).substring(7),
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ]
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
  clearNotifications: () => set({ notifications: [] }),
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

import { LucideIcon } from 'lucide-react';

export type UserRole = 'user' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
}

export type InquiryType = 'call' | 'whatsapp' | 'inquiry';

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface Inquiry {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  userId: string;
  userName: string;
  userPhone: string;
  message: string;
  type: InquiryType;
  serviceType?: string;
  preferredTime?: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface PetService {
  id: string;
  vendorId: string;
  name: string;
  category: 'Pet Shops' | 'Vet Clinics' | 'Grooming' | 'Trainers' | 'Pet Hotels' | 'Events' | 'Daycare';
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  price?: string;
  isPremium: boolean;
  isVerified?: boolean;
  phone: string;
  whatsapp: string;
  description: string;
  isTopRated?: boolean;
  isMostBooked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
  title: string;
}

export interface LostFoundPost {
  id: string;
  type: 'lost' | 'found';
  petType: string;
  petName?: string;
  description: string;
  location: string;
  image: string;
  contactInfo: string;
  createdAt: string;
  userName: string;
  userImage: string;
}

export interface CommunityComment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  category: 'Tips' | 'Adoption' | 'Stories';
  content: string;
  image?: string;
  likes: string[]; // Array of user IDs
  comments: CommunityComment[];
  createdAt: string;
}

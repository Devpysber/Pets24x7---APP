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

export interface OperatingHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export interface PetService {
  id: string;
  vendorId: string;
  vendorName?: string;
  name: string;
  category: 'Pet Shops' | 'Vet Clinics' | 'Grooming' | 'Trainers' | 'Pet Hotels' | 'Events' | 'Daycare' | 'Boarding' | 'Walking';
  rating: number;
  reviewCount: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image: string;
  gallery?: string[];
  galleryCaptions?: string[];
  price?: string;
  isPremium: boolean;
  isVerified?: boolean;
  phone: string;
  whatsapp: string;
  description: string;
  isTopRated?: boolean;
  isMostBooked?: boolean;
  operatingHours?: OperatingHours;
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
  petCategory: 'Dog' | 'Cat' | 'Bird' | 'Other';
  petType: string;
  petName?: string;
  breed?: string;
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
  serviceId?: string;
}

export type NotificationType = 'lead' | 'message' | 'lost_found' | 'reminder' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  metadata?: any;
}

import { PetService, LostFoundPost, User, OperatingHours } from '../types';

const defaultOperatingHours: OperatingHours = {
  monday: { open: '09:00 AM', close: '07:00 PM' },
  tuesday: { open: '09:00 AM', close: '07:00 PM' },
  wednesday: { open: '09:00 AM', close: '07:00 PM' },
  thursday: { open: '09:00 AM', close: '07:00 PM' },
  friday: { open: '09:00 AM', close: '07:00 PM' },
  saturday: { open: '10:00 AM', close: '05:00 PM' },
  sunday: { open: '10:00 AM', close: '02:00 PM', closed: true },
};

export const mockServices: PetService[] = [
  {
    id: 's1',
    vendorId: 'v1',
    name: 'Paws & Claws Grooming',
    category: 'Grooming',
    rating: 4.8,
    reviewCount: 124,
    location: 'Andheri West, Mumbai',
    coordinates: { lat: 19.1136, lng: 72.8697 },
    image: 'https://picsum.photos/seed/grooming1/400/300',
    gallery: [
      'https://picsum.photos/seed/grooming1/800/600',
      'https://picsum.photos/seed/grooming2/800/600',
      'https://picsum.photos/seed/grooming3/800/600'
    ],
    isPremium: true,
    phone: '+919876543210',
    whatsapp: '919876543210',
    description: 'Professional grooming services for all breeds.',
    price: '₹500',
    operatingHours: defaultOperatingHours
  },
  {
    id: 's2',
    vendorId: 'v2',
    name: 'Happy Tails Pet Hotel',
    category: 'Pet Hotels',
    rating: 4.9,
    reviewCount: 89,
    location: 'Bandra East, Mumbai',
    coordinates: { lat: 19.0607, lng: 72.8362 },
    image: 'https://picsum.photos/seed/pethotel1/400/300',
    gallery: [
      'https://picsum.photos/seed/pethotel1/800/600',
      'https://picsum.photos/seed/pethotel2/800/600',
      'https://picsum.photos/seed/pethotel3/800/600'
    ],
    isPremium: true,
    isVerified: false,
    phone: '+919876543211',
    whatsapp: '919876543211',
    description: 'Luxury boarding for your furry friends.',
    price: '₹1200',
    operatingHours: defaultOperatingHours
  },
  {
    id: 's3',
    vendorId: 'v3',
    name: 'City Vet Clinic',
    category: 'Vet Clinics',
    rating: 4.5,
    reviewCount: 256,
    location: 'Colaba, Mumbai',
    coordinates: { lat: 18.9067, lng: 72.8147 },
    image: 'https://picsum.photos/seed/vet1/400/300',
    isPremium: false,
    phone: '+919876543212',
    whatsapp: '919876543212',
    description: '24/7 emergency veterinary services.',
    price: '₹800',
    operatingHours: {
      ...defaultOperatingHours,
      sunday: { open: '10:00 AM', close: '02:00 PM', closed: false },
    }
  },
  {
    id: 's4',
    vendorId: 'v4',
    name: 'Elite Dog Trainers',
    category: 'Trainers',
    rating: 4.7,
    reviewCount: 45,
    location: 'Juhu, Mumbai',
    coordinates: { lat: 19.1075, lng: 72.8263 },
    image: 'https://picsum.photos/seed/trainer1/400/300',
    isPremium: false,
    phone: '+919876543213',
    whatsapp: '919876543213',
    description: 'Certified trainers for behavioral correction.',
    price: '₹1500'
  },
  {
    id: 's5',
    vendorId: 'v5',
    name: 'Pet Shop Central',
    category: 'Pet Shops',
    rating: 4.2,
    reviewCount: 67,
    location: 'Worli, Mumbai',
    coordinates: { lat: 19.0176, lng: 72.8177 },
    image: 'https://picsum.photos/seed/petshop1/400/300',
    isPremium: false,
    phone: '+919876543214',
    whatsapp: '919876543214',
    description: 'All your pet supplies in one place.',
    price: '₹200'
  },
  {
    id: 's6',
    vendorId: 'v6',
    name: 'Sunshine Daycare',
    category: 'Daycare',
    rating: 4.6,
    reviewCount: 34,
    location: 'Powai, Mumbai',
    coordinates: { lat: 19.1176, lng: 72.9060 },
    image: 'https://picsum.photos/seed/daycare1/400/300',
    isPremium: false,
    phone: '+919876543215',
    whatsapp: '919876543215',
    description: 'Fun and safe daycare for your pets.',
    price: '₹600'
  }
];

export const mockLostFoundPosts: LostFoundPost[] = [
  {
    id: '1',
    type: 'lost',
    petCategory: 'Dog',
    petType: 'Golden Retriever',
    petName: 'Buddy',
    breed: 'Golden Retriever',
    description: 'Lost near Juhu Beach. Wearing a red collar. Answers to "Buddy".',
    location: 'Juhu, Mumbai',
    image: 'https://picsum.photos/seed/lost1/600/600',
    contactInfo: '9876543210',
    createdAt: new Date().toISOString(),
    userName: 'Rahul Sharma',
    userImage: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: '2',
    type: 'found',
    petCategory: 'Cat',
    petType: 'Persian',
    petName: 'Unknown',
    breed: 'Persian',
    description: 'Found a white Persian cat in Bandra. Very friendly.',
    location: 'Bandra, Mumbai',
    image: 'https://picsum.photos/seed/found1/600/600',
    contactInfo: '9123456789',
    createdAt: new Date().toISOString(),
    userName: 'Priya Patel',
    userImage: 'https://picsum.photos/seed/user2/100/100'
  }
];

export const mockUser: User = {
  id: 'u1',
  name: 'Antriksh Shah',
  email: 'shah.antriksh@gmail.com',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  role: 'admin',
};

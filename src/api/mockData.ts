import { PetService, LostFoundPost, User } from '../types';

export const mockServices: PetService[] = [
  {
    id: 's1',
    vendorId: 'v1',
    name: 'Paws & Claws Grooming',
    category: 'Grooming',
    rating: 4.8,
    reviewCount: 124,
    location: 'Andheri West, Mumbai',
    image: 'https://picsum.photos/seed/grooming1/400/300',
    isPremium: true,
    phone: '+919876543210',
    whatsapp: '919876543210',
    description: 'Professional grooming services for all breeds.'
  },
  {
    id: 's2',
    vendorId: 'v2',
    name: 'Happy Tails Pet Hotel',
    category: 'Pet Hotels',
    rating: 4.9,
    reviewCount: 89,
    location: 'Bandra East, Mumbai',
    image: 'https://picsum.photos/seed/pethotel1/400/300',
    isPremium: true,
    isVerified: false,
    phone: '+919876543211',
    whatsapp: '919876543211',
    description: 'Luxury boarding for your furry friends.'
  },
  {
    id: 's3',
    vendorId: 'v3',
    name: 'City Vet Clinic',
    category: 'Vet Clinics',
    rating: 4.5,
    reviewCount: 256,
    location: 'Colaba, Mumbai',
    image: 'https://picsum.photos/seed/vet1/400/300',
    isPremium: false,
    phone: '+919876543212',
    whatsapp: '919876543212',
    description: '24/7 emergency veterinary services.'
  },
  {
    id: 's4',
    vendorId: 'v4',
    name: 'Elite Dog Trainers',
    category: 'Trainers',
    rating: 4.7,
    reviewCount: 45,
    location: 'Juhu, Mumbai',
    image: 'https://picsum.photos/seed/trainer1/400/300',
    isPremium: false,
    phone: '+919876543213',
    whatsapp: '919876543213',
    description: 'Certified trainers for behavioral correction.'
  }
];

export const mockLostFoundPosts: LostFoundPost[] = [
  {
    id: '1',
    type: 'lost',
    petType: 'Dog (Golden Retriever)',
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
    petType: 'Cat (Persian)',
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

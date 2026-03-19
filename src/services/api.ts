import { listingsApi } from '../api/listings.api';
import { userApi } from '../api/user.api';
import { leadsApi } from '../api/leads.api';
import { lostFoundApi } from '../api/lostfound.api';
import { PetService, Inquiry, User, LostFoundPost } from '../types';

// Bridge to the new API integration layer
export const api = {
  services: {
    getAll: listingsApi.getListings,
    getById: listingsApi.getListingById,
    create: listingsApi.createListing
  },
  inquiries: {
    submit: async (inquiry: any): Promise<boolean> => {
      try {
        await leadsApi.createLead(inquiry);
        return true;
      } catch (error) {
        console.error('Inquiry submission failed:', error);
        return false;
      }
    }
  },
  auth: {
    login: userApi.login
  },
  posts: {
    getLostFound: lostFoundApi.getLostFoundPosts,
    create: lostFoundApi.createPost
  }
};

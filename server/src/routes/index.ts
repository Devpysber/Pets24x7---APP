import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import * as listingsController from '../controllers/listings.controller.js';
import * as leadsController from '../controllers/leads.controller.js';
import * as authController from '../controllers/auth.controller.js';
import * as vendorController from '../controllers/vendor.controller.js';
import * as lostFoundController from '../controllers/lostfound.controller.js';
import * as communityController from '../controllers/community.controller.js';
import * as bannersController from '../controllers/banners.controller.js';
import * as notificationsController from '../controllers/notifications.controller.js';
import * as subscriptionController from '../controllers/subscription.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Health Check
router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString() 
    });
  }
});

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);
router.get('/auth/profile', authenticate, authController.getProfile);

// Subscription Routes
router.get('/subscription', authenticate, authorize(['VENDOR', 'ADMIN']), subscriptionController.getSubscription);
router.post('/subscription/upgrade', authenticate, authorize(['VENDOR', 'ADMIN']), subscriptionController.upgradeSubscription);

// Listings Routes (Public)
router.get('/listings', listingsController.getListings);
router.get('/listing/:id', listingsController.getListingById);
router.get('/listings/:id', listingsController.getListingById); // Alias

// Protected Listings (Vendor/Admin)
router.post('/listing', authenticate, authorize(['VENDOR', 'ADMIN']), listingsController.createListing);
router.post('/listings', authenticate, authorize(['VENDOR', 'ADMIN']), listingsController.createListing); // Alias

// Leads Routes (Protected)
router.post('/lead', authenticate, leadsController.createLead);
router.post('/leads', authenticate, leadsController.createLead); // Alias
router.get('/vendor/leads', authenticate, authorize(['VENDOR', 'ADMIN']), (req: any, res) => {
  // If vendorId is not in params, we might want to get it from the user profile
  // For now, keeping the param-based one but adding this for the contract
  res.status(400).json({ error: 'vendorId required' });
});
router.get('/leads/vendor/:vendorId', authenticate, authorize(['VENDOR', 'ADMIN']), leadsController.getLeadsByVendor);
router.patch('/lead/:id/status', authenticate, authorize(['VENDOR', 'ADMIN']), leadsController.updateLeadStatus);
router.patch('/leads/:id/status', authenticate, authorize(['VENDOR', 'ADMIN']), leadsController.updateLeadStatus); // Alias
router.post('/leads/buy', authenticate, authorize(['VENDOR', 'ADMIN']), leadsController.buyLeads);

// Vendor Dashboard Routes (Protected)
router.get('/vendor/:vendorId/dashboard', authenticate, authorize(['VENDOR', 'ADMIN']), vendorController.getVendorDashboard);
router.get('/vendor/:vendorId/stats', authenticate, authorize(['VENDOR', 'ADMIN']), vendorController.getVendorStats);
router.get('/vendor/:vendorId/leads', authenticate, authorize(['VENDOR', 'ADMIN']), vendorController.getVendorLeads);
router.put('/vendor/:vendorId/profile', authenticate, authorize(['VENDOR', 'ADMIN']), vendorController.updateVendorProfile);

// Lost & Found Routes
router.get('/lostfound', lostFoundController.getLostFoundPosts);
router.get('/lost-found', lostFoundController.getLostFoundPosts); // Alias
router.post('/lostfound', authenticate, lostFoundController.createLostFoundPost);
router.post('/lost-found', authenticate, lostFoundController.createLostFoundPost); // Alias
router.delete('/lostfound/:id', authenticate, lostFoundController.deleteLostFoundPost);
router.delete('/lost-found/:id', authenticate, lostFoundController.deleteLostFoundPost); // Alias

// Community Routes
router.get('/posts', communityController.getPosts);
router.get('/community', communityController.getPosts); // Alias
router.post('/post', authenticate, communityController.createPost);
router.post('/community', authenticate, communityController.createPost); // Alias
router.post('/community/:postId/like', authenticate, communityController.toggleLike);
router.post('/community/:postId/comments', authenticate, communityController.addComment);

// Banners Routes (Public)
router.get('/banners', bannersController.getBanners);

// Notifications Routes (Protected)
router.get('/notifications', authenticate, notificationsController.getNotifications);
router.patch('/notifications/:id/read', authenticate, notificationsController.markAsRead);
router.post('/notifications/read-all', authenticate, notificationsController.markAllAsRead);
router.delete('/notifications', authenticate, notificationsController.clearAll);

export default router;

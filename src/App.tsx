import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './navigation/AppLayout';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { LostFoundScreen } from './screens/LostFoundScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ServiceDetailsScreen } from './screens/ServiceDetailsScreen';
import { LeadHistoryScreen } from './screens/LeadHistoryScreen';
import NotificationScreen from './screens/NotificationScreen';
import VendorDashboardScreen from './screens/VendorDashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { InquiryModal } from './components/InquiryModal';
import { useAppStore } from './store/useAppStore';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { 
    isInquiryModalOpen, 
    closeInquiryModal, 
    selectedServiceForInquiry, 
    addInquiry,
    initialize 
  } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleInquirySubmit = (data: any) => {
    if (!selectedServiceForInquiry) return;
    addInquiry({
      serviceId: selectedServiceForInquiry.id,
      vendorId: selectedServiceForInquiry.vendorId,
      serviceName: selectedServiceForInquiry.name,
      serviceImage: 'https://picsum.photos/seed/service/400/400', // Fallback or get from store
      userName: data.name,
      userPhone: data.phone,
      message: data.requirement,
      type: 'inquiry',
      preferredTime: data.preferredTime,
      serviceType: data.serviceType
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/service/:id" element={<ServiceDetailsScreen />} />
          <Route path="/lost-found" element={<LostFoundScreen />} />
          <Route path="/community" element={<CommunityScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/login" element={<ProfileScreen />} />
          <Route path="/notifications" element={<NotificationScreen />} />
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <LeadHistoryScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <VendorDashboardScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardScreen />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
      
      <InquiryModal 
        isOpen={isInquiryModalOpen}
        onClose={closeInquiryModal}
        serviceName={selectedServiceForInquiry?.name || ''}
        initialServiceType={selectedServiceForInquiry?.initialType}
        onSubmit={handleInquirySubmit}
      />
    </BrowserRouter>
  );
}

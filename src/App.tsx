import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './navigation/AppLayout';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { LostFoundScreen } from './screens/LostFoundScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ServiceDetailsScreen } from './screens/ServiceDetailsScreen';
import VendorDashboardScreen from './screens/VendorDashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

export default function App() {
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
          <Route path="/vendor/dashboard" element={<VendorDashboardScreen />} />
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

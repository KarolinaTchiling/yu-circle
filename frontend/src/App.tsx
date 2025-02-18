import { Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CommunityPage from './pages/CommunityPage'; 
import MarketplacePage from './pages/MarketplacePage'; 
import DiscoursePage from './pages/DiscoursePage'; 


function App() {
  return (
    <div className="bg-offwhite w-screen min-w-[1000px]">

        <Routes>

          <Route path="/" element={<CommunityPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/discourse" element={<DiscoursePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>


    </div>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebHome from './modules/website/web-pages/WebHome';
import RiderRoutes from './modules/rider/routes/RiderRoutes';
import FranchiseRoutes from './modules/franchise/routes/FranchiseRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebHome />} />
        <Route path="/rider/*" element={<RiderRoutes />} />
        <Route path="/franchise/*" element={<FranchiseRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

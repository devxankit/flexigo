import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebHome from './modules/website/web-pages/WebHome';
import RiderRoutes from './modules/rider/routes/RiderRoutes';
import FranchiseRoutes from './modules/franchise/routes/FranchiseRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebHome />} />
        <Route path="/rider/*" element={<RiderRoutes />} />
        <Route path="/franchise/*" element={<FranchiseRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

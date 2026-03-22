import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebHome from './modules/website/web-pages/WebHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebHome />} />
        {/* Further routing can be added here for Admin, Rider App Web-views etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

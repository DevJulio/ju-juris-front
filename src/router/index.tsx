import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import DetailPage from '../pages/DetailPage';

export default function Router() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/jurisprudencia/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

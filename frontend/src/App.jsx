import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Categories from './pages/Categories';
import Suppliers  from './pages/Suppliers';
import Customers  from './pages/Customers';
import Orders     from './pages/Orders';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/products"   element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers"  element={<Suppliers />} />
            <Route path="/customers"  element={<Customers />} />
            <Route path="/orders"     element={<Orders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

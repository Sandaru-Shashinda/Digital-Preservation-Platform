import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ArchiveView from './pages/ArchiveView';
import DetailView from './pages/DetailView';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#f8f7f4]">
          <Navbar />
          <Routes>
            <Route path="/" element={<ArchiveView />} />
            <Route path="/inscription/:id" element={<DetailView />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <footer className="mt-auto border-t border-stone-200 bg-stone-900 text-stone-400 text-xs text-center py-4">
            Sri Lankan Inscription Archive — Digital Preservation Platform
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

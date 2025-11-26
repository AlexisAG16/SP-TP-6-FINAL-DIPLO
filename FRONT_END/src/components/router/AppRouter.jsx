// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage'; 
import CharacterList from '../pages/personajes/CharacterList';
import CharacterDetail from '../pages/personajes/CharacterDetail';
import CharacterCreate from '../pages/personajes/CharacterCreate';
import CharacterEdit from '../pages/personajes/CharacterEdit';
import ObraList from '../pages/obras/ObraList';
import ObraDetail from '../pages/obras/ObraDetail';
import ObraCreate from '../pages/obras/ObraCreate';
import ObraEdit from '../pages/obras/ObraEdit';
import NotFound from '../pages/NotFound';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import Login from '../pages/usuarios/Login';
import Register from '../pages/usuarios/Register';
import ProtectedRoute from './ProtectedRoute'; 
import Contact from '../pages/Contact';
import AboutUs from '../pages/AboutUs';
import Support from '../pages/Support';


const AppRouter = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 grow"> 
        <Routes>
          
          {/* 🟢 RUTA PRINCIPAL: LANDING PAGE */}
          <Route path="/" element={<LandingPage />} />
          
          {/* 🟢 RUTAS DE LISTADO (Personajes y Obras) */}
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/obras" element={<ObraList />} />
          
          {/* 🟢 NUEVAS RUTAS DE INFORMACIÓN */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/support" element={<Support />} />
          
          {/* RUTAS DE AUTENTICACIÓN PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas CRUD - PERSONAJES */}
          <Route path="/characters/:id" element={<CharacterDetail />} />
          {/* Rutas CRUD - OBRAS */}
          <Route path="/obras/:id" element={<ObraDetail />} />
          
          {/* 🔐 RUTAS PROTEGIDAS (Solo para Admin) 🔐 */}
          <Route 
            path="/characters/create" 
            element={
              <ProtectedRoute allowedRoles={['admin']}> 
                <CharacterCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/characters/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CharacterEdit />
              </ProtectedRoute>
            } 
          />
          {/* Rutas protegidas para Obras (solo admin) */}
          <Route 
            path="/obras/create" 
            element={
              <ProtectedRoute allowedRoles={['admin']}> 
                <ObraCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/obras/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ObraEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* RUTA DE FALLO */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;
import { Routes, Route } from "react-router"
//Rutas Publicas
import HomePage from "./pages/homepage/HomePage.jsx"
import PortfolioPage from "./pages/portfolio/PortfolioPage.jsx"
import ExperiencePage from "./pages/experience/ExperiencePage.jsx"
import ContactPage from "./pages/contact/ContactPage.jsx"
import BlogPage from "./pages/blog/BlogPage.jsx"
import BlogPostPage from "./pages/blog/BlogPostPage.jsx"
//Rutas Protegidas
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import LoginPage from "./pages/login/LoginPage.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import ManageBlog from "./pages/admin/ManageBlog.jsx"
import ManagePortfolio from "./pages/admin/ManagePortfolio.jsx"
import ManageExperience from "./pages/admin/ManageExperience.jsx"
import AdminProfile from "./pages/admin/AdminProfile.jsx"
// Ruta 404
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx"


function App() {

  return (
    <>
      <Routes>

        {/* === 1. TUS RUTAS PÚBLICAS === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />

        {/* === 2. RUTA DE LOGIN (PÚBLICA) === */}
        <Route path="/login" element={<LoginPage />} />

        {/* === 3. RUTAS PROTEGIDAS (ADMIN) === */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          {/* Dashes */}
          <Route path="blog" element={<ManageBlog />} />
          <Route path="portfolio" element={<ManagePortfolio />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* === 4. RUTA NOT FOUND (SIEMPRE AL FINAL) === */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </>
  )
}

export default App

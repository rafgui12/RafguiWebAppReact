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
//Rutas Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import AdminProfile from "./pages/admin/AdminProfile.jsx"
//Rutas Admin Blog
import ManageBlog from "./pages/admin/blog/ManageBlog.jsx"
import BlogForm from "./pages/admin/blog/BlogForm.jsx"
//Rutas Admin Experience
import ManageExperience from "./pages/admin/experience/ManageExperience.jsx"
import ExperienceForm from "./pages/admin/experience/ExperienceForm.jsx"
//Rutas Admin Porfolio
import ManagePortfolio from "./pages/admin/porfolio/ManagePortfolio.jsx"
import ProjectForm from "./pages/admin/porfolio/ProjectForm.jsx"
//Rutas Admin Contact
import ManageContact from "./pages/admin/contact/ManageContact.jsx"
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
          <Route path="profile" element={<AdminProfile />} />
          {/* AdminBlog */}
          <Route path="blog" element={<ManageBlog />} />
          <Route path="blog/new" element={<BlogForm />} />
          <Route path="blog/edit/:id" element={<BlogForm />} />
          {/* AdminExperience */}
          <Route path="experience" element={<ManageExperience />} />
          <Route path="experience/new/:type" element={<ExperienceForm />} />
          <Route path="experience/edit/:type/:id" element={<ExperienceForm />} />
          {/* AdminContact */}
          <Route path="contact" element={<ManageContact />} />
          {/* AdminProtfolio */}
          <Route path="portfolio" element={<ManagePortfolio />} />
          <Route path="portfolio/new" element={<ProjectForm />} />
          <Route path="portfolio/edit/:id" element={<ProjectForm />} />
        </Route>
        {/* === 4. RUTA NOT FOUND === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App

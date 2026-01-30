import { Routes, Route } from "react-router"
import { lazy, Suspense } from "react"
import Loading from "./components/Loading"

//Rutas Publicas
const HomePage = lazy(() => import("./pages/homepage/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/portfolio/PortfolioPage.jsx"));
const ExperiencePage = lazy(() => import("./pages/experience/ExperiencePage.jsx"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage.jsx"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage.jsx"));
const BlogPostPage = lazy(() => import("./pages/blog/BlogPostPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));

//Rutas Protegidas
import ProtectedRoute from "./components/ProtectedRoute.jsx"
const LoginPage = lazy(() => import("./pages/login/LoginPage.jsx"));

//Rutas Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile.jsx"));

//Rutas Admin Blog
const ManageBlog = lazy(() => import("./pages/admin/blog/ManageBlog.jsx"));
const BlogForm = lazy(() => import("./pages/admin/blog/BlogForm.jsx"));

//Rutas Admin Experience
const ManageExperience = lazy(() => import("./pages/admin/experience/ManageExperience.jsx"));
const ExperienceForm = lazy(() => import("./pages/admin/experience/ExperienceForm.jsx"));

//Rutas Admin Porfolio
const ManagePortfolio = lazy(() => import("./pages/admin/porfolio/ManagePortfolio.jsx"));
const ProjectForm = lazy(() => import("./pages/admin/porfolio/ProjectForm.jsx"));

//Rutas Admin Contact
const ManageContact = lazy(() => import("./pages/admin/contact/ManageContact.jsx"));

// Ruta 404
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage.jsx"));

import AnalyticsTracker from "./components/AnalyticsTracker.jsx"


function App() {

  return (
    <>
      <AnalyticsTracker />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* === 1. TUS RUTAS PÚBLICAS === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
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
      </Suspense>
    </>
  )
}

export default App

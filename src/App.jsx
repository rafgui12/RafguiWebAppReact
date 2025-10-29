import { Routes, Route } from "react-router"
//Rutas
import HomePage from "./pages/homepage/HomePage.jsx"
import PortfolioPage from "./pages/portfolio/PortfolioPage.jsx"
import ExperiencePage from "./pages/experience/ExperiencePage.jsx"
import ContactPage from "./pages/contact/ContactPage.jsx"
import BlogPage from "./pages/Blog/BlogPage.jsx"
import BlogPostPage from "./pages/Blog/BlogPostPage.jsx"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />;

      </Routes>
    </>
  )
}

export default App

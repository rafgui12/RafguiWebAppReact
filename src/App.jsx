import { Routes, Route } from "react-router"
//Rutas
import HomePage from "./pages/homepage/HomePage.jsx"
import PortfolioPage from "./pages/portfolio/PortfolioPage.jsx"
import ExperiencePage from "./pages/experience/ExperiencePage.jsx"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="*" element={<h1 className='text-red-600'> 404 NotFound</h1>} />;

      </Routes>
    </>
  )
}

export default App

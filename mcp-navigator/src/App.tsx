import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MCPProvider } from './context/MCPContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import BrowsePage from './components/pages/BrowsePage';
import CategoriesPage from './components/pages/CategoriesPage';
import CategoryPage from './components/pages/CategoryPage';
import MCPDetailPage from './components/pages/MCPDetailPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import DataSourcesPage from './components/pages/DataSourcesPage';
import './App.css';

// 獲取 base URL，用於 GitHub Pages 部署
const getBasename = () => {
  return import.meta.env.PROD ? '/MCP-Navigator' : '';
};

function App() {
  return (
    <MCPProvider>
      <Router basename={getBasename()}>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/Categories" element={<Navigate to="/categories" replace />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/mcp/:mcpSlug" element={<MCPDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
          </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </MCPProvider>
  );
}

export default App;

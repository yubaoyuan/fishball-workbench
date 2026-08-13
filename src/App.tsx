import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Purchasing from "./pages/Purchasing";
import Production from "./pages/Production";
import Delivery from "./pages/Delivery";
import Finance from "./pages/Finance";
import Content from "./pages/Content";
import Customers from "./pages/Customers";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import IndustryInsight from "./pages/IndustryInsight";
import UserManagement from "./pages/UserManagement";
import SalesOrders from "./pages/SalesOrders";
import Backup from "./pages/Backup";
import { useAuthStore } from "./store/useAuthStore";

export default function App() {
  const { isAuthenticated, login } = useAuthStore();

  // 自动登录，无需登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      login('u1');
    }
  }, [isAuthenticated, login]);

  return (
    <Router basename={import.meta.env.PROD ? '/fishball-workbench' : '/'}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="purchasing" element={<Purchasing />} />
          <Route path="production" element={<Production />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="finance" element={<Finance />} />
          <Route path="content" element={<Content />} />
          <Route path="customers" element={<Customers />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="industry" element={<IndustryInsight />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="sales" element={<SalesOrders />} />
          <Route path="backup" element={<Backup />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
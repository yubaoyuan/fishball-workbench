import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
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

export default function App() {
  return (
    <Router basename={import.meta.env.PROD ? '/fishball-workbench' : '/'}>
      <Routes>
        {/* 登录页面 - 无需认证 */}
        <Route path="/login" element={<Login />} />

        {/* 工作台 - 需要认证 */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
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

        {/* 未匹配路由重定向到登录 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
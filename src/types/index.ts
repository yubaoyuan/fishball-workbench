export type OrderStatus = 'pending' | 'confirmed' | 'producing' | 'shipping' | 'delivered' | 'cancelled';
export type PurchaseStatus = 'planned' | 'purchased' | 'received';
export type ContentStatus = 'idea' | 'scripting' | 'filming' | 'editing' | 'published';
export type FinanceType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'wechat' | 'alipay' | 'bank';
export type OrderSource = 'wechat' | 'phone' | 'offline' | 'other';
export type ContentPlatform = 'douyin' | 'xiaohongshu' | 'shipinhao' | 'other';

export interface OrderProduct {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  address?: string;
  phone?: string;
  remark?: string;
  source: OrderSource;
}

export interface Purchase {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  supplierId: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  remark?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  tags: string[];
  level: 'vip' | 'regular' | 'new';
  totalOrders: number;
  totalAmount: number;
  totalSpent: number;
  lastOrderDate?: string;
  remark?: string;
}

export interface Content {
  id: string;
  title: string;
  topic: string;
  script?: string;
  platform: ContentPlatform;
  status: ContentStatus;
  publishDate?: string;
  views?: number;
  likes?: number;
  comments?: number;
  coverColor: string;
}

export interface FinanceRecord {
  id: string;
  type: FinanceType;
  category: string;
  amount: number;
  date: string;
  relatedId?: string;
  description: string;
  paymentMethod: PaymentMethod;
}

export interface Todo {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  isAI?: boolean;
}

export interface Production {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  unit: string;
  goodRate: number;
  note?: string;
}

// ========== 销售单 ==========
export type SalesOrderStatus = 'draft' | 'confirmed' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface SalesOrderProduct {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  products: SalesOrderProduct[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: SalesOrderStatus;
  salesDate: string;
  deliveryDate?: string;
  address?: string;
  salesperson: string;
  remark?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  trackingNo: string;
  customerName: string;
  company: string;
  status: 'waiting' | 'shipped' | 'transit' | 'delivered';
  shipDate: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: number;
  children?: NavItem[];
}

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ========== 用户与权限 ==========
export type UserRole = 'owner' | 'production_manager' | 'sales' | 'delivery' | 'finance' | 'content_creator';

export interface UserPermission {
  modules: string[];  // 允许访问的模块ID
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  phone: string;
  permissions: UserPermission;
  active: boolean;
  createdAt: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: '老板/管理员',
  production_manager: '生产主管',
  sales: '销售员',
  delivery: '配送员',
  finance: '财务',
  content_creator: '内容运营',
};

// 每个角色默认可见的模块
export const ROLE_DEFAULT_MODULES: Record<UserRole, string[]> = {
  owner: ['dashboard', 'orders', 'sales', 'purchasing', 'production', 'delivery', 'finance', 'content', 'customers', 'ai-assistant', 'analytics', 'industry', 'users'],
  production_manager: ['dashboard', 'orders', 'sales', 'purchasing', 'production', 'delivery', 'ai-assistant', 'analytics', 'industry'],
  sales: ['dashboard', 'orders', 'sales', 'customers', 'content', 'ai-assistant', 'analytics', 'industry'],
  delivery: ['dashboard', 'delivery', 'orders', 'sales', 'ai-assistant', 'industry'],
  finance: ['dashboard', 'finance', 'orders', 'sales', 'purchasing', 'analytics', 'industry'],
  content_creator: ['dashboard', 'content', 'sales', 'customers', 'ai-assistant', 'analytics', 'industry'],
};

import { create } from 'zustand';
import type { Order, SalesOrder, Customer, Purchase, FinanceRecord, Production, Delivery, Content, Todo } from '../types';
import { mockOrders, mockSalesOrders, mockCustomers, mockPurchases, mockFinanceRecords, mockProduction, mockDeliveries, mockContents, mockTodos } from '../data/mockData';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, initStorage, exportAllData } from '../utils/storage';

// 初始化存储
initStorage();

interface DataState {
  // 数据
  orders: Order[];
  salesOrders: SalesOrder[];
  customers: Customer[];
  purchases: Purchase[];
  financeRecords: FinanceRecord[];
  production: Production[];
  deliveries: Delivery[];
  contents: Content[];
  todos: Todo[];

  // 初始化标记
  initialized: boolean;

  // 初始化
  init: () => void;

  // 订单
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  // 销售单
  addSalesOrder: (order: SalesOrder) => void;
  updateSalesOrder: (id: string, updates: Partial<SalesOrder>) => void;
  deleteSalesOrder: (id: string) => void;

  // 客户
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // 采购
  addPurchase: (purchase: Purchase) => void;
  updatePurchase: (id: string, updates: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;

  // 财务
  addFinanceRecord: (record: FinanceRecord) => void;
  updateFinanceRecord: (id: string, updates: Partial<FinanceRecord>) => void;
  deleteFinanceRecord: (id: string) => void;

  // 生产
  addProduction: (record: Production) => void;
  updateProduction: (id: string, updates: Partial<Production>) => void;
  deleteProduction: (id: string) => void;

  // 配送
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
  deleteDelivery: (id: string) => void;

  // 内容
  addContent: (content: Content) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;

  // 待办
  toggleTodo: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  deleteTodo: (id: string) => void;

  // 导出导入
  exportAll: () => string;
  importAll: (json: string) => boolean;
  resetToMock: () => void;
}

// 辅助函数：生成唯一ID
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// 辅助函数：持久化保存
function persist<T>(key: string, data: T): void {
  saveToStorage(key, data);
}

export const useDataStore = create<DataState>((set, get) => ({
  orders: [],
  salesOrders: [],
  customers: [],
  purchases: [],
  financeRecords: [],
  production: [],
  deliveries: [],
  contents: [],
  todos: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    set({
      orders: loadFromStorage(STORAGE_KEYS.orders, mockOrders),
      salesOrders: loadFromStorage(STORAGE_KEYS.salesOrders, mockSalesOrders),
      customers: loadFromStorage(STORAGE_KEYS.customers, mockCustomers),
      purchases: loadFromStorage(STORAGE_KEYS.purchases, mockPurchases),
      financeRecords: loadFromStorage(STORAGE_KEYS.financeRecords, mockFinanceRecords),
      production: loadFromStorage(STORAGE_KEYS.production, mockProduction),
      deliveries: loadFromStorage(STORAGE_KEYS.deliveries, mockDeliveries),
      contents: loadFromStorage(STORAGE_KEYS.contents, mockContents),
      todos: loadFromStorage(STORAGE_KEYS.todos, mockTodos),
      initialized: true,
    });
  },

  // ========== 订单 ==========
  addOrder: (order) => {
    const orders = [...get().orders, order];
    set({ orders });
    persist(STORAGE_KEYS.orders, orders);
  },
  updateOrder: (id, updates) => {
    const orders = get().orders.map(o => o.id === id ? { ...o, ...updates } : o);
    set({ orders });
    persist(STORAGE_KEYS.orders, orders);
  },
  deleteOrder: (id) => {
    const orders = get().orders.filter(o => o.id !== id);
    set({ orders });
    persist(STORAGE_KEYS.orders, orders);
  },

  // ========== 销售单 ==========
  addSalesOrder: (order) => {
    const salesOrders = [...get().salesOrders, order];
    set({ salesOrders });
    persist(STORAGE_KEYS.salesOrders, salesOrders);
  },
  updateSalesOrder: (id, updates) => {
    const salesOrders = get().salesOrders.map(o => o.id === id ? { ...o, ...updates } : o);
    set({ salesOrders });
    persist(STORAGE_KEYS.salesOrders, salesOrders);
  },
  deleteSalesOrder: (id) => {
    const salesOrders = get().salesOrders.filter(o => o.id !== id);
    set({ salesOrders });
    persist(STORAGE_KEYS.salesOrders, salesOrders);
  },

  // ========== 客户 ==========
  addCustomer: (customer) => {
    const customers = [...get().customers, customer];
    set({ customers });
    persist(STORAGE_KEYS.customers, customers);
  },
  updateCustomer: (id, updates) => {
    const customers = get().customers.map(c => c.id === id ? { ...c, ...updates } : c);
    set({ customers });
    persist(STORAGE_KEYS.customers, customers);
  },
  deleteCustomer: (id) => {
    const customers = get().customers.filter(c => c.id !== id);
    set({ customers });
    persist(STORAGE_KEYS.customers, customers);
  },

  // ========== 采购 ==========
  addPurchase: (purchase) => {
    const purchases = [...get().purchases, purchase];
    set({ purchases });
    persist(STORAGE_KEYS.purchases, purchases);
  },
  updatePurchase: (id, updates) => {
    const purchases = get().purchases.map(p => p.id === id ? { ...p, ...updates } : p);
    set({ purchases });
    persist(STORAGE_KEYS.purchases, purchases);
  },
  deletePurchase: (id) => {
    const purchases = get().purchases.filter(p => p.id !== id);
    set({ purchases });
    persist(STORAGE_KEYS.purchases, purchases);
  },

  // ========== 财务 ==========
  addFinanceRecord: (record) => {
    const financeRecords = [...get().financeRecords, record];
    set({ financeRecords });
    persist(STORAGE_KEYS.financeRecords, financeRecords);
  },
  updateFinanceRecord: (id, updates) => {
    const financeRecords = get().financeRecords.map(r => r.id === id ? { ...r, ...updates } : r);
    set({ financeRecords });
    persist(STORAGE_KEYS.financeRecords, financeRecords);
  },
  deleteFinanceRecord: (id) => {
    const financeRecords = get().financeRecords.filter(r => r.id !== id);
    set({ financeRecords });
    persist(STORAGE_KEYS.financeRecords, financeRecords);
  },

  // ========== 生产 ==========
  addProduction: (record) => {
    const production = [...get().production, record];
    set({ production });
    persist(STORAGE_KEYS.production, production);
  },
  updateProduction: (id, updates) => {
    const production = get().production.map(p => p.id === id ? { ...p, ...updates } : p);
    set({ production });
    persist(STORAGE_KEYS.production, production);
  },
  deleteProduction: (id) => {
    const production = get().production.filter(p => p.id !== id);
    set({ production });
    persist(STORAGE_KEYS.production, production);
  },

  // ========== 配送 ==========
  addDelivery: (delivery) => {
    const deliveries = [...get().deliveries, delivery];
    set({ deliveries });
    persist(STORAGE_KEYS.deliveries, deliveries);
  },
  updateDelivery: (id, updates) => {
    const deliveries = get().deliveries.map(d => d.id === id ? { ...d, ...updates } : d);
    set({ deliveries });
    persist(STORAGE_KEYS.deliveries, deliveries);
  },
  deleteDelivery: (id) => {
    const deliveries = get().deliveries.filter(d => d.id !== id);
    set({ deliveries });
    persist(STORAGE_KEYS.deliveries, deliveries);
  },

  // ========== 内容 ==========
  addContent: (content) => {
    const contents = [...get().contents, content];
    set({ contents });
    persist(STORAGE_KEYS.contents, contents);
  },
  updateContent: (id, updates) => {
    const contents = get().contents.map(c => c.id === id ? { ...c, ...updates } : c);
    set({ contents });
    persist(STORAGE_KEYS.contents, contents);
  },
  deleteContent: (id) => {
    const contents = get().contents.filter(c => c.id !== id);
    set({ contents });
    persist(STORAGE_KEYS.contents, contents);
  },

  // ========== 待办 ==========
  toggleTodo: (id) => {
    const todos = get().todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    set({ todos });
    persist(STORAGE_KEYS.todos, todos);
  },
  addTodo: (todo) => {
    const todos = [...get().todos, { ...todo, id: genId() }];
    set({ todos });
    persist(STORAGE_KEYS.todos, todos);
  },
  deleteTodo: (id) => {
    const todos = get().todos.filter(t => t.id !== id);
    set({ todos });
    persist(STORAGE_KEYS.todos, todos);
  },

  // ========== 导出导入 ==========
  exportAll: () => {
    const state = get();
    return exportAllData({
      orders: state.orders,
      salesOrders: state.salesOrders,
      customers: state.customers,
      purchases: state.purchases,
      financeRecords: state.financeRecords,
      production: state.production,
      deliveries: state.deliveries,
      contents: state.contents,
      todos: state.todos,
    });
  },

  importAll: (json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.data) return false;
      const d = parsed.data;
      set({
        orders: d.orders || [],
        salesOrders: d.salesOrders || [],
        customers: d.customers || [],
        purchases: d.purchases || [],
        financeRecords: d.financeRecords || [],
        production: d.production || [],
        deliveries: d.deliveries || [],
        contents: d.contents || [],
        todos: d.todos || [],
      });
      // 持久化所有数据
      const state = get();
      persist(STORAGE_KEYS.orders, state.orders);
      persist(STORAGE_KEYS.salesOrders, state.salesOrders);
      persist(STORAGE_KEYS.customers, state.customers);
      persist(STORAGE_KEYS.purchases, state.purchases);
      persist(STORAGE_KEYS.financeRecords, state.financeRecords);
      persist(STORAGE_KEYS.production, state.production);
      persist(STORAGE_KEYS.deliveries, state.deliveries);
      persist(STORAGE_KEYS.contents, state.contents);
      persist(STORAGE_KEYS.todos, state.todos);
      return true;
    } catch {
      return false;
    }
  },

  resetToMock: () => {
    set({
      orders: mockOrders,
      salesOrders: mockSalesOrders,
      customers: mockCustomers,
      purchases: mockPurchases,
      financeRecords: mockFinanceRecords,
      production: mockProduction,
      deliveries: mockDeliveries,
      contents: mockContents,
      todos: mockTodos,
    });
    const state = get();
    persist(STORAGE_KEYS.orders, state.orders);
    persist(STORAGE_KEYS.salesOrders, state.salesOrders);
    persist(STORAGE_KEYS.customers, state.customers);
    persist(STORAGE_KEYS.purchases, state.purchases);
    persist(STORAGE_KEYS.financeRecords, state.financeRecords);
    persist(STORAGE_KEYS.production, state.production);
    persist(STORAGE_KEYS.deliveries, state.deliveries);
    persist(STORAGE_KEYS.contents, state.contents);
    persist(STORAGE_KEYS.todos, state.todos);
  },
}));
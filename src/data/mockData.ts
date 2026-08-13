import type { Order, Purchase, Customer, Content, FinanceRecord, Todo, Production, Delivery, SalesOrder } from '../types';

// 所有 mock 数据清空为空数组，用户从零开始添加自己的数据
export const mockOrders: Order[] = [];
export const mockPurchases: Purchase[] = [];
export const mockCustomers: Customer[] = [];
export const mockContents: Content[] = [];
export const mockFinanceRecords: FinanceRecord[] = [];
export const mockTodos: Todo[] = [];
export const mockProduction: Production[] = [];
export const mockDeliveries: Delivery[] = [];
export const mockSalesOrders: SalesOrder[] = [];

export const salesTrendData: { date: string; sales: number; orders: number }[] = [];
export const productDistribution: { name: string; value: number; color: string }[] = [];
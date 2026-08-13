import type { Order, Purchase, Customer, Content, FinanceRecord, Todo, Production, Delivery, SalesOrder } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'YW20260708001',
    customerId: '1',
    customerName: '陈记火锅店',
    products: [
      { name: '手工鱼丸', quantity: 20, unit: '斤', price: 25 },
      { name: '虾丸', quantity: 10, unit: '斤', price: 35 }
    ],
    totalAmount: 850,
    status: 'pending',
    orderDate: '2026-07-08',
    deliveryDate: '2026-07-09',
    address: '城南路128号',
    phone: '138****5678',
    remark: '早上8点前送到',
    source: 'wechat'
  },
  {
    id: '2',
    orderNo: 'YW20260708002',
    customerId: '2',
    customerName: '李大姐麻辣烫',
    products: [
      { name: '鱼豆腐', quantity: 15, unit: '斤', price: 22 }
    ],
    totalAmount: 330,
    status: 'producing',
    orderDate: '2026-07-08',
    deliveryDate: '2026-07-08',
    address: '美食街36号',
    phone: '139****1234',
    source: 'phone'
  },
  {
    id: '3',
    orderNo: 'YW20260708003',
    customerId: '3',
    customerName: '王老板（快递）',
    products: [
      { name: '精品鱼丸礼盒', quantity: 5, unit: '盒', price: 88 }
    ],
    totalAmount: 440,
    status: 'shipping',
    orderDate: '2026-07-07',
    address: '广东省深圳市南山区科技园',
    phone: '137****9876',
    source: 'wechat'
  },
  {
    id: '4',
    orderNo: 'YW20260708004',
    customerId: '4',
    customerName: '张记餐馆',
    products: [
      { name: '手工鱼丸', quantity: 30, unit: '斤', price: 25 },
      { name: '墨鱼丸', quantity: 10, unit: '斤', price: 38 }
    ],
    totalAmount: 1130,
    status: 'delivered',
    orderDate: '2026-07-07',
    deliveryDate: '2026-07-07',
    source: 'offline'
  },
  {
    id: '5',
    orderNo: 'YW20260708005',
    customerId: '5',
    customerName: '刘女士（散客）',
    products: [
      { name: '鱼丸', quantity: 2, unit: '斤', price: 28 }
    ],
    totalAmount: 56,
    status: 'confirmed',
    orderDate: '2026-07-08',
    source: 'wechat'
  },
  {
    id: '6',
    orderNo: 'YW20260708006',
    customerId: '6',
    customerName: '海鲜大排档',
    products: [
      { name: '鱼丸', quantity: 25, unit: '斤', price: 23 },
      { name: '虾丸', quantity: 15, unit: '斤', price: 33 }
    ],
    totalAmount: 1070,
    status: 'pending',
    orderDate: '2026-07-08',
    deliveryDate: '2026-07-09',
    source: 'phone'
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    materialName: '新鲜草鱼',
    quantity: 100,
    unit: '斤',
    unitPrice: 8,
    totalPrice: 800,
    supplierId: 's1',
    supplierName: '老王水产',
    purchaseDate: '2026-07-08',
    status: 'planned',
    remark: '需要鲜活的'
  },
  {
    id: '2',
    materialName: '鲜虾',
    quantity: 30,
    unit: '斤',
    unitPrice: 28,
    totalPrice: 840,
    supplierId: 's2',
    supplierName: '海鲜批发市场',
    purchaseDate: '2026-07-08',
    status: 'purchased'
  },
  {
    id: '3',
    materialName: '淀粉',
    quantity: 50,
    unit: '斤',
    unitPrice: 4,
    totalPrice: 200,
    supplierId: 's3',
    supplierName: '粮油店',
    purchaseDate: '2026-07-07',
    status: 'received'
  },
  {
    id: '4',
    materialName: '包装盒',
    quantity: 200,
    unit: '个',
    unitPrice: 1.5,
    totalPrice: 300,
    supplierId: 's4',
    supplierName: '包装材料店',
    purchaseDate: '2026-07-07',
    status: 'received'
  },
  {
    id: '5',
    materialName: '墨鱼',
    quantity: 20,
    unit: '斤',
    unitPrice: 25,
    totalPrice: 500,
    supplierId: 's2',
    supplierName: '海鲜批发市场',
    purchaseDate: '2026-07-08',
    status: 'planned'
  }
];

export const mockCustomers: Customer[] = [
  { id: '1', name: '陈记火锅店', phone: '138****5678', address: '城南路128号', tags: ['火锅店', '老客户', '周结'], level: 'vip', totalOrders: 48, totalAmount: 28600, totalSpent: 28600, lastOrderDate: '2026-07-08' },
  { id: '2', name: '李大姐麻辣烫', phone: '139****1234', address: '美食街36号', tags: ['麻辣烫', '日配'], level: 'vip', totalOrders: 86, totalAmount: 15200, totalSpent: 15200, lastOrderDate: '2026-07-08' },
  { id: '3', name: '王老板（快递）', phone: '137****9876', tags: ['线上', '快递'], level: 'new', totalOrders: 12, totalAmount: 4800, totalSpent: 4800, lastOrderDate: '2026-07-07' },
  { id: '4', name: '张记餐馆', phone: '136****5432', address: '东风路88号', tags: ['餐馆', '老客户'], level: 'vip', totalOrders: 120, totalAmount: 58000, totalSpent: 58000, lastOrderDate: '2026-07-07' },
  { id: '5', name: '刘女士（散客）', phone: '135****8765', tags: ['散客'], level: 'new', totalOrders: 3, totalAmount: 280, totalSpent: 280, lastOrderDate: '2026-07-08' },
  { id: '6', name: '海鲜大排档', phone: '134****4321', address: '滨江路夜宵城', tags: ['大排档', '夜宵'], level: 'regular', totalOrders: 35, totalAmount: 32000, totalSpent: 32000, lastOrderDate: '2026-07-08' },
  { id: '7', name: '赵老师（团购）', phone: '133****7654', tags: ['团购', '熟客'], level: 'regular', totalOrders: 8, totalAmount: 2400, totalSpent: 2400, lastOrderDate: '2026-07-01' },
  { id: '8', name: '孙记面馆', phone: '132****6543', address: '老城区西街', tags: ['面馆'], level: 'regular', totalOrders: 22, totalAmount: 5500, totalSpent: 5500, lastOrderDate: '2026-07-05' }
];

export const mockContents: Content[] = [
  {
    id: '1',
    title: '手工鱼丸是怎么做出来的？从打鱼到成型全过程',
    topic: '制作过程',
    platform: 'douyin',
    status: 'published',
    publishDate: '2026-07-06',
    views: 125000,
    likes: 8600,
    comments: 520,
    coverColor: '#E85D3C'
  },
  {
    id: '2',
    title: '为什么我们家鱼丸Q弹不碎？秘诀在这里',
    topic: '品质展示',
    platform: 'douyin',
    status: 'published',
    publishDate: '2026-07-05',
    views: 89000,
    likes: 6200,
    comments: 380,
    coverColor: '#5B8C5A'
  },
  {
    id: '3',
    title: '凌晨3点的鱼丸作坊，带你们看看真实的小工厂',
    topic: '幕后故事',
    platform: 'xiaohongshu',
    status: 'editing',
    coverColor: '#F5A623'
  },
  {
    id: '4',
    title: '鱼丸的N种吃法！火锅、煮汤、煎炸都好吃',
    topic: '美食教程',
    platform: 'shipinhao',
    status: 'scripting',
    coverColor: '#3B82F6'
  },
  {
    id: '5',
    title: '做鱼丸20年，说说这行的不容易',
    topic: '个人故事',
    platform: 'douyin',
    status: 'idea',
    coverColor: '#8B5CF6'
  },
  {
    id: '6',
    title: '怎么辨别好鱼丸和差鱼丸？老板教你三招',
    topic: '干货知识',
    platform: 'douyin',
    status: 'filming',
    coverColor: '#EC4899'
  },
  {
    id: '7',
    title: '今天给老客户送货，顺路拍个视频',
    topic: '日常',
    platform: 'shipinhao',
    status: 'published',
    publishDate: '2026-07-07',
    views: 15000,
    likes: 1200,
    comments: 86,
    coverColor: '#14B8A6'
  },
  {
    id: '8',
    title: '虾丸和鱼丸有什么区别？对比给你看',
    topic: '产品对比',
    platform: 'xiaohongshu',
    status: 'idea',
    coverColor: '#F97316'
  }
];

export const mockFinanceRecords: FinanceRecord[] = [
  { id: '1', type: 'income', category: '鱼丸销售', amount: 850, date: '2026-07-08', description: '陈记火锅店货款', paymentMethod: 'wechat' },
  { id: '2', type: 'income', category: '鱼丸销售', amount: 330, date: '2026-07-08', description: '李大姐麻辣烫', paymentMethod: 'cash' },
  { id: '3', type: 'expense', category: '原材料', amount: 840, date: '2026-07-08', description: '购买鲜虾30斤', paymentMethod: 'wechat' },
  { id: '4', type: 'expense', category: '快递费', amount: 35, date: '2026-07-07', description: '发往深圳快递', paymentMethod: 'alipay' },
  { id: '5', type: 'income', category: '鱼丸销售', amount: 1130, date: '2026-07-07', description: '张记餐馆货款', paymentMethod: 'bank' },
  { id: '6', type: 'expense', category: '原材料', amount: 200, date: '2026-07-07', description: '淀粉50斤', paymentMethod: 'cash' },
  { id: '7', type: 'expense', category: '包装材料', amount: 300, date: '2026-07-07', description: '包装盒200个', paymentMethod: 'wechat' },
  { id: '8', type: 'income', category: '礼盒销售', amount: 440, date: '2026-07-07', description: '王老板礼盒订单', paymentMethod: 'wechat' },
  { id: '9', type: 'expense', category: '水电煤气', amount: 180, date: '2026-07-06', description: '作坊水电费', paymentMethod: 'bank' },
  { id: '10', type: 'income', category: '零售', amount: 256, date: '2026-07-06', description: '门店零散销售', paymentMethod: 'cash' }
];

export const mockTodos: Todo[] = [
  { id: '1', content: '给陈记火锅店备货（鱼丸20斤+虾丸10斤）', priority: 'high', completed: false },
  { id: '2', content: '购买100斤新鲜草鱼', priority: 'high', completed: false, isAI: true },
  { id: '3', content: '王老板快递已发出，跟踪物流', priority: 'medium', completed: false },
  { id: '4', content: '拍摄"鱼丸做法"视频', priority: 'medium', completed: false },
  { id: '5', content: '赵老师团购客户1周未下单，建议回访', priority: 'low', completed: false, isAI: true },
  { id: '6', content: '核对本周账目', priority: 'medium', completed: true },
  { id: '7', content: '给海鲜大排档送货', priority: 'high', completed: false },
  { id: '8', content: '淀粉库存不足，请及时补货', priority: 'medium', completed: false, isAI: true }
];

export const mockProduction: Production[] = [
  { id: '1', date: '2026-07-08', productName: '手工鱼丸', quantity: 80, unit: '斤', goodRate: 98 },
  { id: '2', date: '2026-07-08', productName: '虾丸', quantity: 30, unit: '斤', goodRate: 96 },
  { id: '3', date: '2026-07-07', productName: '手工鱼丸', quantity: 100, unit: '斤', goodRate: 97 },
  { id: '4', date: '2026-07-07', productName: '墨鱼丸', quantity: 25, unit: '斤', goodRate: 95 },
  { id: '5', date: '2026-07-06', productName: '鱼豆腐', quantity: 50, unit: '斤', goodRate: 99 },
  { id: '6', date: '2026-07-06', productName: '手工鱼丸', quantity: 90, unit: '斤', goodRate: 98 }
];

export const mockDeliveries: Delivery[] = [
  { id: '1', orderId: '3', trackingNo: 'SF1234567890', customerName: '王老板', company: '顺丰速运', status: 'transit', shipDate: '2026-07-07' },
  { id: '2', orderId: '6', trackingNo: '', customerName: '海鲜大排档', company: '自配送', status: 'waiting', shipDate: '' },
  { id: '3', orderId: '1', trackingNo: '', customerName: '陈记火锅店', company: '自配送', status: 'waiting', shipDate: '' }
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 's1',
    orderNo: 'XS20260708001',
    customerId: '1',
    customerName: '陈记火锅店',
    customerPhone: '138****5678',
    products: [
      { id: 'p1', name: '手工鱼丸', quantity: 20, unit: '斤', unitPrice: 25, totalPrice: 500 },
      { id: 'p2', name: '虾丸', quantity: 10, unit: '斤', unitPrice: 35, totalPrice: 350 }
    ],
    totalAmount: 850,
    paidAmount: 850,
    paymentStatus: 'paid',
    paymentMethod: 'wechat',
    status: 'delivered',
    salesDate: '2026-07-08',
    deliveryDate: '2026-07-09',
    address: '城南路128号',
    salesperson: '老板',
    remark: '早上8点前送到，周结客户'
  },
  {
    id: 's2',
    orderNo: 'XS20260708002',
    customerId: '2',
    customerName: '李大姐麻辣烫',
    customerPhone: '139****1234',
    products: [
      { id: 'p3', name: '鱼豆腐', quantity: 15, unit: '斤', unitPrice: 22, totalPrice: 330 }
    ],
    totalAmount: 330,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    status: 'confirmed',
    salesDate: '2026-07-08',
    deliveryDate: '2026-07-08',
    address: '美食街36号',
    salesperson: '老板',
    remark: '日配客户，月底统一结算'
  },
  {
    id: 's3',
    orderNo: 'XS20260708003',
    customerId: '3',
    customerName: '王老板（快递）',
    customerPhone: '137****9876',
    products: [
      { id: 'p4', name: '精品鱼丸礼盒', quantity: 5, unit: '盒', unitPrice: 88, totalPrice: 440 }
    ],
    totalAmount: 440,
    paidAmount: 440,
    paymentStatus: 'paid',
    paymentMethod: 'wechat',
    status: 'delivered',
    salesDate: '2026-07-07',
    deliveryDate: '2026-07-08',
    address: '广东省深圳市南山区科技园',
    salesperson: '老板',
    remark: '顺丰快递发出'
  },
  {
    id: 's4',
    orderNo: 'XS20260707004',
    customerId: '4',
    customerName: '张记餐馆',
    customerPhone: '136****5432',
    products: [
      { id: 'p5', name: '手工鱼丸', quantity: 30, unit: '斤', unitPrice: 25, totalPrice: 750 },
      { id: 'p6', name: '墨鱼丸', quantity: 10, unit: '斤', unitPrice: 38, totalPrice: 380 }
    ],
    totalAmount: 1130,
    paidAmount: 500,
    paymentStatus: 'partial',
    paymentMethod: 'bank',
    status: 'delivered',
    salesDate: '2026-07-07',
    deliveryDate: '2026-07-07',
    address: '东风路88号',
    salesperson: '老板',
    remark: '已付500，余款630月底结'
  },
  {
    id: 's5',
    orderNo: 'XS20260708005',
    customerId: '5',
    customerName: '刘女士（散客）',
    customerPhone: '135****8765',
    products: [
      { id: 'p7', name: '鱼丸', quantity: 2, unit: '斤', unitPrice: 28, totalPrice: 56 }
    ],
    totalAmount: 56,
    paidAmount: 56,
    paymentStatus: 'paid',
    paymentMethod: 'wechat',
    status: 'delivered',
    salesDate: '2026-07-08',
    salesperson: '老板',
  },
  {
    id: 's6',
    orderNo: 'XS20260708006',
    customerId: '6',
    customerName: '海鲜大排档',
    customerPhone: '134****4321',
    products: [
      { id: 'p8', name: '鱼丸', quantity: 25, unit: '斤', unitPrice: 23, totalPrice: 575 },
      { id: 'p9', name: '虾丸', quantity: 15, unit: '斤', unitPrice: 33, totalPrice: 495 }
    ],
    totalAmount: 1070,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    status: 'draft',
    salesDate: '2026-07-08',
    deliveryDate: '2026-07-09',
    address: '滨江路夜宵城',
    salesperson: '老板',
    remark: '新客户，需确认后发货'
  },
  {
    id: 's7',
    orderNo: 'XS20260706007',
    customerId: '7',
    customerName: '赵老师（团购）',
    customerPhone: '133****7654',
    products: [
      { id: 'p10', name: '手工鱼丸', quantity: 10, unit: '斤', unitPrice: 24, totalPrice: 240 },
      { id: 'p11', name: '鱼豆腐', quantity: 10, unit: '斤', unitPrice: 20, totalPrice: 200 },
      { id: 'p12', name: '虾丸', quantity: 5, unit: '斤', unitPrice: 32, totalPrice: 160 }
    ],
    totalAmount: 600,
    paidAmount: 600,
    paymentStatus: 'paid',
    paymentMethod: 'alipay',
    status: 'delivered',
    salesDate: '2026-07-06',
    deliveryDate: '2026-07-07',
    address: '阳光小区3栋',
    salesperson: '小李',
    remark: '团购优惠价，自提'
  },
  {
    id: 's8',
    orderNo: 'XS20260705008',
    customerId: '8',
    customerName: '孙记面馆',
    customerPhone: '132****6543',
    products: [
      { id: 'p13', name: '鱼丸', quantity: 8, unit: '斤', unitPrice: 25, totalPrice: 200 }
    ],
    totalAmount: 200,
    paidAmount: 200,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    status: 'delivered',
    salesDate: '2026-07-05',
    salesperson: '老板',
    remark: '老客户，每周固定量'
  }
];

export const salesTrendData = [
  { date: '7/1', sales: 2800, orders: 8 },
  { date: '7/2', sales: 3200, orders: 10 },
  { date: '7/3', sales: 2500, orders: 7 },
  { date: '7/4', sales: 3800, orders: 12 },
  { date: '7/5', sales: 4200, orders: 14 },
  { date: '7/6', sales: 3500, orders: 11 },
  { date: '7/7', sales: 4500, orders: 13 },
  { date: '7/8', sales: 2400, orders: 6 }
];

export const productDistribution = [
  { name: '手工鱼丸', value: 45, color: '#E85D3C' },
  { name: '虾丸', value: 25, color: '#F5A623' },
  { name: '墨鱼丸', value: 15, color: '#5B8C5A' },
  { name: '鱼豆腐', value: 10, color: '#3B82F6' },
  { name: '其他', value: 5, color: '#8B5CF6' }
];

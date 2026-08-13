const STORAGE_PREFIX = 'fishball_workbench_';
const STORAGE_VERSION = 2;
const VERSION_KEY = `${STORAGE_PREFIX}version`;

// 存储键名
export const STORAGE_KEYS = {
  orders: `${STORAGE_PREFIX}orders`,
  salesOrders: `${STORAGE_PREFIX}salesOrders`,
  customers: `${STORAGE_PREFIX}customers`,
  purchases: `${STORAGE_PREFIX}purchases`,
  financeRecords: `${STORAGE_PREFIX}financeRecords`,
  production: `${STORAGE_PREFIX}production`,
  deliveries: `${STORAGE_PREFIX}deliveries`,
  contents: `${STORAGE_PREFIX}contents`,
  todos: `${STORAGE_PREFIX}todos`,
  backupConfig: `${STORAGE_PREFIX}backupConfig`,
} as const;

function getStorageVersion(): number {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

function setStorageVersion(version: number): void {
  try {
    localStorage.setItem(VERSION_KEY, String(version));
  } catch {
    // 存储不可用
  }
}

/**
 * 初始化存储，版本迁移逻辑
 */
export function initStorage(): void {
  const currentVersion = getStorageVersion();
  if (currentVersion < STORAGE_VERSION) {
    // 版本升级：清除所有旧数据，让用户从零开始
    if (currentVersion < 2) {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        }
      } catch { /* ignore */ }
    }
    setStorageVersion(STORAGE_VERSION);
  }
}

/**
 * 从 localStorage 读取数据
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * 保存数据到 localStorage
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn(`[Storage] 保存 ${key} 失败:`, e);
    return false;
  }
}

/**
 * 删除存储项
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * 导出所有数据为 JSON 对象
 */
export function exportAllData(dataMap: Record<string, unknown>): string {
  const exportData = {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    data: dataMap,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * 导入 JSON 数据
 */
export function importAllData(json: string): { version: number; exportedAt: string; data: Record<string, unknown> } | null {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.data || typeof parsed.data !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * 获取存储使用情况
 */
export function getStorageUsage(): { used: number; total: number; percent: number } {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) used += key.length + value.length;
      }
    }
    // 估算总量 5MB
    const total = 5 * 1024 * 1024;
    return {
      used,
      total,
      percent: Math.round((used / total) * 100),
    };
  } catch {
    return { used: 0, total: 5 * 1024 * 1024, percent: 0 };
  }
}

/**
 * 检查 localStorage 是否可用
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = `${STORAGE_PREFIX}test`;
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
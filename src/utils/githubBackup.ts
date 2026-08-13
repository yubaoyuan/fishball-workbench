import { STORAGE_KEYS, loadFromStorage, saveToStorage } from './storage';

const BACKUP_CONFIG_KEY = STORAGE_KEYS.backupConfig;

export interface BackupConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  autoBackup: boolean;
  intervalMinutes: number;
  lastBackupAt: string | null;
}

const DEFAULT_CONFIG: BackupConfig = {
  token: '',
  owner: '',
  repo: '',
  branch: 'main',
  autoBackup: false,
  intervalMinutes: 1440, // 每天一次
  lastBackupAt: null,
};

export function getBackupConfig(): BackupConfig {
  return loadFromStorage(BACKUP_CONFIG_KEY, DEFAULT_CONFIG);
}

export function saveBackupConfig(config: Partial<BackupConfig>): BackupConfig {
  const current = getBackupConfig();
  const updated = { ...current, ...config };
  saveToStorage(BACKUP_CONFIG_KEY, updated);
  return updated;
}

/**
 * 上传备份到 GitHub
 */
export async function pushToGitHub(config: BackupConfig, jsonData: string): Promise<{ success: boolean; message: string }> {
  if (!config.token || !config.owner || !config.repo) {
    return { success: false, message: '请先配置 GitHub 仓库信息（Token、用户名、仓库名）' };
  }

  const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const path = `backups/${filename}`;
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;

  try {
    // 将数据编码为 base64
    const content = btoa(unescape(encodeURIComponent(jsonData)));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `备份: ${new Date().toLocaleString('zh-CN')}`,
        content,
        branch: config.branch,
      }),
    });

    if (response.ok) {
      const updatedConfig = saveBackupConfig({ lastBackupAt: new Date().toISOString() });
      // 同时更新 latest.json
      await updateLatestBackup(config, jsonData);
      return { success: true, message: `备份成功！文件: ${filename}` };
    } else if (response.status === 401) {
      return { success: false, message: 'GitHub Token 无效，请检查配置' };
    } else if (response.status === 404) {
      return { success: false, message: '仓库不存在，请检查仓库名称' };
    } else {
      const err = await response.json().catch(() => ({}));
      return { success: false, message: `上传失败: ${(err as { message?: string }).message || response.statusText}` };
    }
  } catch (e) {
    return { success: false, message: `网络错误: ${e instanceof Error ? e.message : '未知错误'}` };
  }
}

/**
 * 更新 latest.json
 */
async function updateLatestBackup(config: BackupConfig, jsonData: string): Promise<void> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/backups/latest.json`;
  const content = btoa(unescape(encodeURIComponent(jsonData)));

  try {
    // 先获取现有文件 sha
    const getResp = await fetch(url, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    const existing = await getResp.json().catch(() => ({}));
    const sha = (existing as { sha?: string }).sha;

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `更新最新备份: ${new Date().toLocaleString('zh-CN')}`,
        content,
        sha: sha || undefined,
        branch: config.branch,
      }),
    });
  } catch {
    // 忽略 latest.json 更新失败
  }
}

/**
 * 从 GitHub 拉取备份列表
 */
export async function listBackups(config: BackupConfig): Promise<{ success: boolean; files: string[]; message: string }> {
  if (!config.token || !config.owner || !config.repo) {
    return { success: false, files: [], message: '请先配置 GitHub 仓库信息' };
  }

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/backups?ref=${config.branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { name: string }[];
      const files = data
        .filter(f => f.name.endsWith('.json') && f.name !== 'latest.json')
        .map(f => f.name)
        .sort()
        .reverse();
      return { success: true, files, message: '' };
    } else {
      return { success: false, files: [], message: '获取备份列表失败' };
    }
  } catch {
    return { success: false, files: [], message: '网络错误' };
  }
}

/**
 * 从 GitHub 下载指定备份
 */
export async function downloadBackup(config: BackupConfig, filename: string): Promise<{ success: boolean; data: string; message: string }> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/backups/${filename}?ref=${config.branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { content: string };
      const decoded = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
      return { success: true, data: decoded, message: '下载成功' };
    } else {
      return { success: false, data: '', message: '下载失败' };
    }
  } catch {
    return { success: false, data: '', message: '网络错误' };
  }
}

/**
 * 验证 GitHub Token
 */
export async function verifyToken(token: string): Promise<{ valid: boolean; user: string }> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (response.ok) {
      const data = (await response.json()) as { login: string };
      return { valid: true, user: data.login };
    }
    return { valid: false, user: '' };
  } catch {
    return { valid: false, user: '' };
  }
}
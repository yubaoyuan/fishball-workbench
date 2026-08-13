import { useState, useEffect, useRef } from 'react';
import {
  Cloud, Upload, Download, Database, Settings, Key, Github, CheckCircle, XCircle,
  AlertTriangle, Clock, RefreshCw, HardDrive, FileJson, Trash2, RotateCcw,
  Save, FileDown, FolderOpen, Shield, Info
} from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { useDataStore } from '../store/useDataStore';
import { getBackupConfig, saveBackupConfig, pushToGitHub, listBackups, downloadBackup, verifyToken, type BackupConfig } from '../utils/githubBackup';
import { getStorageUsage } from '../utils/storage';
import { clsx } from 'clsx';

export default function Backup() {
  const { exportAll, importAll, resetToMock } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<BackupConfig>(getBackupConfig());
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [storageUsage, setStorageUsage] = useState(getStorageUsage());
  const [backupList, setBackupList] = useState<string[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setStorageUsage(getStorageUsage());
  }, []);

  // 验证 Token
  const handleVerifyToken = async () => {
    if (!config.token) return;
    setVerifying(true);
    const result = await verifyToken(config.token);
    setTokenValid(result.valid);
    setStatus({
      type: result.valid ? 'success' : 'error',
      message: result.valid ? `Token 有效，用户: ${result.user}` : 'Token 无效，请检查',
    });
    setVerifying(false);
  };

  // 保存配置
  const handleSaveConfig = () => {
    saveBackupConfig(config);
    setStatus({ type: 'success', message: '配置已保存' });
    setShowConfig(false);
  };

  // 备份到 GitHub
  const handleBackup = async () => {
    setLoading(true);
    setStatus(null);
    const data = exportAll();
    const result = await pushToGitHub(config, data);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    setLoading(false);
    setStorageUsage(getStorageUsage());
  };

  // 获取备份列表
  const handleListBackups = async () => {
    setLoading(true);
    const result = await listBackups(config);
    if (result.success) {
      setBackupList(result.files);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  // 恢复备份
  const handleRestore = async (filename: string) => {
    if (!window.confirm(`确定要从 GitHub 恢复备份 "${filename}" 吗？当前数据将被覆盖。`)) return;
    setLoading(true);
    const result = await downloadBackup(config, filename);
    if (result.success) {
      const ok = importAll(result.data);
      setStatus({
        type: ok ? 'success' : 'error',
        message: ok ? '恢复成功！数据已更新' : '恢复失败：数据格式不正确',
      });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  // 导出 JSON
  const handleExport = () => {
    const data = exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fishball_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: 'success', message: '导出成功！JSON 文件已下载' });
  };

  // 导入 JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importAll(ev.target?.result as string);
      setStatus({
        type: ok ? 'success' : 'error',
        message: ok ? '导入成功！数据已更新' : '导入失败：文件格式不正确',
      });
      setStorageUsage(getStorageUsage());
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 重置为演示数据
  const handleReset = () => {
    if (!window.confirm('确定要重置为演示数据吗？当前所有数据将被清空！')) return;
    resetToMock();
    setStatus({ type: 'info', message: '已重置为演示数据' });
    setStorageUsage(getStorageUsage());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据备份</h1>
          <p className="text-gray-500 mt-1">本地存储 + GitHub 云端备份，数据安全无忧</p>
        </div>
      </div>

      {/* 状态提示 */}
      {status && (
        <div className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        )}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
           status.type === 'error' ? <XCircle className="w-5 h-5" /> :
           <Info className="w-5 h-5" />}
          {status.message}
          <button onClick={() => setStatus(null)} className="ml-auto text-current opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* 存储状态 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">本地存储</p>
              <p className="text-lg font-bold text-gray-800">
                {(storageUsage.used / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="mt-3 bg-gray-100 rounded-full h-2">
            <div
              className={clsx(
                'h-2 rounded-full transition-all',
                storageUsage.percent > 80 ? 'bg-red-500' :
                storageUsage.percent > 50 ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${Math.min(storageUsage.percent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">已用 {storageUsage.percent}% / 5MB</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Github className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">GitHub 备份</p>
              <p className="text-lg font-bold text-gray-800">
                {config.lastBackupAt
                  ? `上次: ${new Date(config.lastBackupAt).toLocaleDateString('zh-CN')}`
                  : '未配置'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Tag variant={tokenValid ? 'success' : 'warning'} size="sm">
              {tokenValid ? 'Token 有效' : 'Token 未验证'}
            </Tag>
            <Tag variant={config.autoBackup ? 'success' : 'info'} size="sm">
              {config.autoBackup ? '自动备份' : '手动备份'}
            </Tag>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">数据统计</p>
              <p className="text-lg font-bold text-gray-800">
                {useDataStore.getState().orders.length + useDataStore.getState().salesOrders.length} 条记录
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            订单 {useDataStore.getState().orders.length} · 销售单 {useDataStore.getState().salesOrders.length} · 客户 {useDataStore.getState().customers.length}
          </p>
        </Card>
      </div>

      {/* 本地备份 */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-primary-500" />
          本地备份
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            导出 JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            导入 JSON
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置演示数据
          </button>
        </div>
      </Card>

      {/* GitHub 备份 */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-purple-500" />
            GitHub 云端备份
          </h3>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-warm-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            配置
          </button>
        </div>

        {/* 配置面板 */}
        {showConfig && (
          <div className="mb-4 p-4 bg-warm-50 rounded-xl space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
                <Key className="w-4 h-4" /> GitHub Token
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={config.token}
                  onChange={e => setConfig({ ...config, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="flex-1 px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                />
                <button
                  onClick={handleVerifyToken}
                  disabled={verifying || !config.token}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm hover:bg-warm-100 disabled:opacity-50"
                >
                  {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  验证
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">
                  创建 Token
                </a>
                ，需要勾选 repo 权限
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">用户名</label>
                <input
                  type="text"
                  value={config.owner}
                  onChange={e => setConfig({ ...config, owner: e.target.value })}
                  placeholder="GitHub 用户名"
                  className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">仓库名</label>
                <input
                  type="text"
                  value={config.repo}
                  onChange={e => setConfig({ ...config, repo: e.target.value })}
                  placeholder="仓库名称"
                  className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoBackup}
                  onChange={e => setConfig({ ...config, autoBackup: e.target.checked })}
                  className="rounded"
                />
                自动备份（浏览器打开时）
              </label>
              <button
                onClick={handleSaveConfig}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>
        )}

        {/* 备份操作 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBackup}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            备份到 GitHub
          </button>
          <button
            onClick={handleListBackups}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            查看云端备份
          </button>
        </div>

        {/* 备份列表 */}
        {backupList.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">云端备份列表</h4>
            <div className="space-y-2">
              {backupList.slice(0, 10).map(file => (
                <div key={file} className="flex items-center justify-between p-3 bg-warm-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                  <button
                    onClick={() => handleRestore(file)}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    恢复
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 使用说明 */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          使用说明
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. <strong>本地存储</strong>：所有数据自动保存在浏览器 localStorage 中，关闭浏览器后数据不会丢失</p>
          <p>2. <strong>导出 JSON</strong>：将数据导出为 JSON 文件，可保存到电脑或U盘</p>
          <p>3. <strong>导入 JSON</strong>：从之前导出的 JSON 文件恢复数据</p>
          <p>4. <strong>GitHub 备份</strong>：需要创建 GitHub 仓库和 Token，将数据备份到云端</p>
          <p>5. <strong>创建 Token</strong>：访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)，勾选 repo 权限</p>
        </div>
      </Card>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fish, ArrowRight, Smartphone, KeyRound, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { clsx } from 'clsx';

export default function Login() {
  const { loginByPhone, users } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<'phone' | 'code' | 'register'>('phone');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // 发送验证码
  const handleSendCode = () => {
    if (!phone || phone.length < 11) {
      setStatus({ type: 'error', message: '请输入正确的手机号（11位）' });
      return;
    }
    setStep('code');
    setCountdown(60);
    setStatus({ type: 'success', message: '验证码已发送（演示码：123456）' });
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // 验证码验证
  const handleVerifyCode = () => {
    if (!code || code.length < 4) {
      setStatus({ type: 'error', message: '请输入验证码' });
      return;
    }
    if (code !== '123456') {
      setStatus({ type: 'error', message: '验证码错误，演示码为 123456' });
      return;
    }

    // 检查是否为新用户
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      // 老用户，直接登录
      setLoading(true);
      setTimeout(() => {
        loginByPhone(phone, '');
        navigate('/dashboard', { replace: true });
        setLoading(false);
      }, 500);
    } else {
      // 新用户，进入注册步骤
      setStep('register');
      setStatus({ type: 'info', message: '新用户，请填写姓名后进入' });
    }
  };

  // 新用户注册
  const handleRegister = () => {
    if (!displayName.trim()) {
      setStatus({ type: 'error', message: '请输入您的姓名' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginByPhone(phone, displayName.trim());
      navigate('/dashboard', { replace: true });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-warm-100 flex items-center justify-center p-4">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-warm-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl mb-4">
            <Fish className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">渔宝源鱼丸店</h1>
          <p className="text-gray-500 text-sm mt-1">AI智能工作台 · 多人协作版</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-warm-200">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              step === 'phone' ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-600'
            )}>
              <Smartphone className="w-3.5 h-3.5" />
              手机号
            </div>
            <div className="w-6 h-0.5 bg-warm-200" />
            <div className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              step === 'code' ? 'bg-primary-500 text-white' : 'bg-warm-100 text-gray-500'
            )}>
              <KeyRound className="w-3.5 h-3.5" />
              验证码
            </div>
            <div className="w-6 h-0.5 bg-warm-200" />
            <div className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              step === 'register' ? 'bg-primary-500 text-white' : 'bg-warm-100 text-gray-500'
            )}>
              <User className="w-3.5 h-3.5" />
              登录
            </div>
          </div>

          {/* ========== 步骤1：输入手机号 ========== */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-xl text-sm text-primary-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>输入手机号登录，新用户自动注册，管理员在后台设置权限</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="输入11位手机号"
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-lg font-medium focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                  autoFocus
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={!phone || phone.length < 11}
                className={clsx(
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
                  !phone || phone.length < 11
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg active:scale-[0.98]'
                )}
              >
                <KeyRound className="w-4 h-4" />
                获取验证码
              </button>
            </div>
          )}

          {/* ========== 步骤2：输入验证码 ========== */}
          {step === 'code' && (
            <div className="space-y-4">
              {/* 手机号回显 */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                验证码已发送至 <span className="font-medium text-gray-700">{phone}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  验证码
                  <span className="text-xs text-gray-400 font-normal ml-2">（演示码：123456）</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="输入6位验证码"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-center tracking-[0.5em] text-lg font-bold focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleVerifyCode()}
                  autoFocus
                />
                <div className="flex justify-between items-center mt-1.5">
                  <button
                    onClick={() => setStep('phone')}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    更换手机号
                  </button>
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className={clsx(
                      'text-xs transition-colors',
                      countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'
                    )}
                  >
                    {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={loading || !code || code.length < 4}
                className={clsx(
                  'w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                  loading || !code || code.length < 4
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg active:scale-[0.98]'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    验证并登录
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========== 步骤3：新用户注册 ========== */}
          {step === 'register' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-xl text-sm text-primary-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>手机号验证通过！首次登录请填写姓名，管理员后续会为您设置权限</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                {phone}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">您的姓名</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="例如：张三"
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-base focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  autoFocus
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading || !displayName.trim()}
                className={clsx(
                  'w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                  loading || !displayName.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg active:scale-[0.98]'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    进入工作台
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* 状态提示 */}
          {status && (
            <div className={clsx(
              'flex items-center gap-2 p-3 rounded-xl text-sm mt-4',
              status.type === 'success' ? 'bg-success-50 text-success-700' :
              status.type === 'error' ? 'bg-red-50 text-red-600' :
              'bg-primary-50 text-primary-700'
            )}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> :
               status.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> :
               <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {status.message}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          演示版验证码：123456 · 新用户自动注册，管理员在后台分配权限
        </p>
      </div>
    </div>
  );
}
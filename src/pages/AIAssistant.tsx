import { Sparkles, ExternalLink, ArrowRight, Bot, Zap, Send } from 'lucide-react';
import Card from '../components/ui/Card';

const quickActions = [
  { label: '今天该生产什么？', desc: 'AI分析订单后给出生产建议' },
  { label: '帮我写个鱼丸视频脚本', desc: '生成抖音/小红书短视频脚本' },
  { label: '上周营收分析', desc: '自动汇总财务数据' },
  { label: '给客户发回访消息', desc: '智能生成客户回访话术' },
  { label: '原材料还够吗？', desc: '库存预警和采购建议' },
  { label: '分析最近的销售趋势', desc: 'AI数据洞察' },
];

export default function AIAssistant() {
  const openTrae = () => {
    window.open('https://trae.ai', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">AI 智能助手</h1>
        <p className="text-gray-500 mt-2">由 TRAE 驱动，帮你管理鱼丸厂的方方面面</p>
      </div>

      {/* TRAE 连接卡片 */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">TRAE AI 助手</h2>
              <p className="text-white/80 text-sm mt-0.5">你现在就在跟 TRAE 对话！这个工作台的所有 AI 功能都由 TRAE 驱动。</p>
              <p className="text-white/60 text-xs mt-1">直接在这个对话窗口告诉 TRAE 你想做什么，比如"帮我分析今天的销售数据"、"给陈记火锅店写个催款消息"</p>
            </div>
          </div>
          <button
            onClick={openTrae}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            TRAE官网
          </button>
        </div>
      </Card>

      {/* 快捷指令 */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning-500" />
          常用快捷指令
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className="flex items-start gap-3 p-4 bg-warm-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Send className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 使用说明 */}
      <div className="mt-6 p-5 bg-warm-50 rounded-2xl border border-warm-200">
        <h3 className="font-semibold text-gray-800 mb-2">如何使用</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
            <span>在上面的快捷指令中点击你想做的事，或直接在对话中告诉 TRAE</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
            <span>TRAE 会分析你的数据（订单、财务、生产、客户等），给出智能建议</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
            <span>TRAE 可以直接帮你操作工作台，比如创建订单、写视频脚本、分析数据</span>
          </div>
        </div>
      </div>
    </div>
  );
}
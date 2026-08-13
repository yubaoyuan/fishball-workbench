import { useState } from 'react';
import { Send, Sparkles, Mic, Paperclip } from 'lucide-react';
import Card from '../components/ui/Card';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const quickActions = [
  '今天该生产什么？',
  '帮我写个鱼丸视频脚本',
  '上周营收分析',
  '给客户发回访消息',
  '原材料还够吗？',
  '今天的配送路线',
];

const presetResponses: Record<string, string> = {
  '今天该生产什么？': '根据您的订单情况，建议今天优先生产：\n\n1️⃣ 鳗鱼丸5斤 - 50斤（王记火锅店10点要货）\n2️⃣ 香菇贡丸3斤 - 30斤（陈记餐厅14点配送）\n3️⃣ 普通鱼丸10斤 - 100斤（多个散客订单）\n\n⚠️ 注意：鳗鱼丸原材料库存还有15斤，需采购新鲜鳗鱼。',
  '帮我写个鱼丸视频脚本': '好的，给您写一个"手工鱼丸制作过程"的短视频脚本：\n\n🎬 标题：《30年手艺！老师傅教你做Q弹鱼丸》\n\n⏰ 时长：60秒\n\n📝 分镜：\n0-3s: 开场 - 活鱼特写，"每天凌晨3点选鱼"\n3-15s: 取肉 - 手工刮鱼糜的过程\n15-30s: 打鱼浆 - 展示Q弹关键步骤\n30-45s: 挤丸下锅 - 鱼丸浮起的治愈画面\n45-55s: 成品展示 - 咬开爆汁特写\n55-60s: 引导互动 - "想吃的评论区扣1"\n\n需要我调整风格或时长吗？',
  '上周营收分析': '📊 上周（4/1-4/7）经营分析：\n\n💰 总收入：¥18,600（较上周+12%）\n💸 总支出：¥7,200\n📈 净利润：¥11,400\n\n🏆 畅销产品TOP3：\n1. 普通鱼丸10斤 - 32单\n2. 鳗鱼丸5斤 - 28单\n3. 香菇贡丸3斤 - 22单\n\n💡 AI建议：周日销量最高，建议周六多备货',
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: '您好老板！我是您的AI助手鱼小丸 🐟\n\n我可以帮您：\n• 分析订单和生产计划\n• 写视频脚本和文案\n• 管理财务和记账\n• 回复客户消息\n• 回答经营问题\n\n有什么需要帮忙的，随时问我！',
      time: '09:00',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    setTimeout(() => {
      const response = presetResponses[text] || `好的，我来帮您处理"${text}"这个问题。\n\n这是一个演示版本，接入真实AI模型后可以为您提供更智能的回答。目前您可以点击快捷问题体验功能。`;
      const newAiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newAiMessage]);
    }, 500);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            AI助手 鱼小丸
          </h1>
          <p className="text-gray-500 mt-1">您的智能经营伙伴，随时为您服务</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-64 flex-shrink-0">
          <Card className="p-4 h-full">
            <h3 className="font-semibold text-gray-800 mb-3">快捷指令</h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-warm-50 text-gray-700 text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs">🐟</div>
                      <span className="text-xs text-gray-400">鱼小丸</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl whitespace-pre-line ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-md'
                      : 'bg-warm-50 text-gray-800 rounded-tl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-warm-100">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-xl transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="输入您的问题..."
                  className="w-full px-4 py-3 bg-warm-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-warm-100 rounded-xl transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => sendMessage(input)}
                className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

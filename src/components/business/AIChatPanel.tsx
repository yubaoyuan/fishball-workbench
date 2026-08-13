import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, Sparkles, MessageCircle } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { clsx } from 'clsx';
import Card from '../ui/Card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  '今天有多少订单？',
  '帮我写个视频标题',
  '明天该进多少货？',
  '本周利润是多少？',
  '给客户写个回访话术',
];

const presetResponses: Record<string, string> = {
  '今天有多少订单？': '老板好！📊 今天共有6个订单：\n\n• 待处理：3单（陈记火锅店、海鲜大排档等）\n• 生产中：1单（李大姐麻辣烫）\n• 配送中：1单（王老板快递）\n• 已完成：1单\n\n今日预计营收：¥2,400+，还有2个待配送订单需要安排哦~',
  '帮我写个视频标题': '好的！给您几个爆款标题参考：\n\n1. 「做鱼丸20年，今天把祖传配方告诉你」🔥\n2. 「凌晨3点的鱼丸作坊，这才是真材实料！」\n3. 「为什么火锅店都爱用我们家鱼丸？看完你就懂了」\n4. 「100斤鱼出多少鱼丸？算给你看！」\n5. 「Q弹鱼丸的秘密，原来在于这一步…」\n\n需要我帮您写具体脚本吗？',
  '明天该进多少货？': '根据历史数据分析，建议明天采购：\n\n🐟 新鲜草鱼：120斤（订单增加，多备20斤）\n🦐 鲜虾：35斤（虾丸销量稳定上升）\n📦 包装盒：库存充足，不用买\n🥔 淀粉：库存不足，建议采购30斤\n\n预估采购金额：¥1,800左右',
  '本周利润是多少？': '📈 本周经营数据（7/1-7/8）：\n\n• 总营收：¥24,900\n• 原材料成本：¥12,500\n• 其他支出：¥2,200\n• 预计净利润：¥10,200\n• 利润率：41%\n\n比上周增长12%，继续保持！鱼丸销量最好，占45%。',
  '给客户写个回访话术': '给您准备了一个温馨回访话术：\n\n---\n张哥/李姐您好呀！我是做手工鱼丸的小王👋\n\n最近店里生意怎么样呀？上次您拿的鱼丸卖得还好吗？\n\n这两天天气热，跟您说个小技巧：鱼丸放冷藏保存口感最佳，吃不完可以分装冷冻哦~ 有任何问题随时找我！\n\n最近我们新做了一批虾丸，口感特别Q弹，老客户都反馈不错，您要是需要我明天顺路给您带点尝尝？😉\n---\n\n需要我帮您调整语气吗？',
};

export default function AIChatPanel() {
  const { aiPanelOpen, setAiPanelOpen, toggleAiPanel } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '老板好！我是您的AI小助手 🐟\n\n有什么可以帮您的？可以问我订单、记账、写文案、经营建议等。点击下面的快捷问题试试吧~',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = presetResponses[content] ||
        `好的老板，我来帮您处理"${content}"这个问题。\n\n（这是演示版本，接入真实AI后可以帮您处理更多事情哦~ 比如识别订单、自动记账、生成文案、分析数据等。）\n\n您现在可以继续问我其他问题，或者点击快捷按钮试试功能！`;

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <button
        onClick={toggleAiPanel}
        className={clsx(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-105',
          aiPanelOpen && 'opacity-0 pointer-events-none scale-0'
        )}
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </span>
      </button>

      <div
        className={clsx(
          'fixed bottom-6 right-6 w-[400px] z-50 transition-all duration-300 transform',
          aiPanelOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
      >
        <Card className="overflow-hidden flex flex-col h-[560px] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">渔宝源鱼丸店AI助手</h3>
                <p className="text-xs text-white/80">随时为您服务</p>
              </div>
            </div>
            <button
              onClick={() => setAiPanelOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                )}
                <div
                  className={clsx(
                    'max-w-[280px] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-warm-100 bg-white">
              <p className="text-xs text-gray-400 mb-2">快捷问题：</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action)}
                    className="px-3 py-1.5 text-xs bg-warm-50 text-gray-600 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 border-t border-warm-100 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="问我任何问题..."
                className="flex-1 px-3 py-2 bg-warm-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

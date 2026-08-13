import { useState } from 'react';
import {
  Fish, Anchor, Wrench, Package, Building2, Microscope, GraduationCap,
  Store, Truck, Globe, ShoppingCart, TrendingUp, Newspaper, BookOpen,
  ArrowRight, Lightbulb, ChevronRight, MapPin, BarChart3, Target,
  DollarSign, Briefcase, Zap, Thermometer, ShieldCheck, Users, Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { clsx } from 'clsx';

// 产业链数据
const industryChain = {
  upstream: {
    title: '上游 · 原料供应',
    icon: <Fish className="w-6 h-6" />,
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    items: [
      {
        title: '水产养殖/捕捞',
        desc: '鱼糜原料（鳗鱼、马鲛鱼、金线鱼等）的养殖与近海捕捞。涉及水产养殖技术、鱼苗选育、饲料配方、病害防治等。',
        careers: ['水产养殖技术员', '渔业捕捞船长', '养殖场管理', '饲料销售代表'],
        avgSalary: '5k-15k',
        demand: '高',
        trend: 'up',
        tags: ['水产养殖', '近海捕捞', '鱼苗培育'],
      },
      {
        title: '食品原料贸易',
        desc: '淀粉（木薯淀粉、马铃薯淀粉）、调味料、食品添加剂（磷酸盐、胶体等）的采购与贸易。',
        careers: ['原料采购经理', '食品添加剂销售', '供应链管理', '品控专员'],
        avgSalary: '6k-18k',
        demand: '高',
        trend: 'up',
        tags: ['淀粉', '调味料', '食品添加剂', '供应链'],
      },
      {
        title: '食品机械设备',
        desc: '鱼丸打浆机、成型机、蒸煮线、速冻隧道、真空包装机等加工设备的研发制造与销售。',
        careers: ['食品机械工程师', '设备销售经理', '售后技术工程师', '自动化工程师'],
        avgSalary: '8k-25k',
        demand: '中',
        trend: 'up',
        tags: ['打浆机', '成型机', '速冻设备', '包装机械'],
      },
      {
        title: '包装材料供应',
        desc: '食品级塑料袋、真空袋、泡沫箱、纸箱等冷链包装材料的生产与供应。',
        careers: ['包装材料销售', '包装设计师', '印刷技术员', '质量检测员'],
        avgSalary: '4k-12k',
        demand: '中',
        trend: 'stable',
        tags: ['食品包装', '冷链包装', '真空袋', '印刷'],
      },
    ]
  },
  midstream: {
    title: '中游 · 加工制造',
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-primary-500',
    bgLight: 'bg-primary-50',
    borderColor: 'border-primary-200',
    textColor: 'text-primary-700',
    items: [
      {
        title: '鱼丸加工制造',
        desc: '从原料解冻→绞肉→擂溃打浆→成型→凝胶化→蒸煮→冷却→速冻→包装的完整生产工艺。核心技术在于打浆工艺和配方调配。',
        careers: ['生产厂长', '打浆师傅', '生产线操作工', '生产管理', '品质控制'],
        avgSalary: '5k-30k',
        demand: '高',
        trend: 'up',
        tags: ['打浆工艺', '成型', '速冻', '配方研发'],
      },
      {
        title: '速冻食品技术',
        desc: 'IQF单冻技术、液氮速冻、冷链管理。速冻食品行业年增速超15%，是食品工业中增长最快的细分领域之一。',
        careers: ['制冷工程师', '速冻工艺师', '冷链管理师', '冷库运营'],
        avgSalary: '7k-20k',
        demand: '高',
        trend: 'up',
        tags: ['IQF速冻', '液氮技术', '冷链', '冷库管理'],
      },
      {
        title: '食品研发与创新',
        desc: '新产品开发（虾丸、墨鱼丸、芝士鱼丸等）、口味创新、功能性鱼丸（低脂、高蛋白）、预制菜产品开发。',
        careers: ['食品研发工程师', '产品经理', '感官评价师', '配方师'],
        avgSalary: '8k-25k',
        demand: '高',
        trend: 'up',
        tags: ['新品研发', '口味创新', '功能性食品', '预制菜'],
      },
      {
        title: '食品安全与检测',
        desc: 'HACCP体系、ISO22000认证、SC生产许可、微生物检测、重金属检测、添加剂合规检测。',
        careers: ['食品安全审核员', '化验员', '质量体系工程师', '合规专员'],
        avgSalary: '5k-18k',
        demand: '稳定',
        trend: 'stable',
        tags: ['HACCP', 'ISO22000', 'SC认证', '检测'],
      },
    ]
  },
  downstream: {
    title: '下游 · 销售流通',
    icon: <Store className="w-6 h-6" />,
    color: 'bg-green-500',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    items: [
      {
        title: '批发市场渠道',
        desc: '农贸批发市场、冻品批发市场、食品城的传统批发渠道，是鱼丸最主要的销售通路，占行业销售额60%以上。',
        careers: ['批发商', '渠道经理', '区域代理商', '市场拓展'],
        avgSalary: '6k-20k+提成',
        demand: '高',
        trend: 'stable',
        tags: ['农贸批发', '冻品市场', '渠道分销', '代理'],
      },
      {
        title: '餐饮供应链',
        desc: '火锅连锁店、麻辣烫、关东煮、团餐公司、食堂等B端餐饮渠道。近年火锅连锁化率提升带动鱼丸需求爆发。',
        careers: ['餐饮供应链经理', '大客户销售', 'B端业务代表', '餐饮渠道总监'],
        avgSalary: '8k-25k+提成',
        demand: '高',
        trend: 'up',
        tags: ['火锅供应链', '团餐', '连锁餐饮', 'B2B'],
      },
      {
        title: '电商与新零售',
        desc: '直播带货（抖音、快手）、社区团购（美团优选、多多买菜）、生鲜电商（盒马、朴朴）、传统电商（淘宝、拼多多）。',
        careers: ['电商运营', '直播主播', '短视频运营', '社群团长', '电商客服'],
        avgSalary: '5k-20k+提成',
        demand: '高',
        trend: 'up',
        tags: ['直播带货', '社区团购', '生鲜电商', '短视频'],
      },
      {
        title: '冷链物流配送',
        desc: '冷藏车运输、同城冷链配送、最后一公里保温配送。冷链物流是鱼丸销售的关键基础设施。',
        careers: ['冷链物流经理', '配送调度员', '仓库管理员', '物流专员'],
        avgSalary: '5k-15k',
        demand: '高',
        trend: 'up',
        tags: ['冷链运输', '同城配送', '仓储管理', '物流'],
      },
      {
        title: '出口贸易',
        desc: '鱼丸出口东南亚、日本、欧美等海外市场。需要符合出口国食品安全标准，办理出口备案、商检等手续。',
        careers: ['外贸业务员', '报关员', '外贸跟单', '海外市场经理'],
        avgSalary: '7k-25k+提成',
        demand: '中',
        trend: 'up',
        tags: ['出口贸易', '报关', '海外市场', '商检'],
      },
    ]
  }
};

// 行业新闻
const industryNews = [
  {
    id: 1,
    title: '2026年鱼丸行业市场规模预计突破800亿元',
    source: '中国食品报',
    date: '2026-08-10',
    summary: '受益于火锅餐饮连锁化、预制菜风口和直播电商渠道爆发，速冻鱼丸制品市场持续高速增长，年复合增长率超12%。',
    category: '市场数据',
    tag: '热点',
  },
  {
    id: 2,
    title: '福建鱼丸团体标准正式发布，行业规范化加速',
    source: '福建省食品工业协会',
    date: '2026-08-05',
    summary: '新标准对鱼丸的鱼肉含量、添加剂使用、生产工艺等做出明确规定，鱼丸中鱼肉含量不低于40%方可称为"鱼丸"。',
    category: '政策法规',
    tag: '政策',
  },
  {
    id: 3,
    title: '直播电商带火地方特色鱼丸，单场GMV破千万',
    source: '电商报',
    date: '2026-08-03',
    summary: '抖音头部主播带货地方特色手工鱼丸，单场直播销售额突破1200万元，冷链配送覆盖全国200+城市。',
    category: '渠道动态',
    tag: '电商',
  },
  {
    id: 4,
    title: 'AI视觉检测技术在鱼丸生产线落地应用',
    source: '食品科技',
    date: '2026-07-28',
    summary: '基于AI视觉的鱼丸外观缺陷检测系统已在多家头部企业上线，检测准确率达99.5%，大幅降低人工分拣成本。',
    category: '技术前沿',
    tag: 'AI',
  },
  {
    id: 5,
    title: '液氮速冻技术普及，鱼丸保鲜期延长至18个月',
    source: '制冷技术',
    date: '2026-07-22',
    summary: '新一代液氮速冻设备使鱼丸中心温度在5分钟内降至-18℃，大幅提升产品品质和保质期，设备成本下降30%。',
    category: '技术前沿',
    tag: '技术',
  },
  {
    id: 6,
    title: '东南亚鱼丸市场需求旺盛，出口额同比增长35%',
    source: '海关总署',
    date: '2026-07-15',
    summary: '2026年上半年鱼丸制品出口额达2.3亿美元，东南亚市场占比超60%，新加坡、马来西亚、泰国为主要出口目的地。',
    category: '出口贸易',
    tag: '出海',
  },
];

// 职业发展路线图（从0到1）
const careerRoadmaps = [
  {
    id: 'production',
    title: '🏭 生产加工路线',
    subtitle: '从打鱼丸学徒到工厂老板',
    icon: <Building2 className="w-6 h-6" />,
    color: 'primary',
    bgLight: 'bg-primary-50',
    borderColor: 'border-primary-300',
    badgeColor: 'bg-primary-500',
    suitable: '适合喜欢动手操作、钻研工艺技术、未来想开自己工厂的人',
    stages: [
      {
        stage: 1,
        title: '入门学徒',
        time: '第0-6个月',
        salary: '3k-5k/月',
        daily: '跟着师傅学习打浆、成型、蒸煮等基础操作，熟悉车间环境和卫生规范',
        skills: ['基础打浆操作', '设备开关机', '食品卫生规范', '配方初步认知'],
        certs: ['健康证（必须）'],
        milestone: '能独立完成一种鱼丸的基础打浆操作',
        action: '找一家鱼丸厂或食品加工厂，从学徒做起，踏实学手艺',
        tip: '这个阶段别怕累，多问多练，半年内争取摸透全流程',
      },
      {
        stage: 2,
        title: '熟练技工',
        time: '第6个月-2年',
        salary: '5k-8k/月',
        daily: '独立操作打浆机和成型机，能根据不同鱼种和季节调整配方参数',
        skills: ['独立打浆工艺', '配方参数调整', '设备日常维护', '品质感官判断'],
        certs: ['食品检验工（初级）'],
        milestone: '拿到一个可独立操作的配方权，成为车间核心技工',
        action: '多练不同鱼种（鳗鱼、马鲛鱼、杂鱼）的打浆，开始学习配方研发',
        tip: '把每次打浆的配方、温度、时间记录下来，形成自己的配方笔记',
      },
      {
        stage: 3,
        title: '高级技师/打浆师傅',
        time: '第2-5年',
        salary: '8k-15k/月',
        daily: '负责核心打浆工序，研发新产品配方，带1-2个徒弟，把控整条线的品质',
        skills: ['配方自主研发', '新品开发能力', '工艺优化', '带徒弟/培训能力'],
        certs: ['食品检验工（中级）', 'SC生产许可相关培训'],
        milestone: '独立研发出至少1款上市新品，带了2个以上徒弟',
        action: '主动参与新品研发项目，积累自己的配方数据库，建立口碑',
        tip: '这个阶段的技术水平决定了你的市场价值，好的打浆师傅月薪轻松过万',
      },
      {
        stage: 4,
        title: '生产厂长/技术总监',
        time: '第5-10年',
        salary: '15k-30k/月',
        daily: '管理整个生产车间，制定生产排期计划，建立品质管理体系，对接客户验厂',
        skills: ['全流程生产管理', 'HACCP体系搭建', '成本核算与控制', '供应链协调'],
        certs: ['HACCP内审员', 'ISO22000内审员'],
        milestone: '管理的工厂通过HACCP或ISO22000认证，年产值超500万',
        action: '学习管理知识和体系认证，建立标准化生产流程，培养管理能力',
        tip: '从技术到管理的跨越是关键一步，建议考取体系认证相关证书',
      },
      {
        stage: 5,
        title: '工厂老板/企业主',
        time: '第10年+',
        salary: '30k-100k+/月',
        daily: '经营自己的鱼丸品牌，管理团队，拓展销售渠道，打造品牌影响力',
        skills: ['企业经营', '品牌建设', '市场拓展', '战略规划', '团队管理'],
        certs: ['SC食品生产许可证（企业主体）', '商标注册'],
        milestone: '拥有自己的工厂和品牌，年产值突破千万',
        action: '你已经有了自己的工厂！持续扩大规模，打造区域品牌',
        tip: '创业有风险，建议先在行业内积累足够的客户资源和资金后再启动',
      },
    ]
  },
  {
    id: 'sales',
    title: '📈 销售渠道路线',
    subtitle: '从跑业务到销售合伙人',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'success',
    bgLight: 'bg-success-50',
    borderColor: 'border-success-300',
    badgeColor: 'bg-success-500',
    suitable: '适合善于沟通、喜欢与人打交道、想通过销售赚大钱的人',
    stages: [
      {
        stage: 1,
        title: '业务员/销售代表',
        time: '第0-1年',
        salary: '4k-8k/月（底薪+提成）',
        daily: '跑批发市场、火锅店、麻辣烫店等终端客户，推销公司产品，收集市场信息',
        skills: ['客户拜访技巧', '产品知识', '基础谈判', '客户关系维护'],
        certs: ['无硬性要求'],
        milestone: '月销售额突破10万，开发20个稳定客户',
        action: '加入一家鱼丸或冻品贸易公司，从跑终端开始积累客户资源',
        tip: '脸皮要厚，不怕被拒绝。每天多跑一家店，一年就多365个机会',
      },
      {
        stage: 2,
        title: '区域经理',
        time: '第1-3年',
        salary: '8k-15k/月（底薪+提成+年终）',
        daily: '负责一个城市或区域的销售，管理2-3个业务员，对接大客户和连锁餐饮',
        skills: ['区域市场规划', '团队管理', '大客户谈判', '竞品分析'],
        certs: ['驾驶证（必备）'],
        milestone: '区域年销售额突破300万，团队3人以上',
        action: '深耕一个区域，把每个批发市场和餐饮集中区摸透',
        tip: '掌握客户需求规律，知道哪家火锅店什么时候补货，你就成功了一半',
      },
      {
        stage: 3,
        title: '大客户总监/渠道总监',
        time: '第3-7年',
        salary: '15k-30k/月（底薪+提成+分红）',
        daily: '对接火锅连锁品牌、大型团餐公司、生鲜电商平台等B端大客户，制定渠道策略',
        skills: ['大客户管理', '渠道策略制定', '合同谈判', '供应链方案设计'],
        certs: ['食品行业相关培训证书'],
        milestone: '签下至少1个全国连锁品牌客户，年销售额破千万',
        action: '从单点客户转向连锁系统客户，学习供应链服务方案设计',
        tip: '连锁餐饮是鱼丸最大的增量市场，掌握几个大客户就稳了',
      },
      {
        stage: 4,
        title: '销售副总/合伙人',
        time: '第7年+',
        salary: '30k-80k+/月（底薪+分红+股权）',
        daily: '制定公司整体销售战略，管理全国销售团队，参与公司经营决策',
        skills: ['战略规划', '组织管理', '品牌营销', '资源整合'],
        certs: ['MBA或管理类培训（加分）'],
        milestone: '团队年销售额破亿，成为公司合伙人',
        action: '从执行者转变为决策者，用你的客户资源和行业经验换取股权',
        tip: '到这个阶段，你卖的不是鱼丸，是供应链解决方案和行业信任',
      },
    ]
  },
  {
    id: 'ecommerce',
    title: '📱 电商新零售路线',
    subtitle: '从零开始做鱼丸电商',
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'warning',
    bgLight: 'bg-warning-50',
    borderColor: 'border-warning-300',
    badgeColor: 'bg-warning-500',
    suitable: '适合懂互联网、喜欢拍视频、想通过直播电商卖鱼丸的人',
    stages: [
      {
        stage: 1,
        title: '电商小白/助理',
        time: '第0-6个月',
        salary: '3k-6k/月',
        daily: '学习开店（淘宝/拼多多/抖音小店），上架商品，回复客服消息，打包发货',
        skills: ['电商平台操作', '商品上架优化', '客服沟通', '基础打包发货'],
        certs: ['无硬性要求'],
        milestone: '独立运营1个店铺，月销售额突破1万',
        action: '先从一个平台开始（推荐抖音小店+直播），边学边做',
        tip: '不用什么都会，先专注一个平台跑通，再复制到其他平台',
      },
      {
        stage: 2,
        title: '电商运营专员',
        time: '第6个月-2年',
        salary: '6k-12k/月（底薪+提成）',
        daily: '负责店铺日常运营，做活动策划，投流推广，分析数据优化转化率',
        skills: ['活动策划', '付费推广（千川/直通车）', '数据分析', '短视频基础拍摄'],
        certs: ['互联网营销师（可选）'],
        milestone: '单月店铺销售额突破10万，ROI稳定在1:3以上',
        action: '学习付费投流，把短视频+直播+商城三合一跑起来',
        tip: '鱼丸视频拍"制作过程"最火，把打浆、挤丸、下锅的流程拍好',
      },
      {
        stage: 3,
        title: '电商经理/直播运营',
        time: '第2-4年',
        salary: '12k-25k/月（底薪+提成+分红）',
        daily: '管理电商团队（运营+主播+客服），策划大促活动，对接MCN机构和达人',
        skills: ['直播运营', '达人BD', '供应链管理', '团队管理', '品牌策划'],
        certs: ['电商运营相关认证'],
        milestone: '团队月销售额突破50万，合作达人10+',
        action: '组建自己的直播团队或签约达人，从卖货转向品牌化运营',
        tip: '达人带货是放大器，但利润大头要留在自己的店铺和私域',
      },
      {
        stage: 4,
        title: '电商总监/电商品牌创始人',
        time: '第4年+',
        salary: '25k-80k+/月（底薪+分红+股权）',
        daily: '打造鱼丸电商品牌，全渠道布局（抖音+快手+视频号+小红书+社区团购），供应链深度整合',
        skills: ['品牌打造', '全渠道运营', '供应链深度整合', '资本运作'],
        certs: ['SC食品生产许可证（如需自产）'],
        milestone: '年销售额破千万，品牌在细分品类进入TOP3',
        action: '从渠道商转型为品牌商，掌握定价权和供应链话语权',
        tip: '电商的终局是品牌+供应链，光会卖货走不远',
      },
    ]
  },
  {
    id: 'entrepreneur',
    title: '🚀 自主创业路线',
    subtitle: '小作坊到大品牌的成长之路',
    icon: <Target className="w-6 h-6" />,
    color: 'danger',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-300',
    badgeColor: 'bg-red-500',
    suitable: '适合有野心、能吃苦、想打造自己鱼丸品牌的人（你现在就在这条路上！）',
    stages: [
      {
        stage: 1,
        title: '行业打工/学艺',
        time: '第0-2年',
        salary: '3k-8k/月（打工收入）',
        daily: '在鱼丸厂或食品厂打工，全面学习生产、采购、销售各个环节',
        skills: ['鱼丸全流程工艺', '原料采购渠道', '客户积累', '基础财务'],
        certs: ['健康证', '食品检验工', 'SC生产许可知识'],
        milestone: '摸透鱼丸生产全流程，积累50+客户联系方式，了解原料供应商',
        action: '你现在就是在这个阶段！把每个环节都学透，为创业打好基础',
        tip: '打工不是为了赚钱，是为了偷师。生产、采购、销售三块都要学',
      },
      {
        stage: 2,
        title: '小作坊起步',
        time: '第2-3年',
        salary: '5k-15k/月（创业初期）',
        daily: '租一个小场地，买二手设备，办小作坊登记证，自己生产自己卖',
        skills: ['小作坊运营', '成本核算', '客户开发', '产品差异化'],
        certs: ['小作坊登记证', '食品经营许可证'],
        milestone: '月产量稳定在500斤以上，客户复购率超60%',
        action: '从小做起，先服务周边3-5公里的客户，用品质和口碑积累回头客',
        tip: '刚开始别贪大，小作坊投入低（几万块就能启动），先跑通盈利模型',
      },
      {
        stage: 3,
        title: '品牌化运营',
        time: '第3-7年',
        salary: '15k-50k/月',
        daily: '升级为SC认证工厂，注册商标，做包装设计，线上线下全渠道销售',
        skills: ['品牌建设', 'SC工厂管理', '全渠道销售', '团队建设'],
        certs: ['SC食品生产许可证', '商标注册证', 'HACCP认证'],
        milestone: '年产值突破500万，品牌在本地有一定知名度',
        action: '从"三无产品"升级为正规品牌，这是从小作坊到大企业的关键一步',
        tip: 'SC证是分水岭，有了它才能进商超、做电商、接大客户',
      },
      {
        stage: 4,
        title: '规模化扩张',
        time: '第7年+',
        salary: '50k-200k+/月',
        daily: '扩大产能，拓展省外市场，布局电商直播，考虑融资或引入合伙人',
        skills: ['战略规划', '资本运作', '组织管理', '品牌营销'],
        certs: ['ISO22000', '出口备案（如需出口）'],
        milestone: '年产值突破3000万，品牌进入区域前三',
        action: '考虑引入投资或合伙人，把盘子做大，从区域品牌走向全国',
        tip: '到这个阶段，老板的核心能力不再是做鱼丸，而是管人、管钱、管方向',
      },
    ]
  },
];

export default function IndustryInsight() {
  const [activeSection, setActiveSection] = useState<'chain' | 'news' | 'career'>('chain');
  const [activeRoadmap, setActiveRoadmap] = useState('entrepreneur');

  // Tailwind JIT 需要完整的类名，不能用模板字符串拼接
  const colorClasses: Record<string, { bg: string; badge: string }> = {
    primary: { bg: 'bg-primary-500', badge: 'bg-primary-500' },
    success: { bg: 'bg-success-500', badge: 'bg-success-500' },
    warning: { bg: 'bg-warning-500', badge: 'bg-warning-500' },
    danger: { bg: 'bg-red-500', badge: 'bg-red-500' },
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">行业洞察</h1>
          <p className="text-gray-500 mt-1">鱼丸行业上中下游产业链全景、最新资讯与职业发展路径</p>
        </div>
      </div>

      {/* 子导航 */}
      <div className="flex items-center gap-2">
        {[
          { id: 'chain' as const, label: '产业链全景', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'news' as const, label: '行业资讯', icon: <Newspaper className="w-4 h-4" /> },
          { id: 'career' as const, label: '职业发展', icon: <GraduationCap className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
              activeSection === tab.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-warm-50 border border-warm-100'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== 产业链全景 ========== */}
      {activeSection === 'chain' && (
        <div className="space-y-8">
          {/* 产业链流程图 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Anchor className="w-5 h-5 text-primary-500" />
              鱼丸产业链全景图
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { label: '水产养殖\n捕捞', icon: <Fish className="w-5 h-5" />, color: 'bg-blue-500' },
                { label: '原料供应\n贸易', icon: <Package className="w-5 h-5" />, color: 'bg-blue-500' },
                { label: '设备制造', icon: <Wrench className="w-5 h-5" />, color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <span className="text-xs text-center text-gray-600 whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              ))}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs text-center text-gray-600 whitespace-pre-line leading-tight">鱼丸加工\n制造</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              {[
                { label: '批发市场', icon: <Store className="w-5 h-5" />, color: 'bg-green-500' },
                { label: '餐饮渠道', icon: <Users className="w-5 h-5" />, color: 'bg-green-500' },
                { label: '电商零售', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-green-500' },
                { label: '出口贸易', icon: <Globe className="w-5 h-5" />, color: 'bg-green-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <span className="text-xs text-center text-gray-600 whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                  {i < 3 && <span className="text-gray-300 text-sm">/</span>}
                </div>
              ))}
            </div>
          </Card>

          {/* 上游 */}
          <SectionBlock data={industryChain.upstream} />

          {/* 中游 */}
          <SectionBlock data={industryChain.midstream} />

          {/* 下游 */}
          <SectionBlock data={industryChain.downstream} />
        </div>
      )}

      {/* ========== 行业资讯 ========== */}
      {activeSection === 'news' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {industryNews.map(news => (
              <Card key={news.id} className="p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <Tag variant="primary" size="sm">{news.category}</Tag>
                  <Tag variant={news.tag === '热点' ? 'danger' : news.tag === 'AI' ? 'info' : 'warning'} size="sm">
                    {news.tag}
                  </Tag>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 leading-snug">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{news.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{news.source}</span>
                  <span className="text-xs text-gray-400">{news.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========== 职业发展 ========== */}
      {activeSection === 'career' && (
        <div className="space-y-6">
          {/* 说明卡片 */}
          <Card className="p-5 bg-gradient-to-r from-primary-50 to-warm-50 border border-primary-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">从0到1，你的鱼丸行业上升之路</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  以下是四条清晰的职业发展路线，每条路线都标注了每个阶段的时间、薪资、日常内容、需要掌握的技能和证书。
                  你现在是鱼丸小作坊老板，最匹配的是<strong className="text-red-600">自主创业路线</strong>，但建议也了解其他路线，
                  未来你可能需要招聘这些岗位的人，或者在不同阶段切换路线。
                </p>
              </div>
            </div>
          </Card>

          {/* 四条路线Tab切换 */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {careerRoadmaps.map(roadmap => (
              <button
                key={roadmap.id}
                onClick={() => setActiveRoadmap(roadmap.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  activeRoadmap === roadmap.id
                    ? `${colorClasses[roadmap.color].bg} text-white shadow-md`
                    : 'bg-white text-gray-600 hover:bg-warm-50 border border-warm-100'
                )}
              >
                {roadmap.icon}
                {roadmap.title.replace(/[^\u4e00-\u9fa5]/g, '')}
              </button>
            ))}
          </div>

          {/* 当前选中的路线详情 */}
          {careerRoadmaps.filter(r => r.id === activeRoadmap).map(roadmap => (
            <div key={roadmap.id} className="space-y-6">
              {/* 路线概览 */}
              <Card className={`p-5 border-l-4 ${roadmap.borderColor}`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${roadmap.bgLight} flex items-center justify-center`}>
                    {roadmap.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{roadmap.title}</h3>
                    <p className="text-sm text-gray-500">{roadmap.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{roadmap.suitable}</p>
              </Card>

              {/* 阶段时间线 */}
              <div className="relative">
                {/* 竖线 */}
                <div className="absolute left-[31px] top-0 bottom-0 w-0.5 bg-warm-200" />

                <div className="space-y-0">
                  {roadmap.stages.map((stage, idx) => (
                    <div key={idx} className="relative pl-20 pb-8 last:pb-0">
                      {/* 圆圈节点 */}
                      <div className={clsx(
                        'absolute left-[19px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center',
                        colorClasses[roadmap.color].bg
                      )}>
                        <span className="text-white text-xs font-bold">{stage.stage}</span>
                      </div>

                      {/* 阶段卡片 */}
                      <Card className={clsx(
                        'p-5 hover:shadow-card-hover transition-shadow',
                        idx === 0 && 'ring-2 ring-primary-200'
                      )}>
                        {idx === 0 && (
                          <div className="mb-3">
                            <Tag variant="primary" size="sm">👈 从这里开始</Tag>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 text-base">{stage.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {stage.time}
                              </span>
                              <span className="text-xs text-warning-600 font-medium flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> {stage.salary}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-400 mb-1">阶段目标</div>
                            <div className="text-xs font-medium text-success-600 bg-success-50 px-2 py-1 rounded-lg">
                              {stage.milestone}
                            </div>
                          </div>
                        </div>

                        {/* 日常工作 */}
                        <div className="mb-3 p-3 bg-warm-50 rounded-xl">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <Briefcase className="w-3 h-3" /> 日常工作
                          </div>
                          <p className="text-sm text-gray-700">{stage.daily}</p>
                        </div>

                        {/* 技能 + 证书 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                              <Zap className="w-3 h-3" /> 需掌握的技能
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {stage.skills.map(skill => (
                                <span key={skill} className={`px-2 py-0.5 ${roadmap.bgLight} text-gray-700 rounded text-xs`}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                              <ShieldCheck className="w-3 h-3" /> 推荐证书
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {stage.certs.map(cert => (
                                <span key={cert} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 行动建议 */}
                        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-warm-50 to-primary-50 rounded-xl">
                          <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary-700">{stage.action}</p>
                          </div>
                        </div>

                        {/* 小贴士 */}
                        <div className="mt-3 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-warning-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 italic">{stage.tip}</p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 关键证书 */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              行业关键证书与资质
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { name: 'SC食品生产许可证', desc: '开办食品加工厂的必备资质，由市场监管局颁发', level: '必备' },
                { name: 'HACCP体系认证', desc: '危害分析与关键控制点认证，出口企业必备', level: '进阶' },
                { name: 'ISO 22000认证', desc: '食品安全管理体系国际标准认证', level: '进阶' },
                { name: '食品检验工证书', desc: '从事食品检验工作的职业资格证书', level: '入门' },
                { name: '冷链物流管理师', desc: '冷链物流行业专业能力认证', level: '进阶' },
                { name: '电商运营师', desc: '互联网营销师等电商相关职业认证', level: '入门' },
              ].map((cert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-warm-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">{cert.name}</span>
                      <Tag variant={cert.level === '必备' ? 'danger' : 'info'} size="sm">{cert.level}</Tag>
                    </div>
                    <p className="text-xs text-gray-500">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 行业展会 */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              行业重要展会
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { name: '中国国际渔业博览会', location: '青岛', time: '每年10月', desc: '全球最大水产贸易展之一' },
                { name: '中国冷冻食品展', location: '郑州', time: '每年8月', desc: '速冻食品行业风向标' },
                { name: 'FHC上海环球食品展', location: '上海', time: '每年11月', desc: '食品饮料全产业链展会' },
              ].map((expo, i) => (
                <div key={i} className="p-4 bg-warm-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-1">{expo.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    {expo.location} · {expo.time}
                  </div>
                  <p className="text-xs text-gray-500">{expo.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// 产业链子区块组件
function SectionBlock({ data }: { data: typeof industryChain.upstream }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${data.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
          {data.icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{data.title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.items.map((item, i) => (
          <Card key={i} className={`p-5 border-l-4 ${data.borderColor} hover:shadow-card-hover transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className={clsx('w-3 h-3', item.trend === 'up' ? 'text-success-500' : 'text-gray-400')} />
                <span className={clsx(item.trend === 'up' ? 'text-success-600' : 'text-gray-500')}>
                  {item.trend === 'up' ? '上升' : '平稳'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.desc}</p>

            {/* 可从事职业 */}
            <div className="mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <Briefcase className="w-3 h-3" />
                可从事职业
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.careers.map(career => (
                  <span key={career} className={`px-2 py-1 ${data.bgLight} ${data.textColor} rounded-md text-xs font-medium`}>
                    {career}
                  </span>
                ))}
              </div>
            </div>

            {/* 薪资与需求 */}
            <div className="flex items-center gap-4 mb-3 pt-3 border-t border-warm-100">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-warning-500" />
                <span className="text-xs text-gray-500">薪资：</span>
                <span className="text-xs font-semibold text-gray-800">{item.avgSalary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs text-gray-500">需求：</span>
                <span className={clsx('text-xs font-semibold', item.demand === '高' ? 'text-success-600' : 'text-gray-600')}>
                  {item.demand}
                </span>
              </div>
            </div>

            {/* 关键词 */}
            <div className="flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-warm-50 text-gray-500 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
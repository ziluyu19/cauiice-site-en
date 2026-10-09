// CAUIICE 英文网站独立数据架构与占位数据
// 注：按要求当前阶段保留中文骨架文案，后续统一进行英文内容创作

export interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  description: string;
}

export interface WhatWeDoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ProcessStepItem {
  step: string;
  title: string;
  description: string;
  detail: string;
}

export interface RegionDistributionItem {
  code: string;
  name: string;
  count: number;
  featuredInstitutions: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  field: 'ai' | 'green_tech' | 'biomedicine' | 'smart_mfg' | 'edutech';
  fieldName: string;
  status: 'recruiting' | 'ongoing' | 'completed' | 'preparing';
  statusName: string;
  description: string;
  leadInstitution: string;
  targetRegion: string;
  deadline?: string;
  date: string;
}

export interface MemberItem {
  id: string;
  name: string;
  type: 'university' | 'enterprise' | 'tech_park' | 'transfer_agency';
  typeName: string;
  region: 'beijing' | 'shanghai' | 'jiangsu' | 'zhejiang' | 'guangdong' | 'other';
  regionName: string;
  description: string;
  established?: string;
  keyFields: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'work_updates' | 'events' | 'policy_insights';
  categoryName: string;
  date: string;
  summary: string;
  content?: string;
  image: string;
  readTime?: string;
  published?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

// 国家与地区标准代码选项 (Inquiry Form 使用)
export const COUNTRY_OPTIONS = [
  { code: 'CN', name: '中国 (China)' },
  { code: 'US', name: '美国 (United States)' },
  { code: 'GB', name: '英国 (United Kingdom)' },
  { code: 'DE', name: '德国 (Germany)' },
  { code: 'FR', name: '法国 (France)' },
  { code: 'JP', name: '日本 (Japan)' },
  { code: 'KR', name: '韩国 (South Korea)' },
  { code: 'SG', name: '新加坡 (Singapore)' },
  { code: 'AU', name: '澳大利亚 (Australia)' },
  { code: 'CA', name: '加拿大 (Canada)' },
  { code: 'CH', name: '瑞士 (Switzerland)' },
  { code: 'NL', name: '荷兰 (Netherlands)' },
  { code: 'OTHER', name: '其他国家或地区 (Other)' },
];

// 合作意向分类代码选项 (Inquiry Form 使用)
export const INTENT_CATEGORIES = [
  { code: 'JOINT_LAB', name: '联合实验室 / 联合研发中心' },
  { code: 'TECH_TRANSFER', name: '跨国技术成果转移转化' },
  { code: 'TALENT_EXCHANGE', name: '国际化产教融合与高层次人才交流' },
  { code: 'INDUSTRY_SUMMIT', name: '全球高校校办产业学术与创新论坛' },
  { code: 'MEMBERSHIP_ENQUIRY', name: '会员申请与海外伙伴网络加入' },
  { code: 'OTHER', name: '其他定制化国际合作项目' },
];

// 首页核心指标
export const HOME_STATS: StatItem[] = [
  { id: '1', value: '180+', suffix: '', label: '全国核心高校产业', description: '覆盖双一流大学及高水平科研产业体系' },
  { id: '2', value: '35+', suffix: '', label: '覆盖全球国家与地区', description: '广泛联系欧洲、北美、亚太及一带一路合作伙伴' },
  { id: '3', value: '320+', suffix: '项', label: '对接跨国孵化与转化项目', description: '促进高端科技成果跨国双向流动' },
  { id: '4', value: '50+', suffix: '个', label: '大学科技园及技术转移示范机构', description: '协同创新与产业集群国际化支撑' },
];

// 首页与业务能力：四大合作方向
export const WHAT_WE_CAN_DO: WhatWeDoItem[] = [
  {
    id: 'do-1',
    title: '全球产学研协同研发',
    subtitle: 'Joint R&D & Labs',
    description: '协助海外知名高校、跨国研发机构与中国高水平大学建立高标准联合实验室与联合技术攻关联合体。',
    icon: 'lab',
    features: ['联合研发平台立项辅导', '产学研多方知识产权共担机制', '重点跨国科研基金申报协同'],
  },
  {
    id: 'do-2',
    title: '科技成果跨国转移转化',
    subtitle: 'Technology Transfer',
    description: '依托全国高校大学科技园与校办产业集团，提供全球优质先进技术的中国落地孵化与中国高新技术出海对接。',
    icon: 'transfer',
    features: ['全球技术成果库双向检索', '概念验证与跨国中试转化', '投资机构与产业园区精准撮合'],
  },
  {
    id: 'do-3',
    title: '高层次人才与双向访学',
    subtitle: 'Talent & Academic Visits',
    description: '搭建中国高校创新型企业家、技术转移经理人与海外学者、产业导师之间的双向交流培训通道。',
    icon: 'academic',
    features: ['高层次产业领军人才培训', '国际大学科技园参访调研', '青年学者与创业导师双向交流'],
  },
  {
    id: 'do-4',
    title: '行业智库报告与国际标准',
    subtitle: 'Think Tank & Standards',
    description: '汇聚中国校办产业权威专家，发布产学研协同发展蓝皮书，参与制定国际产教融合团体标准。',
    icon: 'standard',
    features: ['年度产学研出海洞察白皮书', 'T/CAUI 国际化产教团体标准', '国际产业合规与政策咨询服务'],
  },
];

// 合作落地 4 步流程
export const HOW_IT_WORKS: ProcessStepItem[] = [
  {
    step: '01',
    title: '提交合作意向 (Submit Enquiry)',
    description: '海外机构或国内单位填写并提交标准化合作对接表单，阐述核心诉求与技术领域。',
    detail: '国专委秘书处在 3 个工作日内进行资质初审与意向确认。',
  },
  {
    step: '02',
    title: '需求研判与精准匹配 (Evaluation & Matching)',
    description: '智库专家团队研判合作可行性，在全国高校及产业网络中定向遴选最匹配的高校院系或科技园。',
    detail: '出具初步对接建议书，组织线上双向预沟通会。',
  },
  {
    step: '03',
    title: '官方深度对接与洽谈 (Official Dialogue)',
    description: '组织双方法务、技术、产业代表开展专项圆桌洽谈，敲定知识产权归属与合作模式细节。',
    detail: '必要时安排实地园区互访或双向调研考察。',
  },
  {
    step: '04',
    title: '签署协议与常态推进 (Signing & Execution)',
    description: '缔结正式合作备忘录 (MoU) 或项目协议，由国专委秘书处纳入常态化追踪与生态支持池。',
    detail: '提供后续政策申报、宣传展示与阶段性成果核验。',
  },
];

// 重点省份地区分布静态数据
export const REGION_DISTRIBUTION: RegionDistributionItem[] = [
  { code: 'beijing', name: '北京 (Beijing)', count: 48, featuredInstitutions: ['清华大学校企体系', '北京大学科技园', '北京航空航天大学资产经营公司'] },
  { code: 'shanghai', name: '上海 (Shanghai)', count: 32, featuredInstitutions: ['上海交通大学产业集团', '同济大学科技园', '复旦大学技术转移中心'] },
  { code: 'jiangsu', name: '江苏 (Jiangsu)', count: 26, featuredInstitutions: ['南京大学产业体系', '东南大学科技园', '苏州大学技术转移中心'] },
  { code: 'zhejiang', name: '浙江 (Zhejiang)', count: 24, featuredInstitutions: ['浙江大学圆正控股集团', '浙江工业大学产业集团', '宁波大学科技园'] },
  { code: 'guangdong', name: '广东 (Guangdong)', count: 28, featuredInstitutions: ['华南理工大学科技园', '中山大学产业集团', '南方科技大学技术转移中心'] },
  { code: 'other', name: '其他主要省份 (Other Regions)', count: 36, featuredInstitutions: ['西安交通大学科技园', '哈尔滨工业大学产业体系', '武汉大学资产经营投资公司'] },
];

// 合作项目库列表数据
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-01',
    title: '中欧智能制造工业互联网联合概念验证中心',
    field: 'smart_mfg',
    fieldName: '智能制造',
    status: 'recruiting',
    statusName: '招募中',
    description: '联合德国工业高校与国内工科名校产业平台，面向高端数控装备与产线数字孪生开展技术联合攻关与试点验证。',
    leadInstitution: '清华大学校企联合创新中心',
    targetRegion: '德国 / 瑞士 / 欧洲',
    deadline: '2026-12-31',
    date: '2026-09-15',
  },
  {
    id: 'proj-02',
    title: '亚太绿色低碳能源与储能技术跨国转移项目',
    field: 'green_tech',
    fieldName: '绿色低碳',
    status: 'ongoing',
    statusName: '进行中',
    description: '面向东南亚新兴市场，推广国内高校新型储能电芯与微电网能源管理系统，设立海外本地化示范基地。',
    leadInstitution: '华中科技大学产业集团',
    targetRegion: '新加坡 / 马来西亚 / 印度尼西亚',
    date: '2026-08-20',
  },
  {
    id: 'proj-03',
    title: '全球创新药与高端生物试剂临床前评价协同网络',
    field: 'biomedicine',
    fieldName: '生物医药',
    status: 'recruiting',
    statusName: '招募中',
    description: '汇聚国内顶尖医学院校大学科技园与海外生物医药孵化器，提供跨国分子筛选与早期毒理验证协同通道。',
    leadInstitution: '复旦大学技术转移中心',
    targetRegion: '英国 / 美国 / 法国',
    deadline: '2026-11-30',
    date: '2026-07-10',
  },
  {
    id: 'proj-04',
    title: '新一代多模态端侧 AI 计算加速芯片出海中试',
    field: 'ai',
    fieldName: '人工智能',
    status: 'ongoing',
    statusName: '进行中',
    description: '依托高校人工智能重点实验室孵化成果，携手跨国半导体企业开展嵌入式工业视觉推理硬件实测。',
    leadInstitution: '浙江大学计算机创新中心',
    targetRegion: '日本 / 韩国 / 欧洲',
    date: '2026-06-18',
  },
  {
    id: 'proj-05',
    title: '跨国产教融合工程教育虚拟仿真教学平台合作',
    field: 'edutech',
    fieldName: '教育科技',
    status: 'completed',
    statusName: '已完成',
    description: '共建覆盖机械工程与新能源汽车三维实训的国际化数字云平台，已实现 5 所海外友好学院联合授牌。',
    leadInstitution: '同济大学科技园',
    targetRegion: '中东 / 一带一路共建国家',
    date: '2026-05-01',
  },
  {
    id: 'proj-06',
    title: '智慧农业多光谱遥感与碳汇量化评估示范站',
    field: 'green_tech',
    fieldName: '绿色低碳',
    status: 'preparing',
    statusName: '筹备中',
    description: '针对海外大宗农作物病虫害智能预警与森林碳汇卫星测算，筹建首个多国科研联合观测网络。',
    leadInstitution: '中国农业大学产业投资发展平台',
    targetRegion: '拉美 / 澳洲',
    date: '2026-04-12',
  },
];

// 会员单位列表数据
export const MEMBERS_DATA: MemberItem[] = [
  {
    id: 'mem-01',
    name: '清华控股 / 清华大学科技园',
    type: 'tech_park',
    typeName: '大学科技园',
    region: 'beijing',
    regionName: '北京',
    description: '全球规模领先的大学科技园体系，专注前沿科技早期孵化与跨国产学研生态网络构建。',
    established: '1994',
    keyFields: ['人工智能', '微电子', '先进材料'],
  },
  {
    id: 'mem-02',
    name: '上海交通大学先进产业技术研究院',
    type: 'transfer_agency',
    typeName: '技术转移机构',
    region: 'shanghai',
    regionName: '上海',
    description: '承载交大全球重大科技成果转化落地，具备成熟的海外高价值专利池运营经验。',
    established: '2010',
    keyFields: ['高端海工装备', '生物医药', '智能驾驶'],
  },
  {
    id: 'mem-03',
    name: '浙江大学圆正控股集团有限公司',
    type: 'enterprise',
    typeName: '高校骨干产业',
    region: 'zhejiang',
    regionName: '浙江',
    description: '综合性高校独资资产经营公司，管理数十家高新技术与创新孵化领军企业。',
    established: '2005',
    keyFields: ['高端数控', '物联网', '绿色化工'],
  },
  {
    id: 'mem-04',
    name: '华南理工大学国家大学科技园',
    type: 'tech_park',
    typeName: '大学科技园',
    region: 'guangdong',
    regionName: '广东',
    description: '立足粤港澳大湾区，深度链接港澳与海外高校科技资源，赋能华南先进制造业。',
    established: '2003',
    keyFields: ['新能源材料', '工业互联', '智能机器人'],
  },
  {
    id: 'mem-05',
    name: '南京大学高新技术产业与孵化基地',
    type: 'university',
    typeName: '重点高校产业',
    region: 'jiangsu',
    regionName: '江苏',
    description: '围绕基础科学研究与应用转化并重，设立多个中外科学家联合概念验证工场。',
    established: '2008',
    keyFields: ['量子调控', '微纳电子', '环境生态'],
  },
  {
    id: 'mem-06',
    name: '西安交通大学国家技术转移中心',
    type: 'transfer_agency',
    typeName: '技术转移机构',
    region: 'other',
    regionName: '陕西',
    description: '西部创新港核心枢纽，面向中亚及丝绸之路经济带开展高水平技术援外与产业落地。',
    established: '1999',
    keyFields: ['电气工程', '先进动力', '特种合金'],
  },
];

// 新闻中心数据
export const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-01',
    title: '国专委赴欧洲考察高水平大学科技园协同创新体系',
    category: 'work_updates',
    categoryName: '工作动态',
    date: '2026-09-28',
    summary: '代表团重点调研了德国慕尼黑高科技园区与瑞士联邦理工创新工场，就中外联合概念验证达成多项合作共识。',
    content: '2026年9月，中国高校校办产业国际合作与交流专业委员会代表团应邀赴欧洲开展为期十天的专题考察调研。代表团先后走访了德国慕尼黑工业大学科技园、瑞士苏黎世联邦理工学院技术转移中心以及法国巴黎创新走廊，围绕中欧高校跨境联合中试、概念验证平台共建及知识产权协同等关键议题开展了闭门工作会谈。\n\n考察期间，代表团与外方有关机构达成了深化产学研双向对接的备忘录意向，为后续推动中外高水平大学联合实验室建设与产业人才互访奠定了坚实合作基础。',
    image: '/globe.svg',
    readTime: '4 min',
    published: true,
  },
  {
    id: 'news-02',
    title: '2026 全球高校校办产业国际合作对接年会征集项目启动',
    category: 'events',
    categoryName: '会议与活动',
    date: '2026-09-15',
    summary: '本届大会设立智能科技、绿色能源与医疗健康三大国际路演专场，诚邀海外高校与跨国机构报名参会。',
    content: '为进一步促进全国高校科技成果与全球优质产业资源高效配置，国专委定于2026年底在京举办"2026全球高校校办产业国际合作对接年会"。本次大会将特设智能制造、绿色低碳与生命健康三大前沿领域技术路演专场，重点邀请50余所中外著名大学产业代表及跨国投资机构进行闭门洽谈。\n\n目前，大会项目征集工作已正式启动，欢迎中外高校科研团队与科技园区积极申报。',
    image: '/file.svg',
    readTime: '3 min',
    published: true,
  },
  {
    id: 'news-03',
    title: '《高校科技成果跨境转移转化合规指引与实践蓝皮书》正式发布',
    category: 'policy_insights',
    categoryName: '政策与行业观察',
    date: '2026-08-30',
    summary: '由国专委智库联合多所重点高校与涉外知识产权律所联合编制，系统梳理跨境技术授权的核心要点。',
    content: '随着跨国高校产学研合作迈向深水区，涉外知识产权合规与权益分配机制成为各方关注的核心。国专委智库联合中国人民大学涉外法治研究院、清华大学知识产权研究中心及知名涉外律所，共同编制完成《高校科技成果跨境转移转化合规指引与实践蓝皮书》。\n\n本蓝皮书从概念验证、涉外估值、技术出口许可及共有专利收益分配等八大维度，为中国高校及其校办产业平台开展国际技术转移提供了全流程合规风控实务指导。',
    image: '/window.svg',
    readTime: '6 min',
    published: true,
  },
  {
    id: 'news-04',
    title: '第三期国际大学科技园经理人高级研修班圆满结业',
    category: 'work_updates',
    categoryName: '工作动态',
    date: '2026-08-12',
    summary: '来自全国 30 余所高校科技园负责人与技术经理人齐聚上海，围绕跨国知识产权运营开展为期一周深度研讨。',
    content: '国专委第三期国际大学科技园经理人高级研修班在上海交通大学先进产业技术研究院顺利结业。本期研修班邀请了来自世界知识产权组织（WIPO）、欧洲技术转移联合会及国内头部高校资产运营机构的权威专家，围绕国际技术转移中试孵化、跨境股权激励合规及涉外技术合同谈判开展实战推演。',
    image: '/globe.svg',
    readTime: '5 min',
    published: true,
  },
];

// 常见问题 FAQ
export const FAQ_DATA: FAQItem[] = [
  {
    question: '海外高校或科研机构如何与国专委发起合作对接？',
    answer: '可通过本站“合作咨询 (Enquiry)”在线提交机构信息与合作需求。国专委秘书处将在收到表单后 3 个工作日内核验，并由专职国际合作专员与您联系建立双向通道。',
  },
  {
    question: '国专委如何保护跨境技术交流中的知识产权 (IP)？',
    answer: '国专委严格遵循国际知识产权通用规则及涉外法律法规。在正式技术细节展开前，均会协同双方签署受法律保护的保密协议 (NDA) 及专项知识产权权益划分协议。',
  },
  {
    question: '海外机构能否申请成为国专委的国际友好伙伴单位？',
    answer: '可以。我们常年接受海外著名大学技术转移中心、知名产业孵化平台、外国驻华商会及行业科技协会的友好伙伴申请。审核通过后将纳入官方合作网络。',
  },
  {
    question: '项目对接过程是否收取中介撮合费用？',
    answer: '作为中国高校校办产业协会所属专业委员会，本机构开展的非商业性公益对接、政策辅导与网络推介不向海外合作高校收取中介费用。',
  },
];

// 委员会简介与组织架构
export const COMMITTEE_DATA = {
  overview: '中国高校校办产业协会国际合作与交流专业委员会（简称“国专委 / CAUIICE”）是中国高校校办产业协会所属专注涉外协同创新的专业分支机构，旨在搭建中国高水平大学产业平台与全球创新生态之间的权威沟通桥梁。',
  background: '依托全国高校数十年来在产教融合、技术转移与科技成果产业化方面的丰富积淀，国专委深入贯彻全球开放创新理念，致力于打造高水平跨境协同平台。',
  affiliation: '国专委由教育部直属业务指导，中国高校校办产业协会正式设立并常态化运营，非独立法人分支机构，所有业务严格接受协会章程与监督管理。',
  scope: '业务辐射全国高等院校校办企业、大学科技园、成果转化中心，并在欧洲、北美、亚太及一带一路共建地区建立广泛海外联络节点。',
};

// 组织架构与领导团队
export const ORGANISATION_DATA = {
  departments: [
    { name: '国专委秘书处 (Secretariat)', duty: '统筹协调全委常态化运营，负责对外联络、公文运转、会员会籍及外事综合保障。' },
    { name: '国际合作项目部 (International Projects Dept.)', duty: '负责跨国联合实验室、成果双向转移转化及重大示范工程的遴选、评估与全流程跟踪。' },
    { name: '会员发展与网络服务部 (Membership & Network Dept.)', duty: '负责国内高校会员单位、海外友好伙伴的准入审验、交流走访与常态化服务清单落地。' },
    { name: '智库咨询与标准委员会 (Think Tank & Standards Board)', duty: '组织行业权威专家发布国际产教融合蓝皮书，研究制定 T/CAUI 团体标准与政策咨询。' },
  ],
  leaders: [
    { title: '主任委员 (Chairman)', name: '专家代表', org: '中国高校校办产业领域资深学者与领军带头人' },
    { title: '副主任委员 (Vice Chairmen)', name: '多所重点高校产业集团负责人', org: '协同统筹各区域与核心行业学科的涉外合作' },
    { title: '秘书长 (Secretary General)', name: '秘书处执行负责人', org: '全面负责国专委日常运营管理与重大事项落地协调' },
  ],
};

// 官方联系方式与交通指南
export const CONTACT_DATA = {
  cooperation: {
    title: '国际合作与项目对接 (International Cooperation)',
    email: 'cooperation@cauiice.org.cn',
    phone: '+86 (10) 6278-8888 转 801',
    contactPerson: '国际项目部主管',
  },
  membership: {
    title: '会员服务与伙伴网络 (Membership & Network)',
    email: 'membership@cauiice.org.cn',
    phone: '+86 (10) 6278-8888 转 802',
    contactPerson: '会员联络专员',
  },
  media: {
    title: '媒体垂询与公共关系 (Media & PR)',
    email: 'media@cauiice.org.cn',
    phone: '+86 (10) 6278-8888 转 803',
    contactPerson: '新闻发言人办公室',
  },
  office: {
    address: '北京市海淀区清华科技园创新大厦 A 座 12 层',
    postalCode: '100084',
    workingHours: '周一至周五 09:00 – 17:30 (北京时间 UTC+8)',
    directions: '地铁 13 号线五道口站 A 出口向西步行 600 米；或地铁 4 号线中关村站乘车 5 分钟直达。',
  },
};

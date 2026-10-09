import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const TARGET_PROJECT_ID = 'cauiice-site-en';

// Candidate file names for local service account key
const CREDENTIAL_CANDIDATES = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  path.join(projectRoot, 'service-account.json'),
  path.join(projectRoot, 'cauiice-site-en-service-account.json'),
  path.join(projectRoot, 'serviceAccountKey.json'),
  path.join(projectRoot, 'credentials', 'service-account.json'),
  path.join(projectRoot, 'credentials', 'cauiice-site-en-service-account.json'),
];

// Scan for any *adminsdk*.json in project root
try {
  const rootFiles = fs.readdirSync(projectRoot);
  for (const f of rootFiles) {
    if (f.endsWith('.json') && (f.includes('adminsdk') || f.includes('service-account') || f.includes('serviceAccount'))) {
      const fullPath = path.join(projectRoot, f);
      if (!CREDENTIAL_CANDIDATES.includes(fullPath)) {
        CREDENTIAL_CANDIDATES.push(fullPath);
      }
    }
  }
} catch {
  // directory read error ignored
}

function resolveServiceAccount() {
  for (const candidate of CREDENTIAL_CANDIDATES) {
    if (candidate && fs.existsSync(candidate)) {
      try {
        const content = fs.readFileSync(candidate, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed && parsed.project_id) {
          return { filePath: candidate, credentials: parsed };
        }
      } catch (err) {
        console.warn(`[Credential Loader] Failed to parse candidate ${candidate}: ${err.message}`);
      }
    }
  }
  return null;
}

// 1. News items (4 items covering work_updates, events, policy_insights)
const SEED_NEWS = [
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

// 2. Projects items (4 items covering 4 statuses: preparing, recruiting, ongoing, completed)
const SEED_PROJECTS = [
  {
    id: 'proj-01',
    title: '中欧先进数控机床精度补偿算法联合概念验证中心',
    name: '中欧先进数控机床精度补偿算法联合概念验证中心',
    leadUniversity: '华中科技大学产业集团',
    chineseParty: '华中科技大学产业集团',
    leadInstitution: '华中科技大学产业集团',
    partner: '德国亚琛工业大学机械制造研究院',
    foreignParty: '德国亚琛工业大学机械制造研究院',
    field: 'smart_mfg',
    fieldName: '智能制造',
    status: 'In preparation',
    statusName: '筹备中',
    target: '德国 / 欧洲',
    country: '德国',
    targetRegion: '德国 / 欧洲',
    summary: '聚焦五轴高精度加工中心几何误差实时在线动态补偿算法，联合德国顶尖工科院校建立双向中试验证车间。',
    description: '聚焦五轴高精度加工中心几何误差实时在线动态补偿算法，联合德国顶尖工科院校建立双向中试验证车间。',
    desc: '聚焦五轴高精度加工中心几何误差实时在线动态补偿算法，联合德国顶尖工科院校建立双向中试验证车间。',
    featured: true,
    period: '2026.10 - 2028.12',
    date: '2026-09-15',
  },
  {
    id: 'proj-02',
    title: '全球创新药与高端生物试剂临床前评价协同网络',
    name: '全球创新药与高端生物试剂临床前评价协同网络',
    leadUniversity: '复旦大学技术转移中心',
    chineseParty: '复旦大学技术转移中心',
    leadInstitution: '复旦大学技术转移中心',
    partner: '英国剑桥科技园生命科学孵化平台',
    foreignParty: '英国剑桥科技园生命科学孵化平台',
    field: 'biomedicine',
    fieldName: '生物医药',
    status: 'Open for partners',
    statusName: '招募中',
    target: '英国 / 欧洲',
    country: '英国',
    targetRegion: '英国 / 美国 / 法国',
    summary: '汇聚国内顶尖医学院校大学科技园与海外生物医药孵化器，提供跨国分子筛选与早期毒理验证协同通道。',
    description: '汇聚国内顶尖医学院校大学科技园与海外生物医药孵化器，提供跨国分子筛选与早期毒理验证协同通道。',
    desc: '汇聚国内顶尖医学院校大学科技园与海外生物医药孵化器，提供跨国分子筛选与早期毒理验证协同通道。',
    featured: true,
    deadline: '2026-11-30',
    period: '2026.07 - 2027.06',
    date: '2026-07-10',
  },
  {
    id: 'proj-03',
    title: '亚太绿色低碳能源与储能技术跨国转移项目',
    name: '亚太绿色低碳能源与储能技术跨国转移项目',
    leadUniversity: '浙江大学圆正控股集团',
    chineseParty: '浙江大学圆正控股集团',
    leadInstitution: '浙江大学圆正控股集团',
    partner: '新加坡南洋理工大学能源研究院',
    foreignParty: '新加坡南洋理工大学能源研究院',
    field: 'green_tech',
    fieldName: '绿色低碳',
    status: 'Ongoing',
    statusName: '进行中',
    target: '新加坡 / 东南亚',
    country: '新加坡',
    targetRegion: '新加坡 / 马来西亚 / 印度尼西亚',
    summary: '面向东南亚新兴市场，推广国内高校新型储能电芯与微电网能源管理系统，设立海外本地化示范基地。',
    description: '面向东南亚新兴市场，推广国内高校新型储能电芯与微电网能源管理系统，设立海外本地化示范基地。',
    desc: '面向东南亚新兴市场，推广国内高校新型储能电芯与微电网能源管理系统，设立海外本地化示范基地。',
    featured: true,
    period: '2026.01 - 2027.12',
    date: '2026-08-20',
  },
  {
    id: 'proj-04',
    title: '跨国产教融合工程教育虚拟仿真教学平台合作',
    name: '跨国产教融合工程教育虚拟仿真教学平台合作',
    leadUniversity: '同济大学科技园',
    chineseParty: '同济大学科技园',
    leadInstitution: '同济大学科技园',
    partner: '中东工科大学工程实践示范学院',
    foreignParty: '中东工科大学工程实践示范学院',
    field: 'edutech',
    fieldName: '教育科技',
    status: 'Completed',
    statusName: '已完成',
    target: '中东 / 一带一路共建国家',
    country: '阿联酋',
    targetRegion: '中东 / 一带一路共建国家',
    summary: '共建覆盖机械工程与新能源汽车三维实训的国际化数字云平台，已实现 5 所海外友好学院联合授牌。',
    description: '共建覆盖机械工程与新能源汽车三维实训的国际化数字云平台，已实现 5 所海外友好学院联合授牌。',
    desc: '共建覆盖机械工程与新能源汽车三维实训的国际化数字云平台，已实现 5 所海外友好学院联合授牌。',
    featured: false,
    period: '2025.01 - 2026.05',
    date: '2026-05-01',
  },
];

// 3. Members items (7 items covering 4 types, 6 regions, varied tier, featured)
const SEED_MEMBERS = [
  {
    id: 'mem-01',
    name: '清华控股 / 清华大学科技园',
    type: 'tech_park',
    typeName: '大学科技园',
    region: 'beijing',
    regionName: '北京',
    tier: 'council',
    level: '副主任委员单位',
    description: '全球规模领先的大学科技园体系，专注前沿科技早期孵化与跨国产学研生态网络构建。',
    desc: '全球规模领先的大学科技园体系，专注前沿科技早期孵化与跨国产学研生态网络构建。',
    established: '1994',
    keyFields: ['人工智能', '微电子', '先进材料'],
    featured: true,
    annualCheck: '已通过 (2026)',
    contact: '科技园国际合作办公室',
  },
  {
    id: 'mem-02',
    name: '上海交通大学先进产业技术研究院',
    type: 'transfer_agency',
    typeName: '技术转移机构',
    region: 'shanghai',
    regionName: '上海',
    tier: 'council',
    level: '副主任委员单位',
    description: '承载交大全球重大科技成果转化落地，具备成熟的海外高价值专利池运营经验。',
    desc: '承载交大全球重大科技成果转化落地，具备成熟的海外高价值专利池运营经验。',
    established: '2010',
    keyFields: ['高端海工装备', '生物医药', '智能驾驶'],
    featured: true,
    annualCheck: '已通过 (2026)',
    contact: '产研院成果转化部',
  },
  {
    id: 'mem-03',
    name: '浙江大学圆正控股集团有限公司',
    type: 'enterprise',
    typeName: '高校骨干企业',
    region: 'zhejiang',
    regionName: '浙江',
    tier: 'council',
    level: '常务理事单位',
    description: '综合性高校独资资产经营公司，管理数十家高新技术与创新孵化领军企业。',
    desc: '综合性高校独资资产经营公司，管理数十家高新技术与创新孵化领军企业。',
    established: '2005',
    keyFields: ['高端数控', '物联网', '绿色化工'],
    featured: false,
    annualCheck: '已通过 (2026)',
    contact: '产业投资管理部',
  },
  {
    id: 'mem-04',
    name: '华南理工大学国家大学科技园',
    type: 'tech_park',
    typeName: '大学科技园',
    region: 'guangdong',
    regionName: '广东',
    tier: 'general',
    level: '理事会员单位',
    description: '立足粤港澳大湾区，深度链接港澳与海外高校科技资源，赋能华南先进制造业。',
    desc: '立足粤港澳大湾区，深度链接港澳与海外高校科技资源，赋能华南先进制造业。',
    established: '2003',
    keyFields: ['新能源材料', '工业互联', '智能机器人'],
    featured: true,
    annualCheck: '已通过 (2026)',
    contact: '园区涉外联络处',
  },
  {
    id: 'mem-05',
    name: '南京大学高新技术产业与孵化基地',
    type: 'university',
    typeName: '重点高校产业',
    region: 'jiangsu',
    regionName: '江苏',
    tier: 'council',
    level: '常务理事单位',
    description: '围绕基础科学研究与应用转化并重，设立多个中外科学家联合概念验证工场。',
    desc: '围绕基础科学研究与应用转化并重，设立多个中外科学家联合概念验证工场。',
    established: '2008',
    keyFields: ['量子调控', '微纳电子', '环境生态'],
    featured: false,
    annualCheck: '已通过 (2026)',
    contact: '产业处涉外办公室',
  },
  {
    id: 'mem-06',
    name: '西安交通大学国家技术转移中心',
    type: 'transfer_agency',
    typeName: '技术转移机构',
    region: 'other',
    regionName: '其他主要省份',
    tier: 'general',
    level: '理事会员单位',
    description: '西部创新港核心枢纽，面向中亚及丝绸之路经济带开展高水平技术援外与产业落地。',
    desc: '西部创新港核心枢纽，面向中亚及丝绸之路经济带开展高水平技术援外与产业落地。',
    established: '1999',
    keyFields: ['电气工程', '先进动力', '特种合金'],
    featured: false,
    annualCheck: '已通过 (2026)',
    contact: '国际技术转移部',
  },
  {
    id: 'mem-07',
    name: '北京航空航天大学资产经营有限公司',
    type: 'university',
    typeName: '重点高校产业',
    region: 'beijing',
    regionName: '北京',
    tier: 'council',
    level: '常务理事单位',
    description: '服务空天信融合国家战略，依托空天重点实验室打造高精尖涉外校企协同平台。',
    desc: '服务空天信融合国家战略，依托空天重点实验室打造高精尖涉外校企协同平台。',
    established: '2006',
    keyFields: ['航空航天', '智能传感', '网络安全'],
    featured: true,
    annualCheck: '已通过 (2026)',
    contact: '资产运营部',
  },
];

// 4. Site configuration documents
const SEED_SITE_CONFIG = {
  committee: {
    overview: '中国高校校办产业协会国际合作与交流专业委员会（简称“国专委 / CAUIICE”）是中国高校校办产业协会所属专注涉外协同创新的专业分支机构，旨在搭建中国高水平大学产业平台与全球创新生态之间的权威沟通桥梁。',
    background: '依托全国高校数十年来在产教融合、技术转移与科技成果产业化方面的丰富积淀，国专委深入贯彻全球开放创新理念，致力于打造高水平跨境协同平台。',
    affiliation: '国专委由教育部直属业务指导，中国高校校办产业协会正式设立并常态化运营，非独立法人分支机构，所有业务严格接受协会章程与监督管理。',
    scope: '业务辐射全国高等院校校办企业、大学科技园、成果转化中心，并在欧洲、北美、亚太及一带一路共建地区建立广泛海外联络节点。',
  },
  organisation: {
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
  },
  contact: {
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
  },
};

async function seed() {
  console.log('========================================================');
  console.log(`Target Firebase Project: ${TARGET_PROJECT_ID}`);
  console.log('Initializing Firestore via Firebase Admin SDK...');
  console.log('========================================================\n');

  const resolved = resolveServiceAccount();
  if (!resolved) {
    console.error('❌ [MISSING_CREDENTIALS] 未检测到 Firebase Admin 服务账号私钥文件！');
    console.error('--------------------------------------------------------');
    console.error('为安全注入测试数据，请在 Firebase 控制台完成以下唯一操作：');
    console.error(`1. 登录 Firebase Console 进入项目: ${TARGET_PROJECT_ID}`);
    console.error('2. 进入 [项目设置] -> [服务账号 (Service accounts)]');
    console.error('3. 点击 [生成新的私钥 (Generate new private key)] 下载 JSON 凭据');
    console.error(`4. 将下载的 JSON 文件重命名为: service-account.json`);
    console.error(`   放置在目录: ${projectRoot}\\service-account.json`);
    console.error('   (.gitignore 已将其彻底隔离，绝不会被 Git 跟踪或提交)');
    console.error('--------------------------------------------------------');
    process.exit(2);
  }

  const { filePath, credentials } = resolved;
  console.log(`✔ 检测到可用凭据文件: ${path.basename(filePath)}`);

  // 安全防线：校验 project_id 严格等于 cauiice-site-en
  if (credentials.project_id !== TARGET_PROJECT_ID) {
    console.error(`❌ [SECURITY_ABORT] 凭据所属项目 (${credentials.project_id}) 与目标项目 (${TARGET_PROJECT_ID}) 不一致！`);
    console.error('严禁操作中文站或其他 Firebase 项目，初始化程序已强制终止。');
    process.exit(3);
  }
  console.log(`✔ 项目 ID 强校验通过: ${credentials.project_id} (严禁触碰中文站 cauiice-site)`);

  // 初始化 Admin SDK
  initializeApp({
    credential: cert(credentials),
    projectId: TARGET_PROJECT_ID,
  });

  const db = getFirestore();
  const serverTimestamp = FieldValue.serverTimestamp;

  try {
    // 1. Seed News
    console.log(`\nWriting ${SEED_NEWS.length} news items...`);
    for (const item of SEED_NEWS) {
      const { id, ...data } = item;
      await db.collection('news').doc(id).set({
        ...data,
        createdAt: serverTimestamp(),
      }, { merge: true });
      console.log(`  [news] written: ${id} - ${data.title.slice(0, 24)}...`);
    }

    // 2. Seed Projects
    console.log(`\nWriting ${SEED_PROJECTS.length} project items...`);
    for (const item of SEED_PROJECTS) {
      const { id, ...data } = item;
      await db.collection('projects').doc(id).set({
        ...data,
        createdAt: serverTimestamp(),
      }, { merge: true });
      console.log(`  [projects] written: ${id} - ${data.title.slice(0, 24)}...`);
    }

    // 3. Seed Members
    console.log(`\nWriting ${SEED_MEMBERS.length} member items...`);
    for (const item of SEED_MEMBERS) {
      const { id, ...data } = item;
      await db.collection('members').doc(id).set({
        ...data,
        createdAt: serverTimestamp(),
      }, { merge: true });
      console.log(`  [members] written: ${id} - ${data.name.slice(0, 20)}...`);
    }

    // 4. Seed Site Config
    console.log('\nWriting siteConfig documents...');
    for (const [key, value] of Object.entries(SEED_SITE_CONFIG)) {
      await db.collection('siteConfig').doc(key).set({
        ...value,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      console.log(`  [siteConfig/${key}] written.`);
    }

    // 核对读取
    console.log('\n--- 实际写入文档数量核对 ---');
    const newsSnap = await db.collection('news').get();
    const projSnap = await db.collection('projects').get();
    const memSnap = await db.collection('members').get();
    const configSnap = await db.collection('siteConfig').get();

    console.log(`✔ news 集合实际文档数: ${newsSnap.size}`);
    console.log(`✔ projects 集合实际文档数: ${projSnap.size}`);
    console.log(`✔ members 集合实际文档数: ${memSnap.size}`);
    console.log(`✔ siteConfig 集合实际文档数: ${configSnap.size}`);

    console.log('\n🎉 所有基底数据已成功写入 cauiice-site-en Firestore！');
  } catch (err) {
    console.error('\n❌ 数据写入失败:', err.message);
    process.exit(1);
  }
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

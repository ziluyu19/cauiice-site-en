'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WHAT_WE_CAN_DO,
  PROJECTS_DATA,
  COMMITTEE_DATA,
  REGION_DISTRIBUTION,
  ProjectItem,
} from '@/lib/enData';
import { fetchEnglishProjects, fetchEnglishSiteConfig } from '@/lib/enFirestore';

export default function EnglishHomePage() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PROJECTS_DATA);
  const [committee, setCommittee] = useState(COMMITTEE_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishProjects(10).then((data) => {
      if (active && data && data.length > 0) {
        setProjectsList(data);
      }
    });
    fetchEnglishSiteConfig<typeof COMMITTEE_DATA>('committee').then((data) => {
      if (active && data && data.overview) {
        setCommittee(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // H-07: 精选招募中/开放中项目 (最多 3 个)
  const openProjects = projectsList.filter(
    (p) => p.status === 'recruiting' || p.status === 'ongoing'
  ).slice(0, 3);

  // H-04: 交互能力目录当前激活索引
  const [activeCapIdx, setActiveCapIdx] = useState(0);

  // 四大能力维度学术结构定义
  const CAPABILITY_INDEX = [
    {
      code: 'CAP-01',
      title: '跨境技术转移与科技成果产业化',
      subtitle: 'Cross-Border Technology Transfer & Spin-Offs',
      lead: '依托全国 50+ 国家大学科技园与高校独资资产经营平台，打通海外高精尖技术的中国在地概念验证、二次工程化中试与产业集群落地。',
      targetAudience: '海外高校科技转移办公室 (TTO)、跨国科研团队、早期高技术创新实体',
      phases: [
        { label: '概念验证 (PoC)', desc: '在华高校中试车间与概念验证工场试点评估' },
        { label: '合规确权', desc: '涉外知识产权归属协议、双向合规审查与估值保障' },
        { label: '园区产业化', desc: '直通国家级高新区、大学科技园与产业投资母基金' },
      ],
      deliverables: '国际技术转移框架协议 (MoU) · 中试落地实施报告 · 知识产权共有权益协定',
    },
    {
      code: 'CAP-02',
      title: '国际高层次人才交流与双向访问',
      subtitle: 'Academic Visits & Executive Fellowships',
      lead: '构建中国高校领军产业家、资深技术经理人与海外名校教授、国际工程院院士之间的机制化双向访学体系与专题研讨通道。',
      targetAudience: '国际知名学者、跨国技术转移经理人、高校产业分管主管、青年骨干科学家',
      phases: [
        { label: '高级访学', desc: '双向高研班、海外大学科技园与中国科技园区走访' },
        { label: '特聘顾问', desc: '建立国专委海外特聘产业顾问与成果转化导师库' },
        { label: '联合课题', desc: '青年学者跨国工程实践与国际产学研博士后联合培养' },
      ],
      deliverables: '官方国际访学证明 · 特聘产业专家聘书 · 产学研交流备忘录',
    },
    {
      code: 'CAP-03',
      title: '跨国联合研究中心与项目攻关',
      subtitle: 'Joint Research Centers & Consortia',
      lead: '协助海外顶尖学府与中国工科、理科、医科顶级高校建立受两国政策支持的高标准联合实验室与联合创新中心，协同攻克世界级产业技术瓶颈。',
      targetAudience: '全球排名前列综合大学、国家级科学实验室、跨国企业研发总部',
      phases: [
        { label: '机制备案', desc: '协助联合实验室方案编制、学校立项与官方行政备案' },
        { label: '重大攻关', desc: '双边多边国际科技合作重点研发计划组织申报' },
        { label: '研讨对话', desc: '定期举办闭门技术圆桌与年度学术路演大会' },
      ],
      deliverables: '联合实验室章程 · 联合攻关协议 · 双边知识产权保护备忘录',
    },
    {
      code: 'CAP-04',
      title: '国际化产教融合与实验室共建',
      subtitle: 'Co-Built Labs & Joint Curricula',
      lead: '联合跨国工程技术集团与国际学术协会，共建契合国际工程教育华盛顿协议标准的三维虚拟仿真教学工场与工程实践基地。',
      targetAudience: '跨国产业巨头、国际工程教育认证机构、海外应用科技大学',
      phases: [
        { label: '标准共建', desc: '制定面向全球高校产业的 T/CAUI 国际产教融合团体标准' },
        { label: '云端实训', desc: '共建新能源、智能制造与工业互联数字孪生云实训室' },
        { label: '蓝皮书发布', desc: '年度发布中国高校校办产业国际化发展战略报告' },
      ],
      deliverables: '共建教学大纲规范 · 国际实践基地官方授牌 · T/CAUI 团体标准文本',
    },
  ];

  // H-05: 合作落地 5 阶段叙事时间轴
  const TRAJECTORY_STAGES = [
    {
      id: '01',
      title: '提交合作意向',
      subtitle: 'Intent Submission',
      desc: '海外高校、机构或企业在线提交标准化意向书，系统化阐述合作诉求、技术领域成熟度 (TRL) 及意向对接院校类型。',
      sla: '1-3 工作日响应',
      authority: '国专委秘书处外事联络部',
    },
    {
      id: '02',
      title: '涉外合规与可行性审验',
      subtitle: 'Compliance Assessment',
      desc: '国专委法务及外事工作组依据教育部指导规范与协会章程，核验合作主体法定资质，排查涉外合规风险。',
      sla: '3-5 工作日初审',
      authority: '涉外合规审查委员会',
    },
    {
      id: '03',
      title: '全国高校网络精准撮合',
      subtitle: 'Network Matching',
      desc: '依托 180+ 高校产业与科技园智库库，定向筛选学科最匹配的大学资产平台、重点实验室或科技园，组织双向意向摸底。',
      sla: '5-7 工作日反馈',
      authority: '高校科技协同专家库',
    },
    {
      id: '04',
      title: '双边官方对话与保密协议',
      subtitle: 'Dialogue & NDA Execution',
      desc: '组织双方法务与技术带头人召开官方视频沟通会，依法缔结受国际知识产权法保护的双边保密协议 (NDA) 与意向纪要。',
      sla: '双向排期推进',
      authority: '国专委专职协调小组',
    },
    {
      id: '05',
      title: '正式缔约签约与常态落地',
      subtitle: 'MoU & Formal Signing',
      desc: '正式签署官方合作备忘录 (MoU) 或项目投资合作协议，纳入国专委年度国家产学研跟踪评估池，享受全生命周期在地护航。',
      sla: '常态化机制跟进',
      authority: '国际合作项目管理处',
    },
  ];

  return (
    <div className="flex flex-col bg-white text-[#1A1A1A] selection:bg-[#E9F0F8] selection:text-[#1B4F8C]">
      {/* ─────────────────────────────────────────────────────────────
          H-01 HERO: FULL-WIDTH EDITORIAL HORIZON & ACTION PORTALS
          设计突破：彻底废除左文右图两栏网格，采用顶级学术出版物封面排版与全景双门户基座
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#FFFFFF] border-b border-slate-200/90 pt-8 sm:pt-12 lg:pt-16 overflow-hidden">
        {/* 背景微精密度量经纬度标尺纹理 */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="horizon-ruler" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#000" strokeWidth="1" />
                <path d="M 0 50 L 15 50" stroke="#000" strokeWidth="0.75" />
                <path d="M 50 0 L 50 15" stroke="#000" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#horizon-ruler)" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 1. 顶部学术标尺天际线 (Top Institutional Coordinate Bar) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-10 lg:mb-14 border-b border-slate-200/80 gap-3 font-mono text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1B4F8C] animate-pulse shrink-0" />
              <span className="font-bold text-[#1A1A1A] tracking-wider uppercase">
                INSTITUTION // CAUIICE
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-slate-600 hidden sm:inline">
                中国高校校办产业协会国际合作与交流专业委员会
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>BEIJING · 39°59&apos;N 116°19&apos;E</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#1B4F8C] font-semibold">GLOBAL COLLABORATION GATEWAY</span>
            </div>
          </div>

          {/* 2. 居中全景大字阶命题 (Monolith Statement) */}
          <div className="space-y-6 max-w-4xl mx-auto text-center py-4 sm:py-6 lg:py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E9F0F8] text-[#1B4F8C] text-xs font-mono font-semibold uppercase tracking-widest">
              <span>OFFICIAL CHINESE UNIVERSITY INDUSTRY NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.12]">
              连接中国高水平大学产业网络
              <span className="block text-[#0F3A6B] mt-2 font-bold text-2xl sm:text-4xl lg:text-[46px]">
                与全球前沿科技协同生态
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#595959] leading-relaxed max-w-2xl mx-auto font-normal pt-2">
              聚合全国 180+ 重点高校科技园与校办高新产业集群。受教育部业务指导，面向全球知名学府、顶尖科研机构与跨国产业伙伴，建立高合规、可信赖的国际科技合作官方直连通道。
            </p>
          </div>

          {/* 3. 极简横向服务范畴指示带 (The Four Pillars Indicator Rail) */}
          <div className="mt-8 mb-14 py-4 border-y border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center font-mono text-xs text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#1B4F8C] font-bold">01.</span>
              <span className="font-sans font-medium text-[#1A1A1A]">校际联合实验室共建</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#1B4F8C] font-bold">02.</span>
              <span className="font-sans font-medium text-[#1A1A1A]">跨境技术成果中试熟化</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#1B4F8C] font-bold">03.</span>
              <span className="font-sans font-medium text-[#1A1A1A]">跨国企业联合定向研发</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#1B4F8C] font-bold">04.</span>
              <span className="font-sans font-medium text-[#1A1A1A]">国际产教融合团体标准</span>
            </div>
          </div>
        </div>

        {/* 4. 全景式双行动门户基座 (The Panoramic Action Portals) - 咬合首屏底边 */}
        <div className="border-t border-slate-200 grid grid-cols-1 md:grid-cols-2">
          {/* 主门户 01: 提交合作意向 */}
          <Link
            href="/en/cooperation/enquiry"
            className="group relative p-8 sm:p-10 lg:p-12 bg-[#0F3A6B] hover:bg-[#1B4F8C] text-white transition-all flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-700/50"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-slate-300 mb-4">
                <span className="tracking-widest uppercase font-bold">PORTAL 01 // PRIMARY ACTION</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 group-hover:translate-x-1 transition-transform flex items-center justify-between">
                <span>提交国际合作意向</span>
                <span className="text-2xl font-light">→</span>
              </h2>
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-3">
                SUBMIT PARTNERSHIP ENQUIRY
              </div>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-md font-sans">
                面向海外大学科技办、前沿科研团队及跨国企业，在线登记技术诉求。专职秘书处将在 3 个工作日内核验并启动双向直联。
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between text-xs font-mono text-slate-300">
              <span>SLA: 3 WORKING DAYS</span>
              <span className="font-bold text-white group-hover:underline">立即开启在线登记 →</span>
            </div>
          </Link>

          {/* 次门户 02: 了解官方合作机制 */}
          <Link
            href="/en/cooperation"
            className="group relative p-8 sm:p-10 lg:p-12 bg-slate-50 hover:bg-[#E9F0F8]/60 text-[#1A1A1A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-4">
                <span className="tracking-widest uppercase font-bold text-[#1B4F8C]">PORTAL 02 // GOVERNANCE &amp; FRAMEWORK</span>
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#1B4F8C] transition-colors" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] mb-2 group-hover:translate-x-1 transition-transform flex items-center justify-between">
                <span>了解官方合作机制</span>
                <span className="text-2xl font-light text-[#1B4F8C]">→</span>
              </h2>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                EXPLORE COLLABORATION MODALITIES
              </div>
              <p className="text-xs sm:text-sm text-[#595959] leading-relaxed max-w-md font-sans">
                深入了解国专委四大合作方向、全国大学科技园中试载体布局、受法律保护的知识产权协议与双向保密机制 (NDA)。
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>LEGAL PROTOCOL: PROTECTED IP</span>
              <span className="font-bold text-[#1B4F8C] group-hover:underline">浏览完整业务框架 →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-02 WHO WE ARE: INSTITUTIONAL MANIFEST & PRINCIPLES
          特点：巨幅章节导言、瑞士网格式纲领列表，拒绝普通白卡片
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* 左侧：机构宣言与权威定调 (5 栏) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#1B4F8C] font-bold uppercase tracking-wider">
                <span>02 // INSTITUTIONAL IDENTITY</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
                立足中国高校产业
                <span className="block text-slate-500 text-xl sm:text-2xl font-normal mt-1">
                  服务全球科技创新的权威专业组织
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#595959] leading-relaxed">
                {committee.overview}
              </p>

              {/* 组织合规印记 */}
              <div className="p-4 bg-slate-50 border-l-2 border-[#1B4F8C] text-xs font-mono text-[#595959] space-y-1">
                <div className="font-bold text-[#1A1A1A]">法定性质与组织属性说明：</div>
                <p className="font-sans leading-relaxed text-slate-600">
                  {committee.affiliation}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/en/about/committee"
                  className="inline-flex items-center text-xs font-mono font-bold text-[#1155CC] hover:underline"
                >
                  <span>阅读国专委章程与法定工作规则</span>
                  <span className="ml-1.5">→</span>
                </Link>
              </div>
            </div>

            {/* 右侧：结构化公理清单 (Editorial Structured Index) (7 栏) */}
            <div className="lg:col-span-7 divide-y divide-slate-200 border-t border-b border-slate-200">
              <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-2 font-mono text-xl font-light text-[#1B4F8C]">
                  01.
                </div>
                <div className="sm:col-span-10 space-y-1.5">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    全国重点高校产业网络直达
                  </h3>
                  <p className="text-xs text-[#595959] leading-relaxed">
                    直接穿透全国双一流高校资产经营投资平台、校办骨干高科技产业集团与技术转移中心，避免多重中间中介，建立直达官方决策层的信任管道。
                  </p>
                </div>
              </div>

              <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-2 font-mono text-xl font-light text-[#1B4F8C]">
                  02.
                </div>
                <div className="sm:col-span-10 space-y-1.5">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    50+ 国家级大学科技园实体载体赋能
                  </h3>
                  <p className="text-xs text-[#595959] leading-relaxed">
                    依托全国 50 余家国家大学科技园物理载体，为海外先进技术在华概念验证、中试放大、合规审批与落地注册提供高标准的科研空间与政策辅导。
                  </p>
                </div>
              </div>

              <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-2 font-mono text-xl font-light text-[#1B4F8C]">
                  03.
                </div>
                <div className="sm:col-span-10 space-y-1.5">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    受严格法律保护的涉外知识产权 (IP) 机制
                  </h3>
                  <p className="text-xs text-[#595959] leading-relaxed">
                    严格执行涉外产学研合规标准与双向保密协议 (NDA) 机制，全程明确中外双方在技术转让、联合研发中的成果归属与权益分配，守牢合规底线。
                  </p>
                </div>
              </div>

              <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-2 font-mono text-xl font-light text-[#1B4F8C]">
                  04.
                </div>
                <div className="sm:col-span-10 space-y-1.5">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    学术智库洞察与国际产教团体标准共建
                  </h3>
                  <p className="text-xs text-[#595959] leading-relaxed">
                    汇聚百所高校权威产业带头人与法务学者，定期发布中国高校科技成果跨境出海白皮书，牵头起草具有全球影响力的 T/CAUI 国际产教融合团体标准。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-03 NETWORK IN NUMBERS: THE METRIC WALL (超大数据墙)
          特点：巨型无衬线等宽数字、学术审计标尺、非传统卡片
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* 审计口径标尺头 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-12 border-b border-slate-200 gap-3 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1B4F8C] uppercase">
                03 // QUANTITATIVE BASELINE &amp; METRICS
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>SCOPE: NATIONAL HIGHER-ED ENTERPRISE DATASET</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#1A1A1A] font-semibold">AUDIT CUTOFF: 2026 FISCAL</span>
            </div>
          </div>

          {/* 4 维大型数据雕塑网格 (跨越栏线) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                METRIC // 001
              </span>
              <div className="text-6xl sm:text-7xl font-extralight font-mono text-[#0F3A6B] tracking-tighter leading-none">
                180<span className="text-4xl text-[#1B4F8C] font-normal">+</span>
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] pt-1">
                重点高校校办产业平台
              </div>
              <p className="text-xs text-[#595959] leading-relaxed">
                覆盖全国双一流大学资产经营投资公司与控股产业实体网络。
              </p>
            </div>

            <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                METRIC // 002
              </span>
              <div className="text-6xl sm:text-7xl font-extralight font-mono text-[#0F3A6B] tracking-tighter leading-none">
                35<span className="text-4xl text-[#1B4F8C] font-normal">+</span>
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] pt-1">
                覆盖国家与地区伙伴
              </div>
              <p className="text-xs text-[#595959] leading-relaxed">
                常态化协同欧洲、北美、东亚、东南亚及一带一路共建国家高校与机构。
              </p>
            </div>

            <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                METRIC // 003
              </span>
              <div className="text-6xl sm:text-7xl font-extralight font-mono text-[#0F3A6B] tracking-tighter leading-none">
                320<span className="text-4xl text-[#1B4F8C] font-normal">+</span>
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] pt-1">
                跨国协同与转化示范项目
              </div>
              <p className="text-xs text-[#595959] leading-relaxed">
                聚焦高端智能制造、绿色储能、生物制药及新一代电子信息技术。
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                METRIC // 004
              </span>
              <div className="text-6xl sm:text-7xl font-extralight font-mono text-[#0F3A6B] tracking-tighter leading-none">
                50<span className="text-4xl text-[#1B4F8C] font-normal">+</span>
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] pt-1">
                国家级大学科技园基地
              </div>
              <p className="text-xs text-[#595959] leading-relaxed">
                具备概念验证工场、中试放大车间与全方位在地科技孵化配套。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-04 WHAT WE CAN DO: INTERACTIVE CAPABILITY DOSSIER
          特点：左侧垂直目录 + 右侧学术档案卷宗沉浸式展开
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono text-[#1B4F8C] font-bold uppercase tracking-wider mb-2">
                04 // OPERATIONAL CAPABILITIES &amp; MODALITIES
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                四大跨国产学研合作能力体系
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#595959] max-w-md">
              根据不同类型合作伙伴的发展战略诉求，匹配全流程定制化实施路径。
            </p>
          </div>

          {/* 交互式能力卷宗 (Capability Dossier) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左侧垂直目录 (4 栏) */}
            <div className="lg:col-span-4 border border-slate-200 divide-y divide-slate-200 bg-white">
              {CAPABILITY_INDEX.map((cap, idx) => (
                <button
                  key={cap.code}
                  type="button"
                  onClick={() => setActiveCapIdx(idx)}
                  className={`w-full text-left p-5 transition-all flex items-start gap-4 ${
                    activeCapIdx === idx
                      ? 'bg-[#0F3A6B] text-white'
                      : 'hover:bg-slate-50 text-[#1A1A1A]'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold pt-0.5 ${
                      activeCapIdx === idx ? 'text-white' : 'text-[#1B4F8C]'
                    }`}
                  >
                    {cap.code}
                  </span>
                  <div className="space-y-1">
                    <div className="text-sm font-bold leading-snug">
                      {cap.title}
                    </div>
                    <div
                      className={`text-[11px] font-mono leading-tight ${
                        activeCapIdx === idx ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {cap.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 右侧学术案卷展台 (8 栏) */}
            <div className="lg:col-span-8 border border-slate-200 bg-slate-50/50 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-[#1B4F8C]">
                    DOSSIER SPECIFICATION // {CAPABILITY_INDEX[activeCapIdx].code}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1">
                    {CAPABILITY_INDEX[activeCapIdx].title}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {CAPABILITY_INDEX[activeCapIdx].subtitle}
                  </div>
                </div>

                <Link
                  href="/en/cooperation/enquiry"
                  className="px-5 py-2.5 bg-[#0F3A6B] hover:bg-[#1B4F8C] text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors shadow-2xs text-center"
                >
                  申请该方向对接 →
                </Link>
              </div>

              <p className="text-sm text-[#595959] leading-relaxed">
                {CAPABILITY_INDEX[activeCapIdx].lead}
              </p>

              {/* 适用对象 */}
              <div className="p-3.5 bg-white border border-slate-200 text-xs">
                <span className="font-mono font-bold text-[#1B4F8C]">TARGET AUDIENCE //</span>
                <span className="text-slate-700 ml-2">{CAPABILITY_INDEX[activeCapIdx].targetAudience}</span>
              </div>

              {/* 实施阶段三阶梯 */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                  THREE-TIER EXECUTION RUNWAY (实施路径)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CAPABILITY_INDEX[activeCapIdx].phases.map((p, idx) => (
                    <div
                      key={p.label}
                      className="bg-white p-4 border border-slate-200 space-y-1.5 flex flex-col justify-between"
                    >
                      <span className="font-mono text-[10px] text-[#1B4F8C] font-bold">
                        PHASE 0{idx + 1}
                      </span>
                      <div className="text-xs font-bold text-[#1A1A1A]">{p.label}</div>
                      <p className="text-[11px] text-[#595959] leading-snug">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 标准交付成果 */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 font-mono">
                <div>
                  <span className="font-bold text-[#1A1A1A]">STANDARD DELIVERABLES:</span>
                  <span className="text-slate-600 ml-1.5 font-sans">{CAPABILITY_INDEX[activeCapIdx].deliverables}</span>
                </div>
                <Link href="/en/cooperation" className="text-[#1155CC] font-bold hover:underline shrink-0">
                  查阅详细业务机制 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-05 HOW IT WORKS: COOPERATION JOURNEY & TRAJECTORY
          特点：大科学工程级进度轴、清晰阶段时效、责任部门与产出
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono text-[#1B4F8C] font-bold uppercase tracking-wider mb-2">
                05 // COOPERATION TRAJECTORY &amp; GOVERNANCE
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                五阶段全流程合作推进轨线
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#595959] max-w-md">
              从意向登记到实体协议签署，全流程透明化、制度化、高合规推进。
            </p>
          </div>

          {/* 5 阶段叙事时间轴 */}
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {TRAJECTORY_STAGES.map((stage) => (
              <div
                key={stage.id}
                className="py-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start hover:bg-slate-50/50 transition-colors"
              >
                <div className="sm:col-span-2 font-mono space-y-1">
                  <div className="text-2xl font-light text-[#0F3A6B]">
                    STAGE {stage.id}
                  </div>
                  <div className="text-[11px] text-[#1B4F8C] font-semibold">
                    {stage.sla}
                  </div>
                </div>

                <div className="sm:col-span-6 space-y-2">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {stage.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">
                    {stage.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#595959] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="sm:col-span-4 text-xs font-mono text-slate-500 sm:text-right space-y-1 pt-1 sm:pt-0">
                  <div className="text-slate-400 text-[10px]">RESPONSIBILITY LEAD:</div>
                  <div className="font-bold text-[#1A1A1A]">{stage.authority}</div>
                  <div className="text-[11px] text-[#1155CC] pt-1">官方双向加密流转通道</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/en/cooperation/enquiry"
              className="inline-flex items-center text-xs font-mono font-bold text-[#1B4F8C] hover:underline"
            >
              <span>启动合作流程第一阶段：在线登记合作诉求</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-06 MEMBER DISTRIBUTION: REGIONAL NETWORK ATLAS & CENSUS
          特点：学术制图学拓扑 + 区域密度普查，支持携带 region 参数筛选
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono text-[#1B4F8C] font-bold uppercase tracking-wider mb-2">
                06 // REGIONAL DENSITY &amp; INNOVATION CORRIDORS
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                全国高校科技创新集群分布网络
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#595959] max-w-md">
              围绕四大国家战略级创新走廊，辐射全国骨干大学科技园与高新成果策源地。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 左侧：学术地理制图学拓扑 (5 栏) */}
            <div className="lg:col-span-5 border border-slate-200 bg-white p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono">
                <span className="font-bold text-[#1B4F8C]">GEOGRAPHIC NETWORK ATLAS</span>
                <span className="text-slate-400">STATIC CENSUS</span>
              </div>

              {/* 经纬度矢量示意拓扑 */}
              <div className="relative w-full max-w-[320px] mx-auto aspect-4/3 my-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full text-[#1B4F8C]/15"
                  fill="currentColor"
                >
                  <path d="M 120 40 Q 180 30 240 50 Q 300 70 340 120 Q 360 170 320 220 Q 280 260 210 270 Q 140 280 80 230 Q 40 180 50 120 Q 70 60 120 40 Z" />
                  <path d="M 280 230 Q 320 250 350 280 Q 330 290 300 270 Z" />
                </svg>

                {/* 四大核心走廊标识 */}
                <div className="absolute top-[30%] left-[62%] flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F3A6B] ring-2 ring-white" />
                  <span className="bg-[#0F3A6B] text-white text-[10px] font-mono px-2 py-0.5 shadow-xs font-bold">
                    京津冀极核 48
                  </span>
                </div>

                <div className="absolute top-[52%] left-[72%] flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4F8C] ring-2 ring-white" />
                  <span className="bg-[#1B4F8C] text-white text-[10px] font-mono px-2 py-0.5 shadow-xs font-bold">
                    长三角极核 82
                  </span>
                </div>

                <div className="absolute top-[75%] left-[65%] flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4F8C] ring-2 ring-white" />
                  <span className="bg-[#1B4F8C] text-white text-[10px] font-mono px-2 py-0.5 shadow-xs font-bold">
                    大湾区极核 28
                  </span>
                </div>

                <div className="absolute top-[48%] left-[40%] flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="bg-slate-700 text-white text-[10px] font-mono px-1.5 py-0.5 shadow-xs">
                    中西部基地 36
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-mono">
                注：静态创新地理图谱，点击右侧名录直通对应省份成员筛选
              </div>
            </div>

            {/* 右侧：区域密度详细名录 (7 栏) */}
            <div className="lg:col-span-7 space-y-3 font-mono">
              <div className="text-xs text-[#1B4F8C] uppercase font-bold tracking-wider mb-2">
                INDEXED REGIONAL DENSITIES // 点击区域进行名录检索
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 bg-white">
                {REGION_DISTRIBUTION.map((item) => (
                  <Link
                    key={item.code}
                    href={`/en/network/members?region=${encodeURIComponent(item.code)}`}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold font-sans text-sm text-[#1A1A1A] group-hover:text-[#1B4F8C] transition-colors">
                        <span>{item.name}</span>
                        <span className="text-xs font-mono font-bold text-[#1B4F8C] bg-[#E9F0F8] px-2 py-0.5">
                          {item.count} 家
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#595959] line-clamp-1">
                        {item.featuredInstitutions.join(' · ')}
                      </p>
                    </div>

                    <div className="text-xs text-[#1155CC] font-bold shrink-0 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>查阅该区域名单</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/en/network/members"
                  className="text-xs font-bold text-[#1B4F8C] hover:underline"
                >
                  浏览全部 180+ 会员单位完整官方名录 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-07 OPEN NOW: ACTIVE RESEARCH DOSSIERS & OPPORTUNITIES
          特点：学术案卷目录、非普通招聘卡片、大号编号与规范元数据
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono text-[#1B4F8C] font-bold uppercase tracking-wider mb-2">
                07 // OPEN RESEARCH OPPORTUNITIES
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                正在开放对接的国际合作项目案卷
              </h2>
            </div>
            <Link
              href="/en/cooperation/projects"
              className="inline-flex items-center text-xs font-mono font-bold text-[#1B4F8C] hover:underline shrink-0"
            >
              浏览全部合作项目库 (View All Projects) →
            </Link>
          </div>

          {/* 案卷目录网格 (最多 3 个) */}
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {openProjects.map((project, idx) => (
              <div
                key={project.id}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-slate-50/50 transition-colors"
              >
                {/* 案卷编号与状态 (3 栏) */}
                <div className="lg:col-span-3 font-mono space-y-2">
                  <div className="text-xs font-bold text-slate-400">
                    DOSSIER // 00{idx + 1}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>招募中 (Open)</span>
                  </div>
                  <div className="text-xs text-slate-500 pt-1">
                    领域: <span className="font-bold text-[#1B4F8C]">{project.fieldName}</span>
                  </div>
                </div>

                {/* 案卷主文案 (6 栏) */}
                <div className="lg:col-span-6 space-y-2">
                  <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595959] leading-relaxed">
                    {project.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                    <div>
                      牵头平台: <span className="text-[#1A1A1A] font-semibold">{project.leadInstitution}</span>
                    </div>
                    <div>
                      目标合作区域: <span className="text-[#1A1A1A] font-semibold">{project.targetRegion}</span>
                    </div>
                  </div>
                </div>

                {/* 操作与截止时间 (3 栏) */}
                <div className="lg:col-span-3 text-left lg:text-right font-mono space-y-3">
                  <div className="text-xs text-slate-400">
                    {project.deadline ? `截止: ${project.deadline}` : `发布: ${project.date}`}
                  </div>
                  <Link
                    href={`/en/cooperation/enquiry?project=${encodeURIComponent(project.id)}`}
                    className="inline-flex items-center px-4 py-2 bg-[#0F3A6B] hover:bg-[#1B4F8C] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>申请项目对接</span>
                    <span className="ml-1.5">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H-08 INVITATION: THE CLOSING STATEMENT (极简大尺度闭幕宣言)
          特点：深蓝 `#0F3A6B` 殿堂级排版、无大卡片廉价感、双核心操作锚点
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F3A6B] text-white py-24 lg:py-36 relative overflow-hidden">
        {/* 背景极简建筑网格线条 */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="invitation-lines" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="60" y2="0" stroke="white" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#invitation-lines)" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <div className="inline-block text-xs font-mono font-bold tracking-widest uppercase text-slate-300 border border-white/20 px-3 py-1">
            08 // CLOSING STATEMENT &amp; DIALOGUE
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm font-mono tracking-widest text-slate-300 uppercase">
              CONNECTING RESEARCH. TRANSLATING DISCOVERY. BUILDING THE FUTURE.
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              开启与中国高校产业科技生态的深度合作对话
            </h2>
          </div>

          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            无论是共建跨国联合实验室、申报重大双边产业技术攻关，还是推动前沿技术在华概念验证，国专委秘书处将为您提供最严谨、可信赖的官方资源对接通道。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/en/cooperation/enquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#0F3A6B] hover:bg-slate-100 transition-all shadow-md"
            >
              提交合作意向 (Submit Partnership Enquiry) →
            </Link>
            <Link
              href="/en/cooperation"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-sm text-xs font-mono font-semibold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 transition-all"
            >
              了解合作机制 (Explore Framework)
            </Link>
          </div>

          {/* 官方信诺印记 */}
          <div className="pt-12 border-t border-white/15 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-300 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>3 个工作日内专人响应</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>先行签署双向 NDA 保密协定</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>中国高校校办产业协会分支机构</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface ActivityItem {
  id: string;
  type: string;
  tagColor: string;
  title: string;
  operator: string;
  time: string;
  status: string;
  href: string;
  timestamp: number;
}

export default function AdminDashboardOverviewPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 核心统计指标
  const [stats, setStats] = useState({
    newsCount: 0,
    publishedNewsCount: 0,
    projectsCount: 0,
    recruitingProjectsCount: 0,
    membersCount: 0,
    enquiriesCount: 0,
    pendingEnquiriesCount: 0,
    uniqueCountriesCount: 0,
  });

  // 最新业务入库动态流
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    let newsData: any[] = [];
    let projectsData: any[] = [];
    let membersData: any[] = [];
    let enquiriesData: any[] = [];

    const updateOverview = () => {
      // 1. 真实数据统计计算
      const newsCount = newsData.length;
      const publishedNewsCount = newsData.filter((n) => n.published !== false).length;

      const projectsCount = projectsData.length;
      const recruitingProjectsCount = projectsData.filter(
        (p) => (p.status || '').toLowerCase().includes('recruiting') || (p.status || '').toLowerCase().includes('招募')
      ).length;

      const uniqueCountries = new Set(
        projectsData.map((p) => p.targetRegion || p.target || p.country).filter(Boolean)
      );
      const uniqueCountriesCount = uniqueCountries.size;

      const membersCount = membersData.length;

      const enquiriesCount = enquiriesData.length;
      const pendingEnquiriesCount = enquiriesData.filter(
        (e) => e.status === 'pending' || e.status === 'new'
      ).length;

      setStats({
        newsCount,
        publishedNewsCount,
        projectsCount,
        recruitingProjectsCount,
        membersCount,
        enquiriesCount,
        pendingEnquiriesCount,
        uniqueCountriesCount,
      });

      // 2. 汇聚各模块最新业务动态
      const activities: ActivityItem[] = [];

      enquiriesData.slice(0, 4).forEach((item) => {
        activities.push({
          id: `enquiry-${item.id}`,
          type: '合作意向',
          tagColor: 'bg-indigo-100 text-indigo-800',
          title: item.institution ? `${item.institution} (${item.contactName || '联系人'})` : '新合作意向提交',
          operator: item.cooperationCategoryCode || '意向申请',
          time: item.createdAt?.seconds
            ? new Date(item.createdAt.seconds * 1000).toISOString().split('T')[0]
            : '最新',
          status: item.status === 'pending' || item.status === 'new' ? '待初审' : (item.status || '已建联'),
          href: '/admin/dashboard/enquiries',
          timestamp: item.createdAt?.seconds ? item.createdAt.seconds * 1000 : Date.now(),
        });
      });

      newsData.slice(0, 3).forEach((item) => {
        const cat = item.category || 'work_updates';
        const catName =
          item.categoryName ||
          (cat === 'events' ? '会议与活动' : cat === 'policy_insights' ? '政策与观察' : '工作动态');

        activities.push({
          id: `news-${item.id}`,
          type: '新闻动态',
          tagColor: 'bg-blue-100 text-blue-800',
          title: item.title || '未命名新闻',
          operator: catName,
          time: item.date || '最新',
          status: item.published !== false ? '已发布' : '草稿',
          href: '/admin/dashboard/news',
          timestamp: item.createdAt?.seconds
            ? item.createdAt.seconds * 1000
            : new Date(item.date || 0).getTime(),
        });
      });

      projectsData.slice(0, 3).forEach((item) => {
        activities.push({
          id: `project-${item.id}`,
          type: '国际合作',
          tagColor: 'bg-purple-100 text-purple-800',
          title: item.title || item.name || '未命名项目',
          operator: item.targetRegion || item.target || '国际合作',
          time: item.date || item.period || '推进中',
          status: item.status || '招募中',
          href: '/admin/dashboard/projects',
          timestamp: item.createdAt?.seconds ? item.createdAt.seconds * 1000 : 0,
        });
      });

      membersData.slice(0, 3).forEach((item) => {
        activities.push({
          id: `member-${item.id}`,
          type: '会员网络',
          tagColor: 'bg-amber-100 text-amber-800',
          title: item.name || '未命名会员机构',
          operator: item.regionName || item.region || '全国网络',
          time: item.established ? `${item.established} 年成立` : '已入册',
          status: item.typeName || item.type || '已入册',
          href: '/admin/dashboard/members',
          timestamp: item.createdAt?.seconds ? item.createdAt.seconds * 1000 : 0,
        });
      });

      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(activities.slice(0, 8));
      setLoading(false);
    };

    let unsubNews: () => void = () => {};
    let unsubProjects: () => void = () => {};
    let unsubMembers: () => void = () => {};
    let unsubEnquiries: () => void = () => {};

    try {
      unsubNews = onSnapshot(collection(db, 'news'), (snap) => {
        newsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        updateOverview();
      });

      unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        projectsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        updateOverview();
      });

      unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
        membersData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        updateOverview();
      });

      unsubEnquiries = onSnapshot(collection(db, 'enquiries'), (snap) => {
        enquiriesData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        updateOverview();
      });
    } catch (err) {
      console.warn('[Admin Dashboard] Snapshot setup note:', err);
    }

    return () => {
      clearTimeout(timer);
      unsubAuth();
      unsubNews();
      unsubProjects();
      unsubMembers();
      unsubEnquiries();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 欢迎与前台快速链接条 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              CAUIICE 英文站管理控制台
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
              cauiice-site-en
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            欢迎您，{currentUser?.email || '管理员'}！当前系统专职管理 CAUIICE 英文门户的核心内容与海外商洽数据。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/en"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>访问英文门户前台</span>
            <span className="text-[11px]">↗</span>
          </Link>
        </div>
      </div>

      {/* 四大核心业务指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 新闻资讯 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">新闻资讯发布</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">📰</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">{stats.newsCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>已发布: {stats.publishedNewsCount} 条</span>
              <Link href="/admin/dashboard/news" className="text-blue-700 hover:underline">
                管理 →
              </Link>
            </div>
          </div>
        </div>

        {/* 合作项目 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">国际合作项目库</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">🤝</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">{stats.projectsCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>招募/进行中: {stats.recruitingProjectsCount} 项</span>
              <Link href="/admin/dashboard/projects" className="text-purple-700 hover:underline">
                管理 →
              </Link>
            </div>
          </div>
        </div>

        {/* 会员网络 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">会员与伙伴网络</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">🏛️</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">{stats.membersCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>全国重点高校产业与科技园</span>
              <Link href="/admin/dashboard/members" className="text-amber-700 hover:underline">
                管理 →
              </Link>
            </div>
          </div>
        </div>

        {/* 合作意向询盘 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">合作意向询盘</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">✉️</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-indigo-900 font-mono">{stats.enquiriesCount}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span className="text-amber-600 font-semibold">待初审: {stats.pendingEnquiriesCount} 条</span>
              <Link href="/admin/dashboard/enquiries" className="text-indigo-700 hover:underline">
                审阅 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷业务直通入口 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">快捷管理通道 (Quick Actions)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <Link
            href="/admin/dashboard/news"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-800 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">发布新闻动态</div>
            <div className="text-[11px] text-slate-500 mt-1">更新工作进展与活动</div>
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-800 hover:bg-purple-50/30 transition-all flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">发布合作项目</div>
            <div className="text-[11px] text-slate-500 mt-1">招募跨国中试联合体</div>
          </Link>
          <Link
            href="/admin/dashboard/members"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-800 hover:bg-amber-50/30 transition-all flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">入册会员机构</div>
            <div className="text-[11px] text-slate-500 mt-1">录入高校产业平台名录</div>
          </Link>
          <Link
            href="/admin/dashboard/enquiries"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-800 hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">处理海外询盘</div>
            <div className="text-[11px] text-slate-500 mt-1">跟进合作意向与初审</div>
          </Link>
          <Link
            href="/admin/dashboard/profile"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">站点组织配置</div>
            <div className="text-[11px] text-slate-500 mt-1">维护架构与联系方式</div>
          </Link>
        </div>
      </div>

      {/* 实时业务动态动态流 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">最新业务入库动态 (Recent Activities)</h2>
          <span className="text-[11px] text-slate-400">实时监听 Firestore 数据库事件</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">正在同步数据...</div>
        ) : recentActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">暂无最新动态记录</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${act.tagColor}`}>
                    {act.type}
                  </span>
                  <Link
                    href={act.href}
                    className="font-bold text-slate-800 hover:text-blue-800 truncate transition-colors"
                  >
                    {act.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
                  <span className="hidden sm:inline">{act.operator}</span>
                  <span className="font-mono">{act.time}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ProjectCard from '@/components/en/ProjectCard';
import FilterBar, { FilterGroup } from '@/components/en/FilterBar';
import { PROJECTS_DATA, ProjectItem } from '@/lib/enData';
import { fetchEnglishProjects } from '@/lib/enFirestore';

function ProjectsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PROJECTS_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishProjects(50).then((data) => {
      if (active && data && data.length > 0) {
        setProjectsList(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 从 URL 读取当前筛选状态
  const currentStatus = searchParams.get('status') || 'all';
  const currentField = searchParams.get('field') || 'all';

  // 状态与领域筛选项定义
  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      name: '项目进度 (Status)',
      selectedValue: currentStatus,
      options: [
        { key: 'all', label: '全部进度 (All)' },
        { key: 'recruiting', label: '招募中 (Recruiting)' },
        { key: 'ongoing', label: '进行中 (Ongoing)' },
        { key: 'completed', label: '已完成 (Completed)' },
        { key: 'preparing', label: '筹备中 (Preparing)' },
      ],
    },
    {
      id: 'field',
      name: '技术领域 (Field)',
      selectedValue: currentField,
      options: [
        { key: 'all', label: '全部领域 (All)' },
        { key: 'smart_mfg', label: '智能制造' },
        { key: 'green_tech', label: '绿色低碳' },
        { key: 'biomedicine', label: '生物医药' },
        { key: 'ai', label: '人工智能' },
        { key: 'edutech', label: '教育科技' },
      ],
    },
  ];

  // 筛选事件：同步更新至 URL query parameters
  const handleFilterSelect = (groupId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(groupId);
    } else {
      params.set(groupId, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  // 过滤项目数据
  const filteredProjects = projectsList.filter((proj) => {
    const matchStatus = currentStatus === 'all' || proj.status === currentStatus;
    const matchField = currentField === 'all' || proj.field === currentField;
    return matchStatus && matchField;
  });

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <Link href="/en/cooperation" className="hover:text-[#1B4F8C]">Cooperation</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">Projects & Opportunities</span>
        </nav>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-3">
            国际合作项目库与机遇 (Projects & Opportunities)
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            展示中国高水平大学产业平台正在开放招募、联合攻关及落地孵化的重点跨国科技创新合作项目。支持按项目状态与领域多维检索。
          </p>
        </div>

        {/* 筛选条 (带 URL 同步) */}
        <div className="mb-8">
          <FilterBar
            groups={filterGroups}
            onSelect={handleFilterSelect}
            onReset={currentStatus !== 'all' || currentField !== 'all' ? handleReset : undefined}
          />
        </div>

        {/* 筛选结果概览 */}
        <div className="flex items-center justify-between text-xs text-[#595959] mb-6">
          <div>
            共检索到 <span className="font-bold text-[#1B4F8C]">{filteredProjects.length}</span> 项匹配合作项目
          </div>
          <Link
            href="/en/cooperation/enquiry"
            className="text-[#1155CC] font-semibold hover:underline"
          >
            未找到匹配项目？直接提交定制意向 →
          </Link>
        </div>

        {/* 项目卡片列表 */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              🔍
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">暂无匹配的合作项目</h3>
            <p className="text-xs text-[#595959] max-w-sm mx-auto">
              当前筛选条件下未检索到相关项目，您可以重置筛选条件或直接提交定制合作诉求。
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#1B4F8C] text-white text-xs font-semibold rounded-md hover:bg-[#0F3A6B]"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">正在加载合作项目库...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}

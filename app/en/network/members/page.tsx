'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import MemberCard from '@/components/en/MemberCard';
import FilterBar, { FilterGroup } from '@/components/en/FilterBar';
import { MEMBERS_DATA, MemberItem } from '@/lib/enData';
import { fetchEnglishMembers } from '@/lib/enFirestore';

function MembersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [membersList, setMembersList] = useState<MemberItem[]>(MEMBERS_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishMembers(100).then((data) => {
      if (active && data && data.length > 0) {
        setMembersList(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 从 URL 读取当前筛选状态
  const currentRegion = searchParams.get('region') || 'all';
  const currentType = searchParams.get('type') || 'all';

  // 筛选组定义
  const filterGroups: FilterGroup[] = [
    {
      id: 'region',
      name: '所在地区 (Region)',
      selectedValue: currentRegion,
      options: [
        { key: 'all', label: '全国全部地区 (All)' },
        { key: 'beijing', label: '北京 (Beijing)' },
        { key: 'shanghai', label: '上海 (Shanghai)' },
        { key: 'jiangsu', label: '江苏 (Jiangsu)' },
        { key: 'zhejiang', label: '浙江 (Zhejiang)' },
        { key: 'guangdong', label: '广东 (Guangdong)' },
        { key: 'other', label: '其他主要省份 (Other)' },
      ],
    },
    {
      id: 'type',
      name: '机构类型 (Type)',
      selectedValue: currentType,
      options: [
        { key: 'all', label: '全部机构类型 (All)' },
        { key: 'university', label: '重点高校产业' },
        { key: 'enterprise', label: '高校骨干企业' },
        { key: 'tech_park', label: '国家大学科技园' },
        { key: 'transfer_agency', label: '技术转移机构' },
      ],
    },
  ];

  // 筛选事件处理 (同步 URL)
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

  // 过滤成员数据
  const filteredMembers = membersList.filter((m) => {
    const matchRegion = currentRegion === 'all' || m.region === currentRegion;
    const matchType = currentType === 'all' || m.type === currentType;
    return matchRegion && matchType;
  });

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <Link href="/en/network" className="hover:text-[#1B4F8C]">Our Network</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">Members Directory</span>
        </nav>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-3">
            高校会员单位与伙伴名录 (Members Directory)
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            展示国专委覆盖的中国高水平大学产业平台、大学科技园与技术转移中枢。支持按省市地区与机构类型精准检索。
          </p>
        </div>

        {/* 筛选条 (带 URL 同步) */}
        <div className="mb-8">
          <FilterBar
            groups={filterGroups}
            onSelect={handleFilterSelect}
            onReset={currentRegion !== 'all' || currentType !== 'all' ? handleReset : undefined}
          />
        </div>

        {/* 统计提示 */}
        <div className="flex items-center justify-between text-xs text-[#595959] mb-6">
          <div>
            共筛选出 <span className="font-bold text-[#1B4F8C]">{filteredMembers.length}</span> 家骨干成员单位
          </div>
          <Link
            href="/en/network#join-us"
            className="text-[#1155CC] font-semibold hover:underline"
          >
            申请加入会员网络 →
          </Link>
        </div>

        {/* 成员卡片网格 */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              🏛️
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">暂无匹配的会员单位</h3>
            <p className="text-xs text-[#595959] max-w-sm mx-auto">
              当前地区或类型组合下暂未录入示范单位，您可以重置筛选条件。
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

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">正在加载会员名录...</div>}>
      <MembersContent />
    </Suspense>
  );
}

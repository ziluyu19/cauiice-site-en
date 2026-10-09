'use client';

import React from 'react';
import { MemberItem } from '@/lib/enData';

interface MemberCardProps {
  member: MemberItem;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all hover:border-[#1B4F8C]/60 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F0F8] text-[#1B4F8C]">
            {member.typeName}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            📍 {member.regionName}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#1A1A1A] leading-snug mb-2">
          {member.name}
        </h3>

        <p className="text-xs text-[#595959] leading-relaxed line-clamp-3 mb-4">
          {member.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {member.keyFields.map((field) => (
            <span
              key={field}
              className="px-2 py-0.5 text-[10px] rounded bg-slate-100 text-slate-600"
            >
              #{field}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{member.established ? `成立: ${member.established} 年` : '全国高校骨干成员'}</span>
          <span className="text-[#1B4F8C] font-semibold">官方认证成员</span>
        </div>
      </div>
    </div>
  );
}

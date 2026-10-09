'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/enData';

interface ProjectCardProps {
  project: ProjectItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusBadge = (status: ProjectItem['status']) => {
    switch (status) {
      case 'recruiting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            招募中 (Open)
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-[#1B4F8C] border border-blue-200">
            进行中 (Ongoing)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            已结项 (Closed)
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            筹备中 (Upcoming)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all hover:border-[#1B4F8C]/60 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-block px-2.5 py-0.5 bg-[#E9F0F8] text-[#1B4F8C] text-xs font-semibold rounded-md">
            {project.fieldName}
          </span>
          {getStatusBadge(project.status)}
        </div>

        <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#1B4F8C] transition-colors leading-snug mb-2.5">
          {project.title}
        </h3>

        <p className="text-xs text-[#595959] leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">牵头单位：</span>
            <span className="font-medium text-slate-700 truncate max-w-[180px]">{project.leadInstitution}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">合作方向：</span>
            <span className="text-slate-600">{project.targetRegion}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {project.deadline ? `截止: ${project.deadline}` : `发布: ${project.date}`}
          </span>
          <Link
            href={`/en/cooperation/enquiry?project=${encodeURIComponent(project.id)}`}
            className="inline-flex items-center text-xs font-semibold text-[#1155CC] group-hover:translate-x-0.5 transition-transform"
          >
            申请对接
            <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

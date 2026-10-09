'use client';

import React from 'react';

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  selectedValue: string;
}

interface FilterBarProps {
  groups: FilterGroup[];
  onSelect: (groupId: string, value: string) => void;
  onReset?: () => void;
  className?: string;
}

export default function FilterBar({
  groups,
  onSelect,
  onReset,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 ${className}`}>
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-xs font-bold text-[#1A1A1A] shrink-0 sm:w-24">
            {group.name}：
          </span>
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {group.options.map((opt) => {
              const isSelected = group.selectedValue === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSelect(group.id, opt.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#1B4F8C] text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-[#595959] hover:bg-slate-200 hover:text-[#1A1A1A]'
                  }`}
                >
                  {opt.label}
                  {typeof opt.count === 'number' && (
                    <span className={`ml-1 text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      ({opt.count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {onReset && (
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#595959] hover:text-[#1B4F8C] font-medium flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置全部筛选条件
          </button>
        </div>
      )}
    </div>
  );
}

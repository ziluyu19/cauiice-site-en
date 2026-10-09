'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitch from './LanguageSwitch';

interface SubNavItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: SubNavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/en' },
  {
    name: 'About Us',
    href: '/en/about',
    children: [
      { name: 'Overview', href: '/en/about' },
      { name: 'About the Committee', href: '/en/about/committee' },
      { name: 'Organisation', href: '/en/about/organisation' },
    ],
  },
  {
    name: 'Cooperation',
    href: '/en/cooperation',
    children: [
      { name: 'What We Do', href: '/en/cooperation' },
      { name: 'Projects & Opportunities', href: '/en/cooperation/projects' },
      { name: 'Enquiry', href: '/en/cooperation/enquiry' },
    ],
  },
  {
    name: 'Our Network',
    href: '/en/network',
    children: [
      { name: 'Network Overview', href: '/en/network' },
      { name: 'Members Directory', href: '/en/network/members' },
    ],
  },
  { name: 'News', href: '/en/news' },
  { name: 'Contact', href: '/en/contact' },
];

export default function EnglishHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/en') {
      return pathname === '/en';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo 区域 */}
          <Link href="/en" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="CAUIICE Logo"
              className="w-11 h-11 rounded-full object-contain ring-1 ring-slate-200 group-hover:scale-105 transition-transform"
            />
            <span className="text-[#1B4F8C] font-extrabold text-xl sm:text-2xl tracking-tight leading-none">
              CAUIICE
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => hasChildren && setOpenDropdown(item.name)}
                  onMouseLeave={() => hasChildren && setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'text-[#1B4F8C] font-semibold bg-[#E9F0F8]'
                        : 'text-[#1A1A1A] hover:text-[#1B4F8C] hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {hasChildren && (
                      <svg
                        className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-[#1B4F8C] transition-transform group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* 二级下拉 */}
                  {hasChildren && (
                    <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block w-56 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-white rounded-lg shadow-lg border border-slate-100 py-1.5 overflow-hidden">
                        {item.children!.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2.5 text-xs sm:text-sm transition-colors ${
                              pathname === sub.href
                                ? 'bg-[#E9F0F8] text-[#1B4F8C] font-semibold'
                                : 'text-[#595959] hover:text-[#1B4F8C] hover:bg-slate-50'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 右侧操作区：语言切换 & CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSwitch />
            <Link
              href="/en/cooperation/enquiry"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md text-white bg-[#1B4F8C] hover:bg-[#0F3A6B] transition-colors shadow-xs"
            >
              在线对接 Enquiry
            </Link>
          </div>

          {/* 移动端汉堡按钮 */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#1A1A1A] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端折叠菜单 */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.name} className="py-1">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-[#E9F0F8] text-[#1B4F8C] font-semibold'
                    : 'text-[#1A1A1A] hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="pl-6 mt-1 space-y-1">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-1.5 text-xs rounded-md ${
                        pathname === sub.href
                          ? 'text-[#1B4F8C] font-semibold'
                          : 'text-[#595959] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/en/cooperation/enquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold rounded-md text-white bg-[#1B4F8C]"
            >
              在线对接 Enquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

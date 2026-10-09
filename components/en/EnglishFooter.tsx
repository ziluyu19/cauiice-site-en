'use client';

import React from 'react';
import Link from 'next/link';

export default function EnglishFooter() {
  return (
    <footer className="bg-[#0F3A6B] text-slate-300 text-xs border-t border-[#1B4F8C]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* 左侧品牌与法定属性 (5 列) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-start gap-3">
              <img
                src="/logo.png"
                alt="CAUIICE Logo"
                className="w-12 h-12 rounded-full object-contain shrink-0 ring-1 ring-white/20 bg-white"
              />
              <div className="space-y-1">
                <div className="text-white text-base font-bold leading-snug">
                  中国高校校办产业协会国际合作与交流专业委员会
                </div>
                <div className="text-[11px] text-slate-300/90 leading-tight">
                  International Cooperation and Exchange Committee of the Chinese Association of University-run Industries (CAUIICE)
                </div>
                <div className="inline-block px-2 py-0.5 mt-1 bg-white/10 text-white/90 rounded text-[10px]">
                  中国高校校办产业协会所属分支机构
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pt-2">
              致力于搭建中国高水平大学产业集群、大学科技园与全球高校、国际科研机构及跨国产业界之间的高效对接枢纽。
            </p>
          </div>

          {/* 导航列 1: 关于与合作 (2 列) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              关于与合作
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/about" className="hover:text-white transition-colors">
                  概况总览 (About)
                </Link>
              </li>
              <li>
                <Link href="/en/about/committee" className="hover:text-white transition-colors">
                  国专委简介 (Committee)
                </Link>
              </li>
              <li>
                <Link href="/en/about/organisation" className="hover:text-white transition-colors">
                  组织架构 (Organisation)
                </Link>
              </li>
              <li>
                <Link href="/en/cooperation" className="hover:text-white transition-colors">
                  业务方向 (What We Do)
                </Link>
              </li>
              <li>
                <Link href="/en/cooperation/projects" className="hover:text-white transition-colors">
                  项目库 (Projects)
                </Link>
              </li>
            </ul>
          </div>

          {/* 导航列 2: 网络与资讯 (2 列) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              网络与资讯
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/network" className="hover:text-white transition-colors">
                  网络总览 (Network)
                </Link>
              </li>
              <li>
                <Link href="/en/network/members" className="hover:text-white transition-colors">
                  成员名录 (Members)
                </Link>
              </li>
              <li>
                <Link href="/en/news" className="hover:text-white transition-colors">
                  新闻动态 (News)
                </Link>
              </li>
              <li>
                <Link href="/en/cooperation/enquiry" className="hover:text-white transition-colors">
                  在线对接 (Enquiry)
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="hover:text-white transition-colors">
                  联系我们 (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* 右侧联系方式与办公信息 (3 列) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              秘书处联络
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p>地址：北京市海淀区清华科技园创新大厦 A 座</p>
              <p>邮编：100084</p>
              <p>邮箱：cooperation@cauiice.org.cn</p>
              <p>电话：+86 (10) 6278-8888</p>
              <p className="text-slate-400 text-[11px] pt-1">
                办公时间：工作日 09:00 - 17:30 (UTC+8)
              </p>
            </div>
          </div>
        </div>

        {/* 底部版权与免责声明 */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 CAUIICE. 中国高校校办产业协会国际合作与交流专业委员会 版权所有.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-white transition-colors">
              返回中文主站
            </Link>
            <span>•</span>
            <Link href="/en/contact" className="hover:text-white transition-colors">
              合规与声明
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

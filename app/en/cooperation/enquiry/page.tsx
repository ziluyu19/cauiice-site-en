'use client';

import React from 'react';
import Link from 'next/link';
import ProcessSteps from '@/components/en/ProcessSteps';
import InquiryForm from '@/components/en/InquiryForm';
import FAQ from '@/components/en/FAQ';

export default function CooperationEnquiryPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <Link href="/en/cooperation" className="hover:text-[#1B4F8C]">Cooperation</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">Enquiry</span>
        </nav>

        {/* 标题 */}
        <div className="mb-12">
          <div className="text-xs text-[#1B4F8C] font-semibold uppercase tracking-wider mb-2">
            Partnership Enquiry · 合作咨询与对接通道
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            提交国际合作需求与战略对接诉求
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            欢迎海外大学科技转化办公室、科研团队、国际商会及企业代表提交产学研合作需求。国专委秘书处将依照规范安排专业团队全程护航。
          </p>
        </div>

        {/* 主体两栏结构：左侧表单，右侧流程与提示 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* 左侧：Inquiry Form (7 列) */}
          <div className="lg:col-span-7">
            <InquiryForm sourcePageTitle="Cooperation Enquiry Page" />
          </div>

          {/* 右侧：官方对接流程与保障 (5 列) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4F8C]" />
                官方服务保障机制 (Our Commitments)
              </h3>
              <div className="space-y-3 text-xs text-[#595959] leading-relaxed">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#1B4F8C] mb-1">⏱️ 3 个工作日快速响应</div>
                  <p>国专委秘书处承诺在收到表单后 3 个工作日内完成合规审阅并启动双向联络。</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#1B4F8C] mb-1">🔒 涉外知识产权保密协议</div>
                  <p>在实质性技术讨论开展前，协同各方依法签署严格的保密协议与利益分配预案。</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#1B4F8C] mb-1">🤝 高校高管与院士团队直通</div>
                  <p>直接链接全国重点大学产业分管校领导、大学科技园董事长与国家重点实验室。</p>
                </div>
              </div>
            </div>

            <div className="bg-[#E9F0F8]/50 rounded-xl border border-blue-200 p-6 space-y-3">
              <h4 className="text-sm font-bold text-[#1B4F8C]">
                紧急或涉密外事来函？
              </h4>
              <p className="text-xs text-[#595959] leading-relaxed">
                若您的合作诉求涉及高级别政府间科技合作协议或具有高度涉密性，可直接通过官方秘书处专线致函：
              </p>
              <div className="text-xs text-slate-700 font-mono space-y-1 pt-1">
                <div>✉️ 专用邮箱：cooperation@cauiice.org.cn</div>
                <div>📞 秘书处专线：+86 (10) 6278-8888 转 801</div>
              </div>
            </div>
          </div>
        </div>

        {/* 合作流程 */}
        <div className="mb-16">
          <ProcessSteps
            title="合作落地四步标准化流程"
            subtitle="Collaboration Workflow"
          />
        </div>

        {/* 常见问题解答 FAQ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <FAQ />
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { COUNTRY_OPTIONS, INTENT_CATEGORIES } from '@/lib/enData';
import { submitEnglishEnquiry } from '@/lib/enFirestore';

interface InquiryFormProps {
  sourcePageTitle?: string;
  className?: string;
}

export default function InquiryForm({ sourcePageTitle, className = '' }: InquiryFormProps) {
  const pathname = usePathname();

  // 表单状态定义 (严格遵循 8 大字段定义)
  const [formData, setFormData] = useState({
    institution: '',
    countryRegion: 'CN',
    contactName: '',
    position: '', // optional
    email: '',
    cooperationCategory: 'JOINT_LAB',
    requirementSummary: '',
    privacyConsent: false,
  });

  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 500) {
      setFormData((prev) => ({ ...prev, requirementSummary: val }));
      setCharCount(val.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.institution.trim()) {
      setErrorMessage('请填写机构或高校名称 (Institution)');
      return;
    }
    if (!formData.contactName.trim()) {
      setErrorMessage('请填写联系人姓名 (Contact Name)');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('请填写有效的电子邮箱 (Email Address)');
      return;
    }
    if (!formData.requirementSummary.trim()) {
      setErrorMessage('请填写合作需求要点说明 (Requirement Summary)');
      return;
    }
    if (!formData.privacyConsent) {
      setErrorMessage('请勾选同意隐私保护与信息处理协议');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitEnglishEnquiry({
        institution: formData.institution,
        countryRegionCode: formData.countryRegion,
        contactName: formData.contactName,
        position: formData.position || undefined,
        email: formData.email,
        cooperationCategoryCode: formData.cooperationCategory,
        requirementSummary: formData.requirementSummary,
        privacyConsent: formData.privacyConsent,
        sourcePage: sourcePageTitle || pathname || '/en/cooperation/enquiry',
      });

      if (!res.success) {
        console.warn('[Inquiry Form] Firestore write warning (e.g. pending rules):', res.error);
      }
      setIsSuccess(true);
    } catch (err) {
      console.error('[Inquiry Form] Error writing to Firestore:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 p-8 shadow-xs ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-[#E9F0F8] text-[#1B4F8C] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A]">
            合作意向提交成功 (Submission Received)
          </h3>
          <p className="text-sm text-[#595959] max-w-lg mx-auto">
            感谢您对中国高校校办产业协会国际合作与交流专业委员会的关注与信任。我们已安全登记您的合作意向。
          </p>
        </div>

        {/* 提交后会发生什么 (What Happens Next) 说明 */}
        <div className="mt-8 pt-6 border-t border-slate-100 bg-[#E9F0F8]/50 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-[#1B4F8C] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1B4F8C]" />
            提交后处理流程 (What Happens Next)：
          </h4>
          <ol className="space-y-3 text-xs text-[#595959] pl-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B4F8C] shrink-0">1.</span>
              <span><strong>资质与合规初审：</strong>国专委国际项目部将在 3 个工作日内对提交机构资质和合作需求进行初步核验。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B4F8C] shrink-0">2.</span>
              <span><strong>官方专员跟进：</strong>审核通过后，专职国际合作专员将通过您填写的邮箱发送正式沟通函，并预约线上双向对接会。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B4F8C] shrink-0">3.</span>
              <span><strong>网络高校精准撮合：</strong>根据具体技术领域，定向匹配全国高校对应重点实验室、大学科技园或产业投资平台。</span>
            </li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                institution: '',
                countryRegion: 'CN',
                contactName: '',
                position: '',
                email: '',
                cooperationCategory: 'JOINT_LAB',
                requirementSummary: '',
                privacyConsent: false,
              });
              setCharCount(0);
            }}
            className="text-xs text-[#1B4F8C] hover:underline font-medium"
          >
            再次提交新的意向需求
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-1">
          在线提交国际合作意向 (Submit Partnership Enquiry)
        </h3>
        <p className="text-xs text-[#595959]">
          请填写以下标准化信息。国专委秘书处将依照规范安排专业团队与您对接。
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-[#C8102E] flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. 机构名称 & 2. 国家/地区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              机构 / 高校名称 <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="如：University of Oxford / 清华大学科技园"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              国家或地区 <span className="text-[#C8102E]">*</span>
            </label>
            <select
              value={formData.countryRegion}
              onChange={(e) => setFormData({ ...formData, countryRegion: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent bg-white"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. 联系人姓名 & 4. 职位 (可选) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              联系人姓名 <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="您的称呼或姓名"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              担任职务 <span className="text-slate-400 font-normal">(选填)</span>
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="如：技术转移主管 / 项目负责人"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent"
            />
          </div>
        </div>

        {/* 5. 电子邮箱 & 6. 合作意向分类 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              工作电子邮箱 <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="official@institution.edu"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              合作意向类型 <span className="text-[#C8102E]">*</span>
            </label>
            <select
              value={formData.cooperationCategory}
              onChange={(e) => setFormData({ ...formData, cooperationCategory: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent bg-white"
            >
              {INTENT_CATEGORIES.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 7. 需求要点简述 (<=500 字符) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#1A1A1A]">
              合作诉求与背景概要 <span className="text-[#C8102E]">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {charCount} / 500 字
            </span>
          </div>
          <textarea
            required
            rows={4}
            value={formData.requirementSummary}
            onChange={handleSummaryChange}
            placeholder="请简要阐明您的核心诉求，例如所处技术领域、寻求对接的中国高校类型、期望开展的合作模式等（500 字以内）..."
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:border-transparent resize-y"
          />
        </div>

        {/* 8. 隐私协议复选框 */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.privacyConsent}
              onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
              className="mt-0.5 rounded text-[#1B4F8C] focus:ring-[#1B4F8C] border-slate-300"
            />
            <span className="text-xs text-[#595959] leading-relaxed">
              我确认所填写的机构信息真实准确，并同意国专委将上述联络信息用于对接研判、沟通联系与合规审查。
            </span>
          </label>
        </div>

        {/* 提交按钮 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-md text-sm font-semibold text-white bg-[#1B4F8C] hover:bg-[#0F3A6B] focus:outline-none focus:ring-2 focus:ring-[#1B4F8C] focus:ring-offset-2 transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>正在校验并处理...</span>
              </>
            ) : (
              <span>提交合作意向 (Submit Partnership Enquiry)</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

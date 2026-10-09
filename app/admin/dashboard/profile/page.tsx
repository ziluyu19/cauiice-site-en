'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  COMMITTEE_DATA,
  ORGANISATION_DATA,
  CONTACT_DATA,
} from '@/lib/enData';

type ConfigTab = 'committee' | 'organisation' | 'contact';

interface DepartmentItem {
  name: string;
  duty: string;
}

interface LeaderItem {
  title: string;
  name: string;
  org: string;
}

interface ContactChannel {
  title: string;
  email: string;
  phone: string;
  contactPerson: string;
}

export default function AdminSiteConfigPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('committee');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. 委员会基本定位与简介 (siteConfig/committee)
  const [committeeForm, setCommitteeForm] = useState(COMMITTEE_DATA);

  // 2. 组织架构与领导团队 (siteConfig/organisation)
  const [orgForm, setOrgForm] = useState(ORGANISATION_DATA);

  // 3. 官方联络渠道 (siteConfig/contact)
  const [contactForm, setContactForm] = useState(CONTACT_DATA);

  // 提示信息
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 实时订阅 siteConfig 下的三个独立文档
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    const unsubCommittee = onSnapshot(
      doc(db, 'siteConfig', 'committee'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setCommitteeForm({
            overview: data.overview || COMMITTEE_DATA.overview,
            background: data.background || COMMITTEE_DATA.background,
            affiliation: data.affiliation || COMMITTEE_DATA.affiliation,
            scope: data.scope || COMMITTEE_DATA.scope,
          });
        }
      },
      (err) => console.warn('[Config] committee listener note:', err)
    );

    const unsubOrg = onSnapshot(
      doc(db, 'siteConfig', 'organisation'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setOrgForm({
            departments: Array.isArray(data.departments) && data.departments.length > 0
              ? data.departments
              : ORGANISATION_DATA.departments,
            leaders: Array.isArray(data.leaders) && data.leaders.length > 0
              ? data.leaders
              : ORGANISATION_DATA.leaders,
          });
        }
      },
      (err) => console.warn('[Config] organisation listener note:', err)
    );

    const unsubContact = onSnapshot(
      doc(db, 'siteConfig', 'contact'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setContactForm({
            cooperation: data.cooperation || CONTACT_DATA.cooperation,
            membership: data.membership || CONTACT_DATA.membership,
            media: data.media || CONTACT_DATA.media,
            office: data.office || CONTACT_DATA.office,
          });
        }
        setLoading(false);
        clearTimeout(timer);
      },
      (err) => {
        console.warn('[Config] contact listener note:', err);
        setLoading(false);
        clearTimeout(timer);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubCommittee();
      unsubOrg();
      unsubContact();
    };
  }, []);

  // 保存当前激活标签页配置
  const handleSaveActiveTab = async () => {
    setSaving(true);
    try {
      if (activeTab === 'committee') {
        const docRef = doc(db, 'siteConfig', 'committee');
        await setDoc(docRef, {
          ...committeeForm,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        showToast('委员会简介与定位配置已保存并发布，前台实时生效！', 'success');
      } else if (activeTab === 'organisation') {
        const docRef = doc(db, 'siteConfig', 'organisation');
        await setDoc(docRef, {
          ...orgForm,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        showToast('组织架构与领导团队配置已保存并发布，前台实时生效！', 'success');
      } else if (activeTab === 'contact') {
        const docRef = doc(db, 'siteConfig', 'contact');
        await setDoc(docRef, {
          ...contactForm,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        showToast('官方联络方式配置已保存并发布，前台实时生效！', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '保存失败';
      console.error('[Config] Save error:', err);
      showToast(`保存失败：${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 重置为默认预设
  const handleResetCurrentTab = () => {
    if (activeTab === 'committee') {
      setCommitteeForm(COMMITTEE_DATA);
      showToast('已重置为系统预设委员会简介，请点击保存生效', 'success');
    } else if (activeTab === 'organisation') {
      setOrgForm(ORGANISATION_DATA);
      showToast('已重置为系统预设组织架构，请点击保存生效', 'success');
    } else if (activeTab === 'contact') {
      setContactForm(CONTACT_DATA);
      showToast('已重置为系统预设官方联系方式，请点击保存生效', 'success');
    }
  };

  // 部门增删改
  const handleAddDepartment = () => {
    setOrgForm((prev) => ({
      ...prev,
      departments: [...prev.departments, { name: '新设部门名称', duty: '部门职能描述' }],
    }));
  };

  const handleUpdateDepartment = (idx: number, field: 'name' | 'duty', val: string) => {
    setOrgForm((prev) => {
      const copy = [...prev.departments];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, departments: copy };
    });
  };

  const handleDeleteDepartment = (idx: number) => {
    setOrgForm((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== idx),
    }));
  };

  // 领导增删改
  const handleAddLeader = () => {
    setOrgForm((prev) => ({
      ...prev,
      leaders: [...prev.leaders, { title: '职衔/头衔', name: '姓名/代表', org: '单位/机构' }],
    }));
  };

  const handleUpdateLeader = (idx: number, field: 'title' | 'name' | 'org', val: string) => {
    setOrgForm((prev) => {
      const copy = [...prev.leaders];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, leaders: copy };
    });
  };

  const handleDeleteLeader = (idx: number) => {
    setOrgForm((prev) => ({
      ...prev,
      leaders: prev.leaders.filter((_, i) => i !== idx),
    }));
  };

  // 联络通道更新辅助
  const handleUpdateContactChannel = (
    channel: 'cooperation' | 'membership' | 'media',
    field: keyof ContactChannel,
    val: string
  ) => {
    setContactForm((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: val,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 吐司通知 */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 顶部标题与保存操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              站点与组织架构配置 (Site & Organisation Config)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
              siteConfig
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            集中维护英文网站“关于我们”与“联络”三大核心子栏目的法定内容，数据直接同步至 Firestore (cauiice-site-en)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetCurrentTab}
            disabled={saving}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            重置为预设
          </button>
          <button
            type="button"
            onClick={handleSaveActiveTab}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>正在保存...</span>
              </>
            ) : (
              <>
                <span>💾 保存并发布配置</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 前台对应页面快捷预览条 */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <span className="font-semibold text-slate-700">前台对应展示页面：</span>
        <Link
          href="/en/about/committee"
          target="_blank"
          className="text-blue-700 hover:underline flex items-center gap-0.5"
        >
          /en/about/committee ↗
        </Link>
        <span>·</span>
        <Link
          href="/en/about/organisation"
          target="_blank"
          className="text-blue-700 hover:underline flex items-center gap-0.5"
        >
          /en/about/organisation ↗
        </Link>
        <span>·</span>
        <Link
          href="/en/contact"
          target="_blank"
          className="text-blue-700 hover:underline flex items-center gap-0.5"
        >
          /en/contact ↗
        </Link>
      </div>

      {/* 选项卡切换 (Tabs) */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('committee')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'committee'
              ? 'border-blue-800 text-blue-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. 委员会简介与法定定位 (siteConfig/committee)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('organisation')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'organisation'
              ? 'border-blue-800 text-blue-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. 组织架构与部门职责 (siteConfig/organisation)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'contact'
              ? 'border-blue-800 text-blue-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. 官方联络与秘书处渠道 (siteConfig/contact)
        </button>
      </div>

      {/* 内容卡片区 */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-800 border-t-transparent mb-3" />
            <p className="text-xs">正在从 Firestore 读取站点配置...</p>
          </div>
        ) : (
          <>
            {/* ────────────────────────────────────────────────────────
                TAB 1: 委员会简介与定位 (committee)
            ──────────────────────────────────────────────────────── */}
            {activeTab === 'committee' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1">
                    委员会简介与法定定位配置
                  </h2>
                  <p className="text-xs text-slate-500">
                    该内容服务于前台 /en/about/committee 以及首页 /en 的国专委权威介绍模块。
                  </p>
                </div>

                <div className="space-y-5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      01. 机构总览与法定职能 (Overview & Mandate) *
                    </label>
                    <textarea
                      rows={4}
                      value={committeeForm.overview}
                      onChange={(e) => setCommitteeForm({ ...committeeForm, overview: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                      placeholder="阐明国专委所属协会法定属性与宗旨"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      02. 成立背景与历史使命 (Historical Background) *
                    </label>
                    <textarea
                      rows={4}
                      value={committeeForm.background}
                      onChange={(e) => setCommitteeForm({ ...committeeForm, background: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                      placeholder="介绍产教融合与涉外科技创新的历史积淀"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      03. 业务指导与隶属属性 (Affiliation & Status) *
                    </label>
                    <textarea
                      rows={3}
                      value={committeeForm.affiliation}
                      onChange={(e) => setCommitteeForm({ ...committeeForm, affiliation: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                      placeholder="明确教育部业务指导与协会章程监督"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      04. 业务辐射范围与全球网络 (Operational Scope) *
                    </label>
                    <textarea
                      rows={3}
                      value={committeeForm.scope}
                      onChange={(e) => setCommitteeForm({ ...committeeForm, scope: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                      placeholder="涵盖重点高校、大学科技园及海外联络节点"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 2: 组织架构与部门职责 (organisation)
            ──────────────────────────────────────────────────────── */}
            {activeTab === 'organisation' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1">
                    组织架构与各部门职能配置
                  </h2>
                  <p className="text-xs text-slate-500">
                    该内容服务于前台 /en/about/organisation 组织架构树状图与部门职能清单。
                  </p>
                </div>

                {/* 1. 常设部门列表 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">常设部门与专业委员会 (Departments)</h3>
                      <p className="text-[11px] text-slate-400">维护国专委秘书处、项目部、会员网络部等常设部门</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDepartment}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold cursor-pointer"
                    >
                      + 新增部门
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orgForm.departments.map((dept, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                      >
                        <div className="w-full sm:w-1/3">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">部门名称</label>
                          <input
                            type="text"
                            value={dept.name}
                            onChange={(e) => handleUpdateDepartment(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="w-full sm:flex-1">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">职责描述</label>
                          <input
                            type="text"
                            value={dept.duty}
                            onChange={(e) => handleUpdateDepartment(idx, 'duty', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteDepartment(idx)}
                          className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 cursor-pointer self-end sm:self-center shrink-0"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 领导团队列表 */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">领导架构与代表 (Leadership Structure)</h3>
                      <p className="text-[11px] text-slate-400">维护主任委员、副主任委员与秘书长等岗位信息</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLeader}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold cursor-pointer"
                    >
                      + 新增领导代表
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orgForm.leaders.map((leader, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                      >
                        <div className="w-full sm:w-1/4">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">职衔头衔</label>
                          <input
                            type="text"
                            value={leader.title}
                            onChange={(e) => handleUpdateLeader(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="w-full sm:w-1/4">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">姓名 / 代表</label>
                          <input
                            type="text"
                            value={leader.name}
                            onChange={(e) => handleUpdateLeader(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="w-full sm:flex-1">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">所属单位 / 职责说明</label>
                          <input
                            type="text"
                            value={leader.org}
                            onChange={(e) => handleUpdateLeader(idx, 'org', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLeader(idx)}
                          className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 cursor-pointer self-end sm:self-center shrink-0"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 3: 官方联络与秘书处 (contact)
            ──────────────────────────────────────────────────────── */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1">
                    官方联络渠道与办公地点配置
                  </h2>
                  <p className="text-xs text-slate-500">
                    该内容服务于前台 /en/contact 联络卡片、电子邮箱、电话与办公地址展示。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* 1. 国际合作与项目对接 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="font-bold text-sm text-[#1B4F8C]">🤝 国际合作与项目对接</div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">卡片主标题</label>
                      <input
                        type="text"
                        value={contactForm.cooperation.title}
                        onChange={(e) => handleUpdateContactChannel('cooperation', 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">电子邮箱</label>
                      <input
                        type="email"
                        value={contactForm.cooperation.email}
                        onChange={(e) => handleUpdateContactChannel('cooperation', 'email', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">联系电话</label>
                      <input
                        type="text"
                        value={contactForm.cooperation.phone}
                        onChange={(e) => handleUpdateContactChannel('cooperation', 'phone', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">对接人 / 部门</label>
                      <input
                        type="text"
                        value={contactForm.cooperation.contactPerson}
                        onChange={(e) => handleUpdateContactChannel('cooperation', 'contactPerson', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* 2. 会员服务与伙伴网络 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="font-bold text-sm text-[#1B4F8C]">🏛️ 会员服务与伙伴网络</div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">卡片主标题</label>
                      <input
                        type="text"
                        value={contactForm.membership.title}
                        onChange={(e) => handleUpdateContactChannel('membership', 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">电子邮箱</label>
                      <input
                        type="email"
                        value={contactForm.membership.email}
                        onChange={(e) => handleUpdateContactChannel('membership', 'email', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">联系电话</label>
                      <input
                        type="text"
                        value={contactForm.membership.phone}
                        onChange={(e) => handleUpdateContactChannel('membership', 'phone', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">对接人 / 部门</label>
                      <input
                        type="text"
                        value={contactForm.membership.contactPerson}
                        onChange={(e) => handleUpdateContactChannel('membership', 'contactPerson', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* 3. 媒体垂询与公共关系 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="font-bold text-sm text-[#1B4F8C]">📢 媒体垂询与公共关系</div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">卡片主标题</label>
                      <input
                        type="text"
                        value={contactForm.media.title}
                        onChange={(e) => handleUpdateContactChannel('media', 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">电子邮箱</label>
                      <input
                        type="email"
                        value={contactForm.media.email}
                        onChange={(e) => handleUpdateContactChannel('media', 'email', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">联系电话</label>
                      <input
                        type="text"
                        value={contactForm.media.phone}
                        onChange={(e) => handleUpdateContactChannel('media', 'phone', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">对接人 / 部门</label>
                      <input
                        type="text"
                        value={contactForm.media.contactPerson}
                        onChange={(e) => handleUpdateContactChannel('media', 'contactPerson', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 办公地址与交通指南 */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4 text-xs mt-6">
                  <div className="font-bold text-sm text-slate-800">📍 秘书处实体办公地点</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">办公地址</label>
                      <input
                        type="text"
                        value={contactForm.office.address}
                        onChange={(e) => setContactForm({
                          ...contactForm,
                          office: { ...contactForm.office, address: e.target.value },
                        })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">邮政编码</label>
                      <input
                        type="text"
                        value={contactForm.office.postalCode}
                        onChange={(e) => setContactForm({
                          ...contactForm,
                          office: { ...contactForm.office, postalCode: e.target.value },
                        })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

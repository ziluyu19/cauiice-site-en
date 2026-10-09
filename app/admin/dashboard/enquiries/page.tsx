'use client';

import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COUNTRY_OPTIONS, INTENT_CATEGORIES } from '@/lib/enData';

export interface AdminEnquiryItem {
  id: string;
  institution: string;
  countryRegionCode: string;
  contactName: string;
  position?: string;
  email: string;
  cooperationCategoryCode: string;
  requirementSummary: string;
  privacyConsent?: boolean;
  sourcePage?: string;
  status: 'pending' | 'reviewing' | 'contacted' | 'closed' | string;
  createdAt?: any;
  updatedAt?: any;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: '新提交 (New)',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  new: {
    label: '新提交 (New)',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  reviewing: {
    label: '初审研判中 (Reviewing)',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  contacted: {
    label: '已建立联络 (Contacted)',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  closed: {
    label: '已办结归档 (Closed)',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  archived: {
    label: '已归档 (Archived)',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdminEnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 详情模态框
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiryItem | null>(null);

  // 删除确认模态框
  const [deleteTarget, setDeleteTarget] = useState<AdminEnquiryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 状态更新中
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 吐司提示
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 格式化时间辅助函数
  const formatTime = (ts: any) => {
    if (!ts) return '—';
    try {
      if (typeof ts === 'string') return ts.slice(0, 19).replace('T', ' ');
      if (ts.toDate && typeof ts.toDate === 'function') {
        const d = ts.toDate();
        return d.toLocaleString('zh-CN', { hour12: false });
      }
      if (ts.seconds) {
        const d = new Date(ts.seconds * 1000);
        return d.toLocaleString('zh-CN', { hour12: false });
      }
    } catch (e) {
      return String(ts);
    }
    return String(ts);
  };

  // 翻译国家/地区编码
  const getCountryName = (code?: string) => {
    if (!code) return '—';
    const match = COUNTRY_OPTIONS.find((c) => c.code === code);
    return match ? `${match.name}` : code;
  };

  // 翻译合作诉求分类
  const getCategoryName = (code?: string) => {
    if (!code) return '未分类';
    const match = INTENT_CATEGORIES.find((c) => c.code === code);
    return match ? `${match.name}` : code;
  };

  // 实时监听 Firestore enquiries 集合
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(timer);
          const list: AdminEnquiryItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              institution: data.institution || data.unit || '未知机构',
              countryRegionCode: data.countryRegionCode || data.country || 'CN',
              contactName: data.contactName || data.name || '未填联系人',
              position: data.position || '',
              email: data.email || data.contact || '',
              cooperationCategoryCode: data.cooperationCategoryCode || data.type || 'JOINT_LAB',
              requirementSummary: data.requirementSummary || data.content || data.desc || data.message || '',
              privacyConsent: Boolean(data.privacyConsent),
              sourcePage: data.sourcePage || data.source || '/en/cooperation/enquiry',
              status: data.status || 'pending',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          });
          setEnquiries(list);
          setLoading(false);
        },
        (err) => {
          console.warn('[Enquiries] Ordered query error, fallback to simple collection:', err);
          unsubscribe = onSnapshot(
            collection(db, 'enquiries'),
            (snapshot) => {
              clearTimeout(timer);
              const list: AdminEnquiryItem[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  institution: data.institution || data.unit || '未知机构',
                  countryRegionCode: data.countryRegionCode || data.country || 'CN',
                  contactName: data.contactName || data.name || '未填联系人',
                  position: data.position || '',
                  email: data.email || data.contact || '',
                  cooperationCategoryCode: data.cooperationCategoryCode || data.type || 'JOINT_LAB',
                  requirementSummary: data.requirementSummary || data.content || data.desc || data.message || '',
                  privacyConsent: Boolean(data.privacyConsent),
                  sourcePage: data.sourcePage || data.source || '/en/cooperation/enquiry',
                  status: data.status || 'pending',
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                };
              });
              setEnquiries(list);
              setLoading(false);
            },
            (fallbackErr) => {
              console.error('[Enquiries] Snapshot fallback failed:', fallbackErr);
              clearTimeout(timer);
              setLoading(false);
            }
          );
        }
      );
    } catch (e) {
      console.error('[Enquiries] Init error:', e);
      setLoading(false);
    }

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // 修改状态
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const docRef = doc(db, 'enquiries', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      showToast(`合作意向状态已更新为：${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      showToast(err?.message || '更新状态失败，请检查管理员权限', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // 删除意向
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'enquiries', deleteTarget.id));
      showToast(`已成功删除来自《${deleteTarget.institution}》的合作意向记录`);
      if (selectedEnquiry && selectedEnquiry.id === deleteTarget.id) {
        setSelectedEnquiry(null);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Delete enquiry error:', err);
      showToast(err?.message || '删除记录失败，请检查管理员权限', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 统计数据
  const counts = {
    all: enquiries.length,
    pending: enquiries.filter((e) => e.status === 'pending' || e.status === 'new').length,
    reviewing: enquiries.filter((e) => e.status === 'reviewing').length,
    contacted: enquiries.filter((e) => e.status === 'contacted').length,
    closed: enquiries.filter((e) => e.status === 'closed' || e.status === 'archived').length,
  };

  // 过滤列表
  const filteredList = enquiries.filter((item) => {
    // 状态过滤
    if (statusFilter === 'pending' && item.status !== 'pending' && item.status !== 'new') return false;
    if (statusFilter === 'reviewing' && item.status !== 'reviewing') return false;
    if (statusFilter === 'contacted' && item.status !== 'contacted') return false;
    if (statusFilter === 'closed' && item.status !== 'closed' && item.status !== 'archived') return false;

    // 搜索过滤
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchInst = item.institution.toLowerCase().includes(q);
      const matchName = item.contactName.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchSummary = item.requirementSummary.toLowerCase().includes(q);
      return matchInst || matchName || matchEmail || matchSummary;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 吐司提示 */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✓' : '✕'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            国际合作意向管理 (Partnership Enquiries)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            实时汇总海外高校、国际科研机构及跨国产业伙伴在前台提交的合作对接意向需求（写入 Firestore <code>enquiries</code> 集合）
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            总计登记意向：<strong>{enquiries.length}</strong> 笔
          </span>
        </div>
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-amber-700 font-medium">待研判响应 (New)</div>
          <div className="text-2xl font-bold text-amber-900 mt-1 font-mono">{counts.pending}</div>
          <div className="text-[11px] text-amber-600/80 mt-1">3 个工作日内须初审</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('reviewing')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'reviewing'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/40'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-blue-700 font-medium">初审研判中 (Reviewing)</div>
          <div className="text-2xl font-bold text-blue-900 mt-1 font-mono">{counts.reviewing}</div>
          <div className="text-[11px] text-blue-600/80 mt-1">智库与合规审核</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('contacted')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'contacted'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/40'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-emerald-700 font-medium">已建立联络 (Contacted)</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1 font-mono">{counts.contacted}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1">专员对接洽谈中</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('closed')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'closed'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/40'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-700 font-medium">已办结归档 (Closed)</div>
          <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">{counts.closed}</div>
          <div className="text-[11px] text-slate-500 mt-1">完成签约或结案</div>
        </button>
      </div>

      {/* 筛选与搜索工具条 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { key: 'all', label: `全部 (${counts.all})` },
            { key: 'pending', label: `新提交 (${counts.pending})` },
            { key: 'reviewing', label: `研判中 (${counts.reviewing})` },
            { key: 'contacted', label: `已联络 (${counts.contacted})` },
            { key: 'closed', label: `已办结 (${counts.closed})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                statusFilter === tab.key
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索机构、联系人、邮箱或诉求..."
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* 数据列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>正在同步 Firestore 意向记录...</div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3 text-xs">
            <p className="text-slate-600 font-medium">暂无符合条件的意向记录</p>
            <p className="text-[11px] text-slate-400">
              访客在英文网站前台 <code>/en/cooperation/enquiry</code> 提交的意向将实时呈现在此处。
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">提交机构 / 国家地区</th>
                  <th className="px-4 py-3">联系人 / 职务</th>
                  <th className="px-4 py-3">电子邮箱</th>
                  <th className="px-4 py-3">合作方向</th>
                  <th className="px-4 py-3">诉求摘要</th>
                  <th className="px-4 py-3">办理状态</th>
                  <th className="px-4 py-3">提交时间</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => {
                  const badge = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px]">
                        <div className="truncate" title={item.institution}>
                          {item.institution}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {getCountryName(item.countryRegionCode)}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[140px]">
                        <div className="font-medium text-slate-800 truncate">{item.contactName}</div>
                        {item.position && (
                          <div className="text-[11px] text-slate-400 truncate">{item.position}</div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-600 max-w-[180px] truncate">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-blue-700 hover:underline"
                          title={item.email}
                        >
                          {item.email}
                        </a>
                      </td>

                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                          {getCategoryName(item.cooperationCategoryCode)}
                        </span>
                      </td>

                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="line-clamp-2 text-slate-500 leading-relaxed text-[11px]" title={item.requirementSummary}>
                          {item.requirementSummary}
                        </p>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <option value="pending">新提交 (New)</option>
                          <option value="reviewing">研判中 (Reviewing)</option>
                          <option value="contacted">已联络 (Contacted)</option>
                          <option value="closed">已办结 (Closed)</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {formatTime(item.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(item)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                        >
                          查看详情
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="px-2 py-1 rounded-md text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 详情模态框 */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-mono text-blue-700 uppercase tracking-wider font-semibold block mb-1">
                ENQUIRY DETAIL · 意向详情
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedEnquiry.institution}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>提交时间：{formatTime(selectedEnquiry.createdAt)}</span>
                <span>·</span>
                <span>来源路径：{selectedEnquiry.sourcePage}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-0.5">机构所属国家/地区：</span>
                <span className="font-semibold text-slate-800">
                  {getCountryName(selectedEnquiry.countryRegionCode)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">对接人姓名与职务：</span>
                <span className="font-semibold text-slate-800">
                  {selectedEnquiry.contactName}{' '}
                  {selectedEnquiry.position ? `(${selectedEnquiry.position})` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">电子邮箱：</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-semibold text-blue-700 hover:underline font-mono"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">拟开展合作类型：</span>
                <span className="font-semibold text-slate-800">
                  {getCategoryName(selectedEnquiry.cooperationCategoryCode)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                合作诉求与技术描述全文 (Requirement Summary)：
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.requirementSummary}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">办理状态：</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer bg-white"
                >
                  <option value="pending">新提交 (New)</option>
                  <option value="reviewing">初审研判中 (Reviewing)</option>
                  <option value="contacted">已建立联络 (Contacted)</option>
                  <option value="closed">已办结归档 (Closed)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedEnquiry)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                >
                  删除此记录
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-bold text-slate-900">确认删除合作意向记录？</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              您确定要删除来自 <strong>{deleteTarget.institution}</strong>（联系人：{deleteTarget.contactName}）的合作意向记录吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? '正在删除...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProjectRecord {
  id: string;
  title: string;
  name?: string;
  field: 'smart_mfg' | 'green_tech' | 'biomedicine' | 'ai' | 'edutech' | string;
  fieldName?: string;
  status: 'recruiting' | 'ongoing' | 'completed' | 'preparing' | string;
  statusName?: string;
  leadInstitution: string;
  chineseParty?: string;
  leadUniversity?: string;
  targetRegion: string;
  target?: string;
  country?: string;
  deadline?: string;
  date: string;
  period?: string;
  description: string;
  desc?: string;
  summary?: string;
  featured?: boolean;
  createdAt?: any;
}

const FIELD_OPTIONS = [
  { value: 'smart_mfg', label: '智能制造 (Smart Mfg)' },
  { value: 'green_tech', label: '绿色低碳 (Green Tech)' },
  { value: 'biomedicine', label: '生物医药 (Biomedicine)' },
  { value: 'ai', label: '人工智能 (AI & Computing)' },
  { value: 'edutech', label: '教育科技 (EduTech)' },
];

const STATUS_OPTIONS = [
  { value: 'recruiting', label: '招募中 (Recruiting)', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { value: 'ongoing', label: '进行中 (Ongoing)', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  { value: 'preparing', label: '筹备中 (Preparing)', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  { value: 'completed', label: '已完成 (Completed)', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');

  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 删除确认模态框
  const [deleteTarget, setDeleteTarget] = useState<ProjectRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    field: 'smart_mfg',
    status: 'recruiting',
    leadInstitution: '',
    targetRegion: '',
    date: '2026.01 - 2027.12',
    deadline: '',
    description: '',
    featured: false,
  });

  // 吐司提示
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 实时订阅 projects 集合
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    let unsubscribe: () => void = () => {};

    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(timer);
          const list: ProjectRecord[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || data.name || '',
              field: data.field || 'smart_mfg',
              fieldName: data.fieldName || '',
              status: data.status || 'recruiting',
              statusName: data.statusName || '',
              leadInstitution: data.leadInstitution || data.leadUniversity || data.chineseParty || '',
              targetRegion: data.targetRegion || data.target || data.country || '',
              deadline: data.deadline || '',
              date: data.date || data.period || '',
              description: data.description || data.summary || data.desc || '',
              featured: Boolean(data.featured),
              createdAt: data.createdAt,
            };
          });
          setProjects(list);
          setLoading(false);
        },
        (err) => {
          console.warn('[Admin Projects] Ordered query fallback:', err);
          // 降级使用无排序监听
          unsubscribe = onSnapshot(
            collection(db, 'projects'),
            (snap) => {
              clearTimeout(timer);
              const list: ProjectRecord[] = snap.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  title: data.title || data.name || '',
                  field: data.field || 'smart_mfg',
                  fieldName: data.fieldName || '',
                  status: data.status || 'recruiting',
                  statusName: data.statusName || '',
                  leadInstitution: data.leadInstitution || data.leadUniversity || data.chineseParty || '',
                  targetRegion: data.targetRegion || data.target || data.country || '',
                  deadline: data.deadline || '',
                  date: data.date || data.period || '',
                  description: data.description || data.summary || data.desc || '',
                  featured: Boolean(data.featured),
                  createdAt: data.createdAt,
                };
              });
              setProjects(list);
              setLoading(false);
            },
            (fallbackErr) => {
              console.error('[Admin Projects] Fallback listener error:', fallbackErr);
              clearTimeout(timer);
              setLoading(false);
            }
          );
        }
      );
    } catch (e) {
      console.error('[Admin Projects] Setup listener failed:', e);
      clearTimeout(timer);
      setLoading(false);
    }

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // 筛选与搜索
  const filteredProjects = projects.filter((p) => {
    // 状态匹配
    const pStatus = (p.status || '').toLowerCase();
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'recruiting' && (pStatus === 'recruiting' || pStatus.includes('招募') || pStatus.includes('open'))) ||
      (statusFilter === 'ongoing' && (pStatus === 'ongoing' || pStatus.includes('进行'))) ||
      (statusFilter === 'preparing' && (pStatus === 'preparing' || pStatus.includes('筹备'))) ||
      (statusFilter === 'completed' && (pStatus === 'completed' || pStatus.includes('完成') || pStatus.includes('结项')));

    // 领域匹配
    const pField = (p.field || '').toLowerCase();
    const matchField = fieldFilter === 'all' || pField === fieldFilter;

    // 关键词搜索
    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.leadInstitution.toLowerCase().includes(term) ||
      p.targetRegion.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term);

    return matchStatus && matchField && matchSearch;
  });

  // 打开新增模态框
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      field: 'smart_mfg',
      status: 'recruiting',
      leadInstitution: '',
      targetRegion: '',
      date: '2026.01 - 2027.12',
      deadline: '',
      description: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const handleOpenEdit = (item: ProjectRecord) => {
    setEditingProject(item);
    setFormData({
      title: item.title,
      field: item.field || 'smart_mfg',
      status: item.status || 'recruiting',
      leadInstitution: item.leadInstitution,
      targetRegion: item.targetRegion,
      date: item.date || '2026.01 - 2027.12',
      deadline: item.deadline || '',
      description: item.description,
      featured: Boolean(item.featured),
    });
    setIsModalOpen(true);
  };

  // 提交新增或修改
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('请填写项目名称', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const fieldObj = FIELD_OPTIONS.find((f) => f.value === formData.field);
      const statusObj = STATUS_OPTIONS.find((s) => s.value === formData.status);

      const payload = {
        title: formData.title.trim(),
        name: formData.title.trim(),
        field: formData.field,
        fieldName: fieldObj?.label.split(' ')[0] || formData.field,
        status: formData.status,
        statusName: statusObj?.label.split(' ')[0] || formData.status,
        leadInstitution: formData.leadInstitution.trim(),
        leadUniversity: formData.leadInstitution.trim(),
        chineseParty: formData.leadInstitution.trim(),
        targetRegion: formData.targetRegion.trim(),
        target: formData.targetRegion.trim(),
        country: formData.targetRegion.trim(),
        date: formData.date.trim(),
        period: formData.date.trim(),
        deadline: formData.deadline.trim(),
        description: formData.description.trim(),
        summary: formData.description.trim(),
        desc: formData.description.trim(),
        featured: Boolean(formData.featured),
        updatedAt: serverTimestamp(),
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), payload);
        showToast('项目已成功更新，前台实时生效！', 'success');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast('新合作项目已发布并入库！', 'success');
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '操作失败';
      console.error('[Admin Projects] Submit error:', err);
      showToast(`保存失败：${msg}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 切换精选状态
  const handleToggleFeatured = async (item: ProjectRecord) => {
    try {
      await updateDoc(doc(db, 'projects', item.id), {
        featured: !item.featured,
        updatedAt: serverTimestamp(),
      });
      showToast(`已${!item.featured ? '设为' : '取消'}首页精选项目`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '更新失败';
      showToast(`更新精选状态失败：${msg}`, 'error');
    }
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', deleteTarget.id));
      showToast(`项目 "${deleteTarget.title}" 已成功删除`, 'success');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除失败';
      showToast(`删除失败：${msg}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 获取状态标签样式
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'recruiting' || s.includes('招募') || s.includes('open')) {
      return { label: '招募中 (Recruiting)', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    if (s === 'ongoing' || s.includes('进行')) {
      return { label: '进行中 (Ongoing)', class: 'bg-blue-50 text-blue-800 border-blue-200' };
    }
    if (s === 'completed' || s.includes('完成')) {
      return { label: '已完成 (Completed)', class: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
    return { label: '筹备中 (Preparing)', class: 'bg-amber-50 text-amber-800 border-amber-200' };
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

      {/* 顶部标题栏与快捷操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              国际合作项目管理 (Projects & Opportunities)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
              projects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            维护英文站国际合作项目库，包含高校协同研发、跨国概念验证与中试示范项目，数据直接同步至 Firestore (cauiice-site-en)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/en/cooperation/projects"
            target="_blank"
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            前台项目库预览 ↗
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>+ 新增合作项目</span>
          </button>
        </div>
      </div>

      {/* 核心指标统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">项目库总数</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{projects.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">招募中 / 开放中</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {projects.filter((p) => (p.status || '').toLowerCase().includes('recruiting') || (p.status || '').toLowerCase().includes('招募')).length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">进行中项目</div>
          <div className="text-2xl font-black text-blue-700 mt-1 font-mono">
            {projects.filter((p) => (p.status || '').toLowerCase().includes('ongoing') || (p.status || '').toLowerCase().includes('进行')).length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">首页精选项目</div>
          <div className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {projects.filter((p) => p.featured).length}
          </div>
        </div>
      </div>

      {/* 筛选与搜索工具条 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* 搜索框 */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索项目名称、牵头高校或合作地区..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
        </div>

        {/* 状态与领域快捷过滤 */}
        <div className="w-full md:w-auto flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">进度:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">全部进度</option>
              <option value="recruiting">招募中</option>
              <option value="ongoing">进行中</option>
              <option value="preparing">筹备中</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">领域:</span>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">全部领域</option>
              {FIELD_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || statusFilter !== 'all' || fieldFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setFieldFilter('all');
              }}
              className="text-xs text-blue-700 hover:underline px-2 py-1"
            >
              重置筛选
            </button>
          )}
        </div>
      </div>

      {/* 项目表格列表 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-800 border-t-transparent mb-3" />
            <p className="text-xs">正在从 Firestore 读取合作项目...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <div className="text-3xl mb-2">📂</div>
            <p>暂无符合筛选条件的项目数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">项目状态</th>
                  <th className="px-4 py-3 font-semibold min-w-[220px]">项目名称</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">技术领域</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">牵头高校 / 平台</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">目标合作国家/地区</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">周期</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">首页精选</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((item, idx) => {
                  const badge = getStatusBadge(item.status);
                  const fieldLabel = FIELD_OPTIONS.find((f) => f.value === item.field)?.label || item.field;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                        {fieldLabel.split(' ')[0]}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                        {item.leadInstitution || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {item.targetRegion || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                        {item.date || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer transition-colors ${
                            item.featured
                              ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.featured ? '★ 精选' : '☆ 普通'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold cursor-pointer"
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

      {/* 新增 / 编辑项目模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProject ? '编辑合作项目' : '发布新国际合作项目'}
                </h3>
                <p className="text-xs text-slate-500">存入 Firestore projects 集合 (cauiice-site-en)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">项目名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：中欧智能制造工业互联网联合概念验证中心"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">技术领域 *</label>
                  <select
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">项目进度 / 状态 *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">牵头高校或产业平台 *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadInstitution}
                    onChange={(e) => setFormData({ ...formData, leadInstitution: e.target.value })}
                    placeholder="例如：清华大学校企联合创新中心"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">目标国家或合作地区 *</label>
                  <input
                    type="text"
                    required
                    value={formData.targetRegion}
                    onChange={(e) => setFormData({ ...formData, targetRegion: e.target.value })}
                    placeholder="例如：德国 / 瑞士 / 欧洲"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">项目执行周期 *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="例如：2026.01 - 2027.12 或 2026-09-15"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">申报截止日期 (可选)</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="例如：2026-12-31"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">项目简介与合作模式说明 *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细介绍联合实验室设立、先进技术跨境转移转化、概念验证或中试需求..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-slate-700 cursor-pointer">
                  设为首页精选合作项目 (Featured on Home)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? '正在保存...' : editingProject ? '保存修改' : '确认发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
              🗑️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">确认删除该合作项目？</h3>
              <p className="text-xs text-slate-500 mt-1">
                项目“<span className="font-semibold text-slate-800">{deleteTarget.title}</span>”删除后无法撤销，前台项目库将同步下架。
              </p>
            </div>
            <div className="flex justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

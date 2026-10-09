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

interface MemberRecord {
  id: string;
  name: string;
  institution?: string;
  type: 'university' | 'enterprise' | 'tech_park' | 'transfer_agency' | string;
  typeName?: string;
  region: 'beijing' | 'shanghai' | 'jiangsu' | 'zhejiang' | 'guangdong' | 'other' | string;
  regionName?: string;
  description: string;
  desc?: string;
  established?: string;
  keyFields?: string[];
  featured?: boolean;
  contact?: string;
  tier?: string;
  level?: string;
  createdAt?: any;
}

const TYPE_OPTIONS = [
  { value: 'university', label: '重点高校产业 (Key University Industries)' },
  { value: 'tech_park', label: '国家大学科技园 (Science & Tech Parks)' },
  { value: 'enterprise', label: '高校骨干企业 (University-run Enterprises)' },
  { value: 'transfer_agency', label: '技术转移机构 (Tech Transfer Agencies)' },
];

const REGION_OPTIONS = [
  { value: 'beijing', label: '北京 (Beijing)' },
  { value: 'shanghai', label: '上海 (Shanghai)' },
  { value: 'jiangsu', label: '江苏 (Jiangsu)' },
  { value: 'zhejiang', label: '浙江 (Zhejiang)' },
  { value: 'guangdong', label: '广东 (Guangdong)' },
  { value: 'other', label: '其他主要省份 (Other Regions)' },
];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 删除确认模态框
  const [deleteTarget, setDeleteTarget] = useState<MemberRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    region: 'beijing',
    established: '2005',
    keyFieldsInput: '产学研合作, 成果转化',
    description: '',
    contact: '',
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

  // 实时订阅 members 集合
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    let unsubscribe: () => void = () => {};

    try {
      const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(timer);
          const list: MemberRecord[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || data.institution || '',
              type: data.type || 'university',
              typeName: data.typeName || '',
              region: data.region || 'other',
              regionName: data.regionName || '',
              description: data.description || data.desc || '',
              established: data.established || '',
              keyFields: Array.isArray(data.keyFields) ? data.keyFields : [],
              featured: Boolean(data.featured),
              contact: data.contact || '',
              tier: data.tier,
              level: data.level,
              createdAt: data.createdAt,
            };
          });
          setMembers(list);
          setLoading(false);
        },
        (err) => {
          console.warn('[Admin Members] Ordered query fallback:', err);
          unsubscribe = onSnapshot(
            collection(db, 'members'),
            (snap) => {
              clearTimeout(timer);
              const list: MemberRecord[] = snap.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  name: data.name || data.institution || '',
                  type: data.type || 'university',
                  typeName: data.typeName || '',
                  region: data.region || 'other',
                  regionName: data.regionName || '',
                  description: data.description || data.desc || '',
                  established: data.established || '',
                  keyFields: Array.isArray(data.keyFields) ? data.keyFields : [],
                  featured: Boolean(data.featured),
                  contact: data.contact || '',
                  tier: data.tier,
                  level: data.level,
                  createdAt: data.createdAt,
                };
              });
              setMembers(list);
              setLoading(false);
            },
            (fallbackErr) => {
              console.error('[Admin Members] Fallback listener error:', fallbackErr);
              clearTimeout(timer);
              setLoading(false);
            }
          );
        }
      );
    } catch (e) {
      console.error('[Admin Members] Setup listener failed:', e);
      clearTimeout(timer);
      setLoading(false);
    }

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // 筛选与搜索
  const filteredMembers = members.filter((m) => {
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    const matchRegion = regionFilter === 'all' || m.region === regionFilter;

    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.description.toLowerCase().includes(term) ||
      (m.keyFields && m.keyFields.some((k) => k.toLowerCase().includes(term)));

    return matchType && matchRegion && matchSearch;
  });

  // 打开新增
  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      type: 'university',
      region: 'beijing',
      established: '2005',
      keyFieldsInput: '产学研合作, 成果转化',
      description: '',
      contact: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  // 打开编辑
  const handleOpenEdit = (item: MemberRecord) => {
    setEditingMember(item);
    setFormData({
      name: item.name,
      type: item.type || 'university',
      region: item.region || 'other',
      established: item.established || '',
      keyFieldsInput: Array.isArray(item.keyFields) ? item.keyFields.join(', ') : '',
      description: item.description,
      contact: item.contact || '',
      featured: Boolean(item.featured),
    });
    setIsModalOpen(true);
  };

  // 提交新增或修改
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('请填写机构名称', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const typeObj = TYPE_OPTIONS.find((t) => t.value === formData.type);
      const regionObj = REGION_OPTIONS.find((r) => r.value === formData.region);

      // 分割解析关键学科领域
      const parsedKeyFields = formData.keyFieldsInput
        .split(/[,，、]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        institution: formData.name.trim(),
        type: formData.type,
        typeName: typeObj?.label.split(' ')[0] || formData.type,
        region: formData.region,
        regionName: regionObj?.label.split(' ')[0] || formData.region,
        established: formData.established.trim(),
        keyFields: parsedKeyFields.length > 0 ? parsedKeyFields : ['产学研合作', '技术转移'],
        description: formData.description.trim(),
        desc: formData.description.trim(),
        contact: formData.contact.trim(),
        featured: Boolean(formData.featured),
        updatedAt: serverTimestamp(),
      };

      if (editingMember) {
        await updateDoc(doc(db, 'members', editingMember.id), payload);
        showToast('会员机构信息已成功更新，前台实时生效！', 'success');
      } else {
        await addDoc(collection(db, 'members'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast('新会员机构已成功入册并发布！', 'success');
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '操作失败';
      console.error('[Admin Members] Submit error:', err);
      showToast(`保存失败：${msg}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 切换精选状态
  const handleToggleFeatured = async (item: MemberRecord) => {
    try {
      await updateDoc(doc(db, 'members', item.id), {
        featured: !item.featured,
        updatedAt: serverTimestamp(),
      });
      showToast(`已${!item.featured ? '设为' : '取消'}精选展示机构`, 'success');
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
      await deleteDoc(doc(db, 'members', deleteTarget.id));
      showToast(`机构 "${deleteTarget.name}" 已成功删除`, 'success');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除失败';
      showToast(`删除失败：${msg}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 获取机构类型徽章
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'university':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'tech_park':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'enterprise':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
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
              会员网络管理 (Members Directory)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
              members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            维护英文站高校骨干产业、大学科技园与技术转移中介机构名录，数据直接同步至 Firestore (cauiice-site-en)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/en/network/members"
            target="_blank"
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            前台名录预览 ↗
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>+ 新增会员机构</span>
          </button>
        </div>
      </div>

      {/* 核心指标统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">入册机构总数</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{members.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">重点高校产业</div>
          <div className="text-2xl font-black text-blue-700 mt-1 font-mono">
            {members.filter((m) => m.type === 'university').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">国家大学科技园</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {members.filter((m) => m.type === 'tech_park').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">骨干企业与中介</div>
          <div className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {members.filter((m) => m.type === 'enterprise' || m.type === 'transfer_agency').length}
          </div>
        </div>
      </div>

      {/* 筛选与搜索工具条 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索机构名称、学科领域或简介..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="w-full md:w-auto flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">类型:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">全部类型</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">地区:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">全部省市</option>
              {REGION_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || typeFilter !== 'all' || regionFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setRegionFilter('all');
              }}
              className="text-xs text-blue-700 hover:underline px-2 py-1"
            >
              重置筛选
            </button>
          )}
        </div>
      </div>

      {/* 会员机构表格列表 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-800 border-t-transparent mb-3" />
            <p className="text-xs">正在从 Firestore 读取会员网络...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <div className="text-3xl mb-2">🏛️</div>
            <p>暂无符合筛选条件的会员机构</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">机构类型</th>
                  <th className="px-4 py-3 font-semibold min-w-[200px]">机构名称</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">所在区域</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">成立年份</th>
                  <th className="px-4 py-3 font-semibold min-w-[220px]">优势领域 / 学科</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">精选</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((item, idx) => {
                  const typeLabel = TYPE_OPTIONS.find((t) => t.value === item.type)?.label.split(' ')[0] || item.type;
                  const regionLabel = REGION_OPTIONS.find((r) => r.value === item.region)?.label.split(' ')[0] || item.region;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getTypeBadgeClass(item.type)}`}>
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 leading-snug">{item.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                        {regionLabel}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                        {item.established || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.keyFields && item.keyFields.length > 0 ? (
                            item.keyFields.map((k, ki) => (
                              <span
                                key={ki}
                                className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]"
                              >
                                {k}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer transition-colors ${
                            item.featured
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
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

      {/* 新增 / 编辑会员模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingMember ? '编辑会员机构' : '入册新会员机构'}
                </h3>
                <p className="text-xs text-slate-500">存入 Firestore members 集合 (cauiice-site-en)</p>
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
                <label className="block font-semibold text-slate-700 mb-1">机构名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：南京大学高新技术产业与孵化基地"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">机构类型 *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">所在省市 / 区域 *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">成立年份 (可选)</label>
                  <input
                    type="text"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    placeholder="例如：2008"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">联系人 / 官网 (可选)</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="例如：科技处 / https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">优势学科与转化领域 (以逗号分隔) *</label>
                <input
                  type="text"
                  required
                  value={formData.keyFieldsInput}
                  onChange={(e) => setFormData({ ...formData, keyFieldsInput: e.target.value })}
                  placeholder="例如：量子调控, 微纳电子, 环境生态"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">机构简介与产学研优势说明 *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="围绕基础科学研究与应用转化并重，设立多个中外科学家联合概念验证工场..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-member-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                />
                <label htmlFor="featured-member-checkbox" className="font-semibold text-slate-700 cursor-pointer">
                  设为首页/网络精选展示机构 (Featured Member)
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
                  {submitting ? '正在保存...' : editingMember ? '保存修改' : '确认入册'}
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
              <h3 className="text-base font-bold text-slate-900">确认删除该会员机构？</h3>
              <p className="text-xs text-slate-500 mt-1">
                机构“<span className="font-semibold text-slate-800">{deleteTarget.name}</span>”删除后无法撤销，前台名录将同步下架。
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

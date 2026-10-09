import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  NEWS_DATA,
  PROJECTS_DATA,
  MEMBERS_DATA,
  COMMITTEE_DATA,
  ORGANISATION_DATA,
  CONTACT_DATA,
  NewsItem,
  ProjectItem,
  MemberItem,
} from './enData';

/**
 * CAUIICE English Website - Firestore Collections
 * Dedicated to independent Firebase project `cauiice-site-en`.
 */
export const EN_COLLECTIONS = {
  NEWS: 'news',
  PROJECTS: 'projects',
  MEMBERS: 'members',
  ENQUIRIES: 'enquiries',
  SITE_CONFIG: 'siteConfig',
} as const;

/**
 * Enquiry Submission Interface
 */
export interface EnglishEnquiryPayload {
  institution: string;
  countryRegionCode: string;
  contactName: string;
  position?: string;
  email: string;
  cooperationCategoryCode: string;
  requirementSummary: string;
  privacyConsent: boolean;
  sourcePage?: string;
}

export interface EnglishEnquiryRecord extends EnglishEnquiryPayload {
  id?: string;
  status: 'pending' | 'reviewing' | 'contacted' | 'archived';
  createdAt: Timestamp | string;
}

/**
 * 1. Submit Partnership Enquiry
 * Securely writes visitor enquiry to `cauiice-site-en`'s `enquiries` collection.
 */
export async function submitEnglishEnquiry(
  payload: EnglishEnquiryPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docData = {
      institution: payload.institution.trim(),
      countryRegionCode: payload.countryRegionCode || 'CN',
      contactName: payload.contactName.trim(),
      position: payload.position ? payload.position.trim() : '',
      email: payload.email.trim().toLowerCase(),
      cooperationCategoryCode: payload.cooperationCategoryCode || 'JOINT_LAB',
      requirementSummary: payload.requirementSummary.trim(),
      privacyConsent: Boolean(payload.privacyConsent),
      sourcePage: payload.sourcePage || '/en/cooperation/enquiry',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, EN_COLLECTIONS.ENQUIRIES), docData);
    return { success: true, id: docRef.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown Firestore error';
    console.error('[English Firestore] submitEnglishEnquiry error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Helper to normalize Project status and field
 */
function normalizeProjectStatus(status?: string): { status: ProjectItem['status']; statusName: string } {
  const s = (status || '').toLowerCase();
  if (s === 'recruiting' || s.includes('open') || s.includes('招募')) {
    return { status: 'recruiting', statusName: '招募中' };
  }
  if (s === 'ongoing' || s.includes('进行')) {
    return { status: 'ongoing', statusName: '进行中' };
  }
  if (s === 'completed' || s.includes('已完成') || s.includes('已结项')) {
    return { status: 'completed', statusName: '已完成' };
  }
  return { status: 'preparing', statusName: '筹备中' };
}

function normalizeProjectField(field?: string): { field: ProjectItem['field']; fieldName: string } {
  const f = (field || '').toLowerCase();
  if (f === 'ai' || (f.includes('智能') && f.includes('计算')) || f.includes('人工智能')) {
    return { field: 'ai', fieldName: '人工智能' };
  }
  if (f === 'green_tech' || f.includes('绿色') || f.includes('低碳') || f.includes('能源')) {
    return { field: 'green_tech', fieldName: '绿色低碳' };
  }
  if (f === 'biomedicine' || f.includes('生物') || f.includes('医药') || f.includes('健康')) {
    return { field: 'biomedicine', fieldName: '生物医药' };
  }
  if (f === 'edutech' || f.includes('教育') || f.includes('产教')) {
    return { field: 'edutech', fieldName: '教育科技' };
  }
  return { field: 'smart_mfg', fieldName: '智能制造' };
}

function normalizeMemberType(type?: string): { type: MemberItem['type']; typeName: string } {
  const t = (type || '').toLowerCase();
  if (t === 'enterprise' || t.includes('企业')) {
    return { type: 'enterprise', typeName: '高校骨干企业' };
  }
  if (t === 'tech_park' || t.includes('园区') || t.includes('科技园')) {
    return { type: 'tech_park', typeName: '大学科技园' };
  }
  if (t === 'transfer_agency' || t.includes('转移') || t.includes('中介')) {
    return { type: 'transfer_agency', typeName: '技术转移机构' };
  }
  return { type: 'university', typeName: '重点高校产业' };
}

function normalizeMemberRegion(region?: string): { region: MemberItem['region']; regionName: string } {
  const r = (region || '').toLowerCase();
  if (r === 'beijing' || r.includes('北京')) return { region: 'beijing', regionName: '北京' };
  if (r === 'shanghai' || r.includes('上海')) return { region: 'shanghai', regionName: '上海' };
  if (r === 'jiangsu' || r.includes('江苏')) return { region: 'jiangsu', regionName: '江苏' };
  if (r === 'zhejiang' || r.includes('浙江')) return { region: 'zhejiang', regionName: '浙江' };
  if (r === 'guangdong' || r.includes('广东')) return { region: 'guangdong', regionName: '广东' };
  return { region: 'other', regionName: '其他主要省份' };
}

/**
 * 2. Fetch News (with fallback to default prototype dataset)
 */
export async function fetchEnglishNews(count: number = 20): Promise<NewsItem[]> {
  try {
    let snap;
    try {
      const q = query(
        collection(db, EN_COLLECTIONS.NEWS),
        orderBy('date', 'desc'),
        limit(count)
      );
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, EN_COLLECTIONS.NEWS));
    }

    if (snap && !snap.empty) {
      const items = snap.docs
        .map((d) => {
          const data = d.data();
          const cat = (data.category || 'work_updates') as NewsItem['category'];
          const catName =
            data.categoryName ||
            (cat === 'events' ? '会议与活动' : cat === 'policy_insights' ? '政策与行业观察' : '工作动态');
          return {
            id: d.id,
            title: data.title || '',
            category: cat,
            categoryName: catName,
            date: data.date || '',
            summary: data.summary || '',
            content: data.content || data.summary || '',
            image: data.image || '/globe.svg',
            readTime: data.readTime || '3 min',
            published: data.published !== false,
          };
        })
        .filter((item) => item.published !== false)
        .slice(0, count);

      if (items.length > 0) {
        return items;
      }
    }
  } catch (err) {
    console.warn('[English Firestore] fetchEnglishNews fallback to enData:', err);
  }
  return NEWS_DATA.slice(0, count);
}

/**
 * 2.1 Fetch Single News Item by Document ID (with fallback)
 */
export async function fetchEnglishNewsById(id: string): Promise<NewsItem | null> {
  if (!id) return null;
  try {
    const docRef = doc(db, EN_COLLECTIONS.NEWS, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.published === false) {
        return null;
      }
      const cat = (data.category || 'work_updates') as NewsItem['category'];
      const catName =
        data.categoryName ||
        (cat === 'events' ? '会议与活动' : cat === 'policy_insights' ? '政策与行业观察' : '工作动态');
      return {
        id: snap.id,
        title: data.title || '',
        category: cat,
        categoryName: catName,
        date: data.date || '',
        summary: data.summary || '',
        content: data.content || data.summary || '',
        image: data.image || '/globe.svg',
        readTime: data.readTime || '3 min',
        published: true,
      };
    }
  } catch (err) {
    console.warn(`[English Firestore] fetchEnglishNewsById (${id}) fallback:`, err);
  }

  // Fallback to local dataset
  const fallbackItem = NEWS_DATA.find((n) => n.id === id);
  if (fallbackItem && fallbackItem.published !== false) {
    return {
      ...fallbackItem,
      content: fallbackItem.content || fallbackItem.summary,
    };
  }

  return null;
}

/**
 * 3. Fetch Projects / Opportunities (with fallback)
 */
export async function fetchEnglishProjects(count: number = 30): Promise<ProjectItem[]> {
  try {
    let snap;
    try {
      const q = query(
        collection(db, EN_COLLECTIONS.PROJECTS),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, EN_COLLECTIONS.PROJECTS));
    }

    if (snap && !snap.empty) {
      const items = snap.docs.map((d) => {
        const data = d.data();
        const normStatus = normalizeProjectStatus(data.status);
        const normField = normalizeProjectField(data.field);
        return {
          id: d.id,
          title: data.title || data.name || '',
          field: normField.field,
          fieldName: data.fieldName || normField.fieldName,
          status: normStatus.status,
          statusName: data.statusName || normStatus.statusName,
          description: data.description || data.summary || data.desc || '',
          leadInstitution: data.leadInstitution || data.leadUniversity || data.chineseParty || '',
          targetRegion: data.targetRegion || data.target || data.country || '',
          deadline: data.deadline || '',
          date: data.date || data.period || '',
        };
      });

      if (items.length > 0) {
        return items.slice(0, count);
      }
    }
  } catch (err) {
    console.warn('[English Firestore] fetchEnglishProjects fallback to enData:', err);
  }
  return PROJECTS_DATA.slice(0, count);
}

/**
 * 4. Fetch Members (with fallback)
 */
export async function fetchEnglishMembers(count: number = 50): Promise<MemberItem[]> {
  try {
    let snap;
    try {
      const q = query(
        collection(db, EN_COLLECTIONS.MEMBERS),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, EN_COLLECTIONS.MEMBERS));
    }

    if (snap && !snap.empty) {
      const items = snap.docs.map((d) => {
        const data = d.data();
        const normType = normalizeMemberType(data.type);
        const normRegion = normalizeMemberRegion(data.region);
        return {
          id: d.id,
          name: data.name || data.institution || '',
          type: normType.type,
          typeName: data.typeName || normType.typeName,
          region: normRegion.region,
          regionName: data.regionName || normRegion.regionName,
          description: data.description || data.desc || '',
          established: data.established || '',
          keyFields: Array.isArray(data.keyFields) && data.keyFields.length > 0
            ? data.keyFields
            : ['产学研合作', '技术转移'],
        };
      });

      if (items.length > 0) {
        return items.slice(0, count);
      }
    }
  } catch (err) {
    console.warn('[English Firestore] fetchEnglishMembers fallback to enData:', err);
  }
  return MEMBERS_DATA.slice(0, count);
}

/**
 * 5. Fetch Site Configuration (Committee / Organisation / Contact)
 */
export async function fetchEnglishSiteConfig<T>(docKey: 'committee' | 'organisation' | 'contact' | 'international' | 'members' | 'gaikuang'): Promise<T> {
  try {
    const snap = await getDoc(doc(db, EN_COLLECTIONS.SITE_CONFIG, docKey));
    if (snap.exists()) {
      return snap.data() as T;
    }
  } catch (err) {
    console.warn(`[English Firestore] fetchEnglishSiteConfig (${docKey}) fallback:`, err);
  }

  if (docKey === 'committee') return COMMITTEE_DATA as unknown as T;
  if (docKey === 'organisation') return ORGANISATION_DATA as unknown as T;
  if (docKey === 'contact') return CONTACT_DATA as unknown as T;
  return {} as T;
}

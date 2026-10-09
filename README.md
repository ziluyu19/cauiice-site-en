# CAUIICE 国际门户与内容管理系统 (International Portal & CMS)

中国高校校办产业协会国际合作与交流专业委员会（CAUIICE / 国专委）官方英文数字化门户与管理后台内容管理系统。

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)

---

## 目录 (Table of Contents)

- [项目概述 (Project Overview)](#项目概述-project-overview)
- [核心功能架构 (Key Features)](#核心功能架构-key-features)
  - [前台公共英文门户 (Public English Portal)](#前台公共英文门户-public-english-portal)
  - [后台内容管理系统 (Administration CMS)](#后台内容管理系统-administration-cms)
- [技术栈选型 (Technology Stack)](#技术栈选型-technology-stack)
- [项目目录结构 (Project Structure)](#项目目录结构-project-structure)
- [环境依赖要求 (Requirements)](#环境依赖要求-requirements)
- [本地安装与开发 (Installation & Local Development)](#本地安装与开发-installation--local-development)
- [环境变量配置 (Environment Variables)](#环境变量配置-environment-variables)
- [Firebase 云端配置与数据层 (Firebase Configuration)](#firebase-云端配置与数据层-firebase-configuration)
  - [独立云端项目 (Dedicated Project)](#独立云端项目-dedicated-project)
  - [Firestore 集合架构 (Firestore Collections)](#firestore-集合架构-firestore-collections)
  - [安全规则概述 (Security Rules)](#安全规则概述-security-rules)
  - [基础数据初始化脚本 (Data Seeding Script)](#基础数据初始化脚本-data-seeding-script)
- [管理员权限与后台访问 (Administrator Access)](#管理员权限与后台访问-administrator-access)
- [项目构建与测试验证 (Build & Validation)](#项目构建与测试验证-build--validation)
- [安全合规守则 (Security Notes)](#安全合规守则-security-notes)
- [部署状态与后续规划 (Deployment Status & Roadmap)](#部署状态与后续规划-deployment-status--roadmap)
- [知识产权与法定声明 (License & Disclaimer)](#知识产权与法定声明-license--disclaimer)

---

## 项目概述 (Project Overview)

**中国高校校办产业协会国际合作与交流专业委员会**（International Cooperation and Exchange Committee of the Chinese Association of University-run Industries，简称 **CAUIICE / 国专委**）是全国高校产业体系开展涉外科技合作、国际产学研协同创新、科技成果跨境转化与跨国交流合作的专业化组织平台。

本项目是专为国际受众打造的**官方英文版数字化综合门户**（`/en`）与配套的**内容管理系统 CMS**（`/admin`），旨在面向海外大学、国际科研机构、跨国科技园区、海外商协会及科技投资伙伴，提供权威透明的展示与联络通道：

- **展示法定定位与组织治理**：清晰呈现专委会历史背景、业务职责、理事会领导与常设秘书处架构。
- **发布国际产学研合作项目**：集中展示智能制造、绿色低碳、生物医药、人工智能、教育科技等重点领域项目。
- **呈现中国高校科技园网络**：展示重点大学产业、国家大学科技园、骨干校办企业与技术转移机构名录。
- **提供英文资讯与政策洞察**：发布涉外工作动态、国际学术年会活动与科技成果跨境转化合规观察。
- **标准化对接意向通道**：提供符合国际隐私规范的 8 大字段标准化在线询盘通道，促进中外协同精准撮合。

---

## 核心功能架构 (Key Features)

### 前台公共英文门户 (Public English Portal)

所有英文公共页面均统一组织在 `/en` 路由体系下：

| 页面路由 (Route) | 页面名称 (Page) | 核心功能与实现特性 (Key Capabilities) |
| :--- | :--- | :--- |
| `/en` | **英文综合首页 (Home Portal)** | 顶部 Hero 视觉横幅、专委会使命定位、关键合作指标动态统计、精选国际合作项目轮播、最新工作动态与快捷服务入口。 |
| `/en/about` | **机构概况导览 (About Index)** | 专委会简介导航总览页，引导访客浏览机构职责与治理机制。 |
| `/en/about/committee` | **专委会定位 (Committee Profile)** | 介绍机构总览、法定地位、依托网络与服务范畴。前台动态绑定 Cloud Firestore 的 `siteConfig/committee` 文档。 |
| `/en/about/organisation` | **组织架构与治理 (Organisation & Governance)** | 呈现理事会体制、常设秘书处职能部门分布及专业委员会分工。动态绑定 Cloud Firestore 的 `siteConfig/organisation` 文档。 |
| `/en/cooperation` | **国际合作中心 (Cooperation Hub)** | 国际产学研合作体系说明与四步标准化合作落地工作流程。 |
| `/en/cooperation/projects` | **合作项目库 (Projects Directory)** | 支持按技术领域（智能制造、绿色低碳、生物医药、人工智能、教育科技）与项目状态（招募中、进行中、筹备中、已结项）多维筛选，动态拉取 Firestore `projects` 集合。 |
| `/en/cooperation/enquiry` | **合作意向对接 (Partnership Enquiry)** | 标准化 8 字段对接表单（机构名称、国家地区、联系人、职务、邮箱、合作类型、诉求摘要、隐私协议），经字段白名单校验后安全写入 Firestore `enquiries` 集合。 |
| `/en/network` | **合作网络总览 (Network Overview)** | 介绍全国重点高校、国家大学科技园与骨干产业网络的辐射广度与区域分布。 |
| `/en/network/members` | **会员机构名录 (Member Directory)** | 支持按机构性质（高校产业、科技园区、骨干企业、转移机构）与主要地域进行交互筛选，动态拉取 Firestore `members` 集合。 |
| `/en/news` | **新闻资讯中心 (News & Insights)** | 包含工作动态 (`work_updates`)、会议活动 (`events`)、政策观察 (`policy_insights`) 三大分类切换与分页浏览，动态读取 Firestore `news` 集合。 |
| `/en/news/[id]` | **新闻全文阅读 (News Detail)** | 动态路由页面，支持核心摘要展示、官方发文信息核验、格式化正文段落排版、返回列表联动及无效 ID 的 404 优雅容错。 |
| `/en/contact` | **秘书处联络 (Contact Secretariat)** | 官方秘书处各专业部门直线电话、专用电子邮箱、来信渠道与在线对接入口。动态绑定 Cloud Firestore 的 `siteConfig/contact` 文档。 |

### 后台内容管理系统 (Administration CMS)

后台管理功能位于 `/admin` 路由体系下，专门服务于英文站日常运营：

- **安全认证与权限守卫 (`/admin/login` & `/admin/dashboard/layout.tsx`)**：
  - 基于 Firebase Authentication 提供邮箱与密码双重认证。
  - 严密校验登录用户的 UID 是否匹配环境变量 `NEXT_PUBLIC_ADMIN_UID`。
  - 未登录访客或非管理员账号访问受保护的 `/admin/dashboard/*` 页面时，系统将在 800ms 内自动重定向至 `/admin/login`。
- **控制台工作台 (`/admin/dashboard`)**：
  - 实时统计并展示新闻资讯、国际项目、会员网络及合作意向 4 大业务对象的最新数据规模与监控快捷卡片。
- **新闻资讯管理 (`/admin/dashboard/news`)**：
  - 支持新增、编辑、删除新闻，维护标题、日期、分类标签、核心摘要、全文正文及阅读时长。
- **合作项目管理 (`/admin/dashboard/projects`)**：
  - 维护跨国合作项目全生命周期，支持设置牵头高校、外方机构、合作目标、所属技术领域与项目阶段状态。
- **会员网络管理 (`/admin/dashboard/members`)**：
  - 维护中国高校科技园与产业会员档案，录入机构分类、所在省市、成立年份、业务简介与核心学科方向。
- **合作意向管理 (`/admin/dashboard/enquiries`)**：
  - 查看前台访客提交的合作意向工单，支持按状态（待处理 `pending`、初审中 `reviewing`、已对接 `contacted`、已归档 `archived`）进行流转办理。
- **站点与组织配置 (`/admin/dashboard/profile`)**：
  - 三栏式表单编辑器，分别维护专委会定位（`siteConfig/committee`）、组织架构（`siteConfig/organisation`）与联络专线（`siteConfig/contact`），提交后即时在云端 Firestore 生效。

---

## 技术栈选型 (Technology Stack)

| 体系分层 (Layer) | 选型技术 (Technology) | 版本与架构说明 (Details) |
| :--- | :--- | :--- |
| **基础核心框架** | **Next.js** | `v16.3.5`（App Router 架构，Turbopack 极速编译引擎） |
| **前端视图库** | **React** | `v19.2.8`（Hooks 状态驱动，React Server Components 服务端组件） |
| **开发编程语言** | **TypeScript** | `v5.x`（前后端数据模型强类型约束，契约级接口规范） |
| **原子化样式** | **Tailwind CSS** | `v4.x`（基于 `@tailwindcss/postcss`，现代科技政务蓝视觉规范） |
| **云端文档数据库** | **Cloud Firestore** | Google Firebase 分布式 NoSQL 文档数据库，支持客户端毫秒级读取与订阅 |
| **身份认证安全** | **Firebase Auth** | 生产级管理员身份认证体系，UID 级精确访问控制 |
| **本地管理工具** | **Firebase Admin SDK** | `v14.5.0`，用于高特权 CLI 脚本安全执行可信数据初始化与自动化验证 |

---

## 项目目录结构 (Project Structure)

```text
companysite-en/
├── app/                               # Next.js App Router 根路由
│   ├── layout.tsx                     # 全局根布局 (含全站元数据与 Favicon)
│   ├── page.tsx                       # 根路径访问处理
│   ├── globals.css                    # Tailwind CSS v4 样式定义
│   ├── en/                            # 英文公共门户模块
│   │   ├── layout.tsx                 # 英文门户专属布局 (集成 EnglishHeader 与 EnglishFooter)
│   │   ├── page.tsx                   # 英文首页
│   │   ├── about/                     # 机构介绍模块
│   │   │   ├── page.tsx               # 机构概况
│   │   │   ├── committee/page.tsx     # 专委会法定定位 (动态读取 siteConfig/committee)
│   │   │   └── organisation/page.tsx  # 组织架构与职责 (动态读取 siteConfig/organisation)
│   │   ├── cooperation/               # 国际合作模块
│   │   │   ├── page.tsx               # 合作总览
│   │   │   ├── projects/page.tsx      # 合作项目检索与筛选
│   │   │   └── enquiry/page.tsx       # 合作意向表单
│   │   ├── network/                   # 会员网络模块
│   │   │   ├── page.tsx               # 网络总览
│   │   │   └── members/page.tsx       # 会员目录检索与筛选
│   │   ├── news/                      # 新闻资讯模块
│   │   │   ├── page.tsx               # 新闻列表与分类分页
│   │   │   └── [id]/page.tsx          # 新闻全文详情动态路由
│   │   └── contact/                   # 官方联络
│   │       └── page.tsx               # 秘书处联络方式 (动态读取 siteConfig/contact)
│   └── admin/                         # 后台管理 CMS 模块
│       ├── login/page.tsx             # Firebase 认证登录页
│       └── dashboard/                 # 受保护的管理工作台
│           ├── layout.tsx             # 后台侧边栏布局与 Auth Guard 守卫
│           ├── page.tsx               # 运营指标概览
│           ├── news/page.tsx          # 新闻资讯管理
│           ├── projects/page.tsx      # 合作项目管理
│           ├── members/page.tsx       # 会员网络管理
│           ├── enquiries/page.tsx     # 合作意向管理
│           └── profile/page.tsx       # 站点配置管理 (专委会/架构/联系)
├── components/
│   └── en/                            # 英文门户复用 UI 组件
│       ├── EnglishHeader.tsx          # 顶部主导航栏
│       ├── EnglishFooter.tsx          # 页脚声明与版权
│       ├── InquiryForm.tsx            # 合作意向表单组件
│       ├── NewsCard.tsx               # 新闻卡片组件
│       ├── ProjectCard.tsx            # 项目卡片组件
│       ├── MemberCard.tsx             # 会员卡片组件
│       ├── FilterBar.tsx              # 分类筛选控制器
│       ├── ProcessSteps.tsx           # 合作流程组件
│       └── FAQ.tsx                    # 常见疑问解答组件
├── lib/
│   ├── firebase.ts                    # Firebase Web SDK 客户端初始化
│   ├── enFirestore.ts                 # Firestore 数据操作与归一化逻辑
│   └── enData.ts                      # 英文站基线数据模型、常量与本地 Fallback
├── scripts/
│   ├── seed-en-firestore.mjs          # Admin SDK 基础数据安全初始化脚本
│   └── verify-acceptance.mjs         # 自动化验收验证脚本 (校验数据与安全规则)
├── firestore.rules                    # Cloud Firestore 安全规则文件
├── next.config.ts                     # Next.js 配置文件
├── tsconfig.json                      # TypeScript 配置文件
├── package.json                       # 项目依赖与 Scripts 指令
└── .gitignore                         # Git 忽略文件规则
```

---

## 环境依赖要求 (Requirements)

在本地运行或构建本项目前，请确保本地计算机已安装以下环境：

- **Node.js**：`>= 18.18.0`（推荐使用 Node.js LTS `20.x` 或 `22.x`，实测完全兼容 Node.js `24.x`）。
- **包管理器**：`npm >= 9.x`（亦可使用 `pnpm` 或 `yarn`）。
- **浏览器**：主流现代浏览器（Google Chrome、Microsoft Edge、Mozilla Firefox 等）。

---

## 本地安装与开发 (Installation & Local Development)

### 1. 克隆代码仓库

```bash
git clone https://github.com/ziluyu19/cauiice-site-en.git
cd cauiice-site-en
```

### 2. 安装项目依赖

```bash
npm install
```

### 3. 配置本地环境变量

在项目根目录下创建 `.env.local` 文件：

```bash
# Linux / macOS 环境
cp .env.example .env.local

# Windows PowerShell 环境
Copy-Item .env.example .env.local
```

使用文本编辑器打开 `.env.local`，填入您的 Firebase 开发者配置参数（参考下文 [环境变量配置](#环境变量配置-environment-variables)）。

### 4. 启动本地开发服务器

```bash
npm run dev
```

启动成功后，在浏览器中访问：

- **前台英文门户**：[http://localhost:3000/en](http://localhost:3000/en)
- **后台管理控制台**：[http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **管理员登录页**：[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

*(若本地 3000 端口已被占用，Next.js 会自动切换至 3001 端口)*

---

## 环境变量配置 (Environment Variables)

系统通过 `.env.local` 读取 Firebase 与管理权限配置。以下为代码中实际调用的环境变量清单：

| 环境变量名称 (Variable Name) | 必填性 (Required) | 用途说明 (Description) |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **必填** | Firebase Web API 访问密钥 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **必填** | Firebase 认证授权域名 (`<project-id>.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **必填** | 英文站专用 Firebase 项目 ID (`cauiice-site-en`) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | **必填** | Firebase Storage 存储桶地址 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **必填** | Firebase 云推送发送方 ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **必填** | Firebase Web 应用程序 App ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | 可选 | Google Analytics 网站分析统计 ID (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_ADMIN_UID` | **必填** | 经授权的管理员账号 UID（与 Firebase Auth 和安全规则联动） |
| `NEXT_PUBLIC_ZH_SITE_URL` | 可选 | 中文主站跳转地址（默认 `http://localhost:3000`） |
| `GOOGLE_APPLICATION_CREDENTIALS` | 可选 | 本地服务账号 JSON 凭据路径（仅供本地 Admin CLI 脚本使用） |

### 环境变量参考模板 (`.env.example`)

> [!WARNING]
> `.env.local` 属于受忽略的本地敏感文件，**严禁提交至公共 Git 仓库**。请仅使用占位符示例：

```env
# Firebase Web 客户端配置 (专用项目: cauiice-site-en)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-web-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="cauiice-site-en.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="cauiice-site-en"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="cauiice-site-en.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-web-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# 经授权的管理员 UID (在 cauiice-site-en 的 Firebase Console 中生成)
NEXT_PUBLIC_ADMIN_UID="your-authorized-admin-uid"

# 中文主站跳转地址 (开发环境默认 http://localhost:3000)
NEXT_PUBLIC_ZH_SITE_URL="http://localhost:3000"
```

---

## Firebase 云端配置与数据层 (Firebase Configuration)

### 独立云端项目 (Dedicated Project)

英文网站全面连接独立的专用 Firebase 云端项目：**`cauiice-site-en`**。与中文站数据库完全物理隔离，互不干扰，确保数据生命周期与权限边界清晰独立。

### Firestore 集合架构 (Firestore Collections)

数据库划分为 5 个核心集合：

1. **`news`（新闻资讯）**：存储涉外工作动态与智库观察。
   - 读取权限：全网公开读取 (`allow read: if true;`)
   - 写入权限：仅限已认证管理员 (`allow write: if isAdmin();`)
2. **`projects`（合作项目）**：存储跨国合作与对接项目。
   - 读取权限：全网公开读取
   - 写入权限：仅限已认证管理员
3. **`members`（会员机构）**：存储高校科技园与会员名录。
   - 读取权限：全网公开读取
   - 写入权限：仅限已认证管理员
4. **`siteConfig`（站点配置）**：存储专委会介绍、组织架构、联系方式等机构级全局文档。
   - 固定文档：`committee`、`organisation`、`contact`
   - 读取权限：全网公开读取
   - 写入权限：仅限已认证管理员
5. **`enquiries`（合作意向与询盘）**：存储前台访客提交的需求信息。
   - 写入权限：全网访客可提交，实施白名单字段限制与长度校验（`size() <= 4000`）。
   - 查看与流转权限：**严禁公开读取，仅限管理员查看、更新与删除**。

### 安全规则概述 (Security Rules)

项目根目录包含 [`firestore.rules`](file:///d:/companysite-en/firestore.rules)，安全规则具备以下设计：

- **管理员身份校验**：
  ```javascript
  function isAdmin() {
    return request.auth != null && request.auth.uid == '<配置的管理员UID>';
  }
  ```
- **询盘白名单防御**：禁止任何非白名单字段注入。
- **默认全盘拒绝 (Default Deny)**：未显式声明规则的集合一律默认拒绝读写：
  ```javascript
  match /{document=**} {
    allow read, write: if false;
  }
  ```

### 基础数据初始化脚本 (Data Seeding Script)

若需要在 `cauiice-site-en` 中建立基线测试数据：

1. 在 Firebase 控制台（项目设置 -> 服务账号）生成临时服务账号密钥文件。
2. 将文件保存为本地根目录下的 `service-account.json`（已被 `.gitignore` 自动忽略）。
3. 运行初始化脚本：
   ```bash
   node scripts/seed-en-firestore.mjs
   ```
4. 脚本将安全写入：新闻 4 条、合作项目 4 条、会员 7 条、站点配置 3 条。
5. **初始化完成后，必须立即从本地删除该服务账号 JSON 文件，并在控制台中注销对应临时密钥**。

---

## 管理员权限与后台访问 (Administrator Access)

- **后台入口**：`/admin/login`
- **认证流程**：
  1. 管理员输入在 `cauiice-site-en` 认证中心注册的邮箱与密码。
  2. 客户端调用 Firebase Auth 的 `signInWithEmailAndPassword` 校验凭据。
  3. 认证成功后，系统校验 `user.uid === process.env.NEXT_PUBLIC_ADMIN_UID`。
  4. 验证通过后进入管理后台；若 UID 不匹配，系统将自动登出并提示无管理员权限。

> [!IMPORTANT]
> 代码仓库**不包含且禁止包含**任何硬编码的管理员账号密码。管理员账号需在 Firebase Console 的 `Authentication` 模块中创建。

---

## 项目构建与测试验证 (Build & Validation)

### 生产环境构建

执行 Next.js 生产优化构建：

```bash
npm run build
```

该命令将执行 TypeScript 类型检查、样式压缩打包与全站 32 个页面的静态/动态优化生成。

### 自动化验收测试

本地提供自动化验收脚本，用于核验数据读取完整性与安全规则防越权拦截能力：

```bash
node scripts/verify-acceptance.mjs
```

### 功能验证状态对照表

| 验证项 (Item) | 实际状态 (Status) | 验证方式与细节 (Verification Method) |
| :--- | :---: | :--- |
| **真实浏览器新闻详情点击与跳转** | **已实测通过** | 通过 Edge CDP 进行真实视口点击，进入 `/en/news/[id]`，验证 H1、摘要、正文、返回按钮与 404 容错。 |
| **前台合作意向表单提交流程** | **已实测通过** | 在 `/en/cooperation/enquiry` 真实填写并提交，前台渲染成功屏，记录正确落盘至 Firestore。 |
| **敏感询盘防越权未认证拦截** | **已实测通过** | 未认证调用 `getDocs(collection(db, 'enquiries'))`，被安全规则拦截并返回 `permission-denied`。 |
| **内容防越权未认证写入拦截** | **已实测通过** | 未认证调用 `setDoc` 写入 `news` / `projects` / `siteConfig`，被拦截并返回 `permission-denied`。 |
| **后台未登录权限守卫拦截** | **已实测通过** | 真实浏览器未登录访问 `/admin/dashboard`，被自动重定向至 `/admin/login`。 |
| **生产打包构建 (npm run build)** | **已实测通过** | Next.js 16.3.5 Turbopack 编译通过，TypeScript 检查 0 报错，页面成功生成。 |
| **后台内容管理闭环 (增/改/删)** | *需人工登录验证* | 云端安全规则绑定管理员私有凭证，需在 `/admin/login` 凭真实管理员账号密码登录后实测。 |

---

## 安全合规守则 (Security Notes)

1. **凭证隔离与防泄漏**：严禁将包含真实私钥的 `.env.local` 或服务账号密钥（`*service-account*.json`）提交至 Git 代码仓库。
2. **权限对齐**：确保云端 `firestore.rules` 中的管理员 UID 与 `.env.local` 中的 `NEXT_PUBLIC_ADMIN_UID` 保持一致。
3. **隐私信息保护**：前台合作意向包含机构联络人姓名、职位与邮箱，严格遵循云端安全规则，绝不向未认证公众暴露 `enquiries` 集合读取接口。
4. **最小特权原则**：客户端代码仅使用受限的 Firebase Web API 权限，所有高风险管理行为均需通过身份鉴权后执行。

---

## 部署状态与后续规划 (Deployment Status & Roadmap)

### 当前状态 (Current Status)

- **本地开发与联调完毕**：系统已完成前后台功能对齐、冗余模块剥离、真实浏览器点击测试、安全规则验证与生产打包构建。
- **公网部署状态**：**尚未部署至生产托管平台**（如 Firebase App Hosting、Vercel 或独立云服务器）。

### 后续规划 (Roadmap)

- [ ] 接入生产托管环境（Firebase App Hosting / 云服务器容器化部署）。
- [ ] 绑定正式机构独立域名与配置 SSL 安全证书。
- [ ] 完善中英文双语前台一键切换联动机制。
- [ ] 接入自动化 CI/CD 流水线，实施代码提交与构建自动化检查。

---

## 知识产权与法定声明 (License & Disclaimer)

1. **机构性质说明**：中国高校校办产业协会国际合作与交流专业委员会（CAUIICE）系中国高校校办产业协会所属分支机构，非独立法人社会团体。
2. **版权声明**：&copy; 2026 中国高校校办产业协会国际合作与交流专业委员会 版权所有 (All Rights Reserved)。
3. **软件授权**：本系统源代码归专委会专属所有，主要用于官方数字化建设与运营维护。

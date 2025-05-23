# Token Sprint 项目文档索引

## 文档概览

本文档集合为 Token Sprint 项目提供全面的技术文档，帮助开发者和 AI 快速理解项目的架构、设计和实现细节。

## 📚 文档目录

### 1. [项目概述 (README.md)](./README.md)
**适用对象**: 所有用户、开发者、项目管理者

**内容概要**:
- 项目基本信息和功能介绍
- 技术栈和依赖说明
- 核心特性和设计理念
- 快速开始指南
- 部署和运行说明

**关键信息**:
- Next.js 15 + React 19 + TypeScript
- 双语支持（中文/英文）
- 两个核心工具：Token 生成速度可视化器、LLM 显存计算器
- 基于 shadcn/ui + Tailwind CSS 的现代化 UI

---

### 2. [技术架构 (ARCHITECTURE.md)](./ARCHITECTURE.md)
**适用对象**: 技术负责人、架构师、高级开发者

**内容概要**:
- 整体架构设计和技术决策
- Next.js App Router 架构详解
- 国际化实现方案
- 组件架构和状态管理
- 性能优化策略
- 数据流和错误处理

**关键信息**:
- 基于 App Router 的现代化架构
- 配置驱动的国际化设计
- 分层组件架构
- React 内置状态管理策略
- 服务端渲染和静态生成优化

---

### 3. [组件设计 (COMPONENTS.md)](./COMPONENTS.md)
**适用对象**: 前端开发者、UI/UX 设计师

**内容概要**:
- 组件分层架构详解
- UI 基础组件设计规范
- 业务组件实现模式
- 组件设计模式和最佳实践
- 可访问性设计指南
- 性能优化技巧

**关键信息**:
- 基于 shadcn/ui 的组件系统
- 组合模式和渲染属性模式
- 受控/非受控组件设计
- ARIA 属性和键盘导航支持
- React.memo 和 useCallback 优化

---

### 4. [样式设计 (STYLING.md)](./STYLING.md)
**适用对象**: 前端开发者、UI/UX 设计师

**内容概要**:
- 设计系统和样式架构
- 颜色、字体、间距规范
- Tailwind CSS 配置和使用
- 主题切换系统
- 响应式设计策略
- 动画和过渡效果

**关键信息**:
- CSS 变量驱动的主题系统
- 原子化 CSS 方法论
- 移动优先的响应式设计
- 可访问性样式支持
- 性能优化的 CSS 策略

---

### 5. [开发指南 (DEVELOPMENT.md)](./DEVELOPMENT.md)
**适用对象**: 开发者、新团队成员

**内容概要**:
- 开发环境设置和配置
- 项目结构详细说明
- 开发流程和工作规范
- 代码规范和最佳实践
- 测试策略和调试技巧
- 部署和故障排除

**关键信息**:
- 完整的开发环境搭建流程
- 新功能和新语言添加指南
- TypeScript 和 React 编码规范
- Git 提交规范和 PR 流程
- 单元测试、组件测试、E2E 测试策略

---

## 🎯 快速导航

### 按角色分类

#### 🔧 开发者
1. **新手入门**: README.md → DEVELOPMENT.md
2. **架构理解**: ARCHITECTURE.md → COMPONENTS.md
3. **样式开发**: STYLING.md → COMPONENTS.md
4. **功能开发**: DEVELOPMENT.md → ARCHITECTURE.md

#### 🎨 设计师
1. **设计系统**: STYLING.md → COMPONENTS.md
2. **组件规范**: COMPONENTS.md → STYLING.md
3. **用户体验**: README.md → ARCHITECTURE.md

#### 🏗️ 架构师
1. **技术架构**: ARCHITECTURE.md → DEVELOPMENT.md
2. **设计决策**: ARCHITECTURE.md → COMPONENTS.md
3. **性能优化**: ARCHITECTURE.md → STYLING.md

#### 🤖 AI 助手
1. **项目理解**: README.md → ARCHITECTURE.md → COMPONENTS.md
2. **代码生成**: DEVELOPMENT.md → COMPONENTS.md → STYLING.md
3. **问题解决**: DEVELOPMENT.md → ARCHITECTURE.md

### 按功能分类

#### 🚀 快速开始
- [项目概述](./README.md#项目概述)
- [技术栈](./README.md#技术栈)
- [开发环境设置](./DEVELOPMENT.md#开发环境设置)

#### 🏛️ 架构设计
- [架构概览](./ARCHITECTURE.md#架构概览)
- [核心架构决策](./ARCHITECTURE.md#核心架构决策)
- [组件架构](./COMPONENTS.md#组件架构概览)

#### 🎨 UI/UX 设计
- [设计系统](./STYLING.md#设计系统概览)
- [组件设计](./COMPONENTS.md#ui-基础组件层)
- [样式规范](./STYLING.md#颜色系统)

#### 💻 开发实践
- [开发流程](./DEVELOPMENT.md#开发流程)
- [代码规范](./DEVELOPMENT.md#代码规范)
- [测试策略](./DEVELOPMENT.md#测试策略)

#### 🔧 技术实现
- [国际化](./ARCHITECTURE.md#国际化架构)
- [状态管理](./ARCHITECTURE.md#状态管理策略)
- [性能优化](./ARCHITECTURE.md#性能优化策略)

## 📖 文档使用建议

### 对于新加入的开发者
1. **第一天**: 阅读 README.md 了解项目概况
2. **第二天**: 按照 DEVELOPMENT.md 设置开发环境
3. **第三天**: 学习 ARCHITECTURE.md 理解技术架构
4. **第四天**: 研究 COMPONENTS.md 掌握组件设计
5. **第五天**: 熟悉 STYLING.md 了解样式系统

### 对于 AI 助手
1. **理解项目**: 先读 README.md 获取项目全貌
2. **掌握架构**: 通过 ARCHITECTURE.md 理解技术决策
3. **学习模式**: 从 COMPONENTS.md 学习组件设计模式
4. **代码生成**: 参考 DEVELOPMENT.md 的代码规范
5. **样式处理**: 使用 STYLING.md 的设计系统

### 对于问题解决
- **功能问题**: DEVELOPMENT.md → ARCHITECTURE.md
- **样式问题**: STYLING.md → COMPONENTS.md
- **架构问题**: ARCHITECTURE.md → DEVELOPMENT.md
- **组件问题**: COMPONENTS.md → STYLING.md

## 🔄 文档维护

### 更新频率
- **README.md**: 项目重大变更时更新
- **ARCHITECTURE.md**: 架构调整时更新
- **COMPONENTS.md**: 新增组件或设计模式时更新
- **STYLING.md**: 设计系统变更时更新
- **DEVELOPMENT.md**: 开发流程或规范变更时更新

### 维护原则
1. **及时性**: 代码变更后及时更新文档
2. **准确性**: 确保文档与实际代码一致
3. **完整性**: 覆盖所有重要的技术细节
4. **可读性**: 使用清晰的结构和示例
5. **实用性**: 提供可操作的指导信息

## 📞 获取帮助

如果在阅读文档过程中遇到问题：

1. **检查相关文档**: 使用上述导航快速定位相关内容
2. **查看代码示例**: 文档中的代码示例都来自实际项目
3. **参考项目代码**: 结合实际代码理解文档内容
4. **提出问题**: 通过 Issue 或 PR 提出文档改进建议

---

*最后更新时间: 2024年12月*
*文档版本: v1.0* 
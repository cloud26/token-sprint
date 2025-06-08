# i18n Messages 组织最佳实践

## 当前结构分析

你们目前的结构已经相当不错，采用了功能域 + 通用组件的混合模式：

```
common/          # ✅ 通用组件和UI元素
tools/           # ✅ 按功能工具分组
  llmGpuCalculator/models/  # ✅ 模型配置嵌套在工具内
  tokenCounter/models/      # ✅ 保持一致性
```

## 推荐的组织原则

### 1. 混合式结构（推荐）

```javascript
{
  // 通用层 - 可复用组件
  "common": {
    "ui": {},           // 按钮、表单、提示等
    "navigation": {},   // 导航相关
    "validation": {},   // 表单验证消息
    "actions": {}       // 通用操作文案
  },
  
  // 页面层 - 页面特定内容
  "pages": {
    "home": { "metadata": {}, "content": {} },
    "about": { "metadata": {}, "content": {} }
  },
  
  // 功能域层 - 业务功能分组
  "tools": {
    "tokenCounter": {
      "ui": {},         // 工具特有UI
      "models": {},     // 模型配置
      "metadata": {},   // SEO元数据
      "business": {}    // 业务逻辑文案
    }
  },
  
  // 领域概念层 - 跨功能的业务概念
  "domains": {
    "ai": {
      "models": {},     // 通用模型概念
      "gpu": {},        // GPU相关概念
      "tokens": {}      // Token相关概念
    }
  }
}
```

### 2. 组织原则优先级

1. **复用性优先** - 通用内容放在 `common`
2. **功能内聚** - 相关功能放在同一个工具内
3. **概念分离** - 跨工具的概念提取到域层
4. **维护便利** - 相似结构保持一致

## 当前结构的优化建议

### 优化点 1: 元数据分离

**当前:**
```javascript
"tools": {
  "tokenCounter": {
    "title": "...",
    "metadata": {
      "title": "...",
      "description": "..."
    }
  }
}
```

**建议优化:**
```javascript
// 选项A: 保持现状（推荐）
"tools": {
  "tokenCounter": {
    "ui": { "title": "..." },
    "metadata": { "title": "...", "description": "..." },
    "models": {}
  }
}

// 选项B: 完全分离
"metadata": {
  "tools": {
    "tokenCounter": { "title": "...", "description": "..." }
  }
}
```

### 优化点 2: 跨工具概念提取

**当前问题:** GPU相关内容在多个地方重复

**建议:**
```javascript
"domains": {
  "gpu": {
    "models": {
      "h100": { "name": "NVIDIA H100", "memory": "80GB" },
      "rtx4090": { "name": "RTX 4090", "memory": "24GB" }
    },
    "brands": {
      "nvidia": "NVIDIA",
      "amd": "AMD"
    }
  }
}
```

### 优化点 3: 模板系统改进

**当前的插值模板已经很好:**
```javascript
"seoTitle": "{modelName} Calculator | {features}"
```

**可以进一步优化:**
```javascript
"templates": {
  "seo": {
    "toolTitle": "{toolName} | {features}",
    "toolDescription": "Free {toolName} for {useCases}. {features}."
  }
}
```

## 实际应用建议

### 对于你们的项目

**保持当前结构的优点:**
- `tools.{toolName}.models` 的层次结构很清晰
- 插值模板减少了重复代码
- `common` 部分复用性好

**可以考虑的小幅优化:**

1. **加强一致性:**
```javascript
// 统一结构
"tools": {
  "tokenCounter": {
    "ui": {},        // 界面文案
    "models": {},    // 模型配置  
    "metadata": {},  // SEO元数据
    "business": {}   // 业务指南
  },
  "gpuCalculator": {
    "ui": {},
    "models": {},
    "metadata": {},
    "business": {}
  }
}
```

2. **提取共同概念:**
```javascript
"domains": {
  "ai": {
    "companies": {
      "openai": "OpenAI",
      "anthropic": "Anthropic",
      "meta": "Meta"
    }
  }
}
```

## 维护建议

### 文件拆分策略

对于大型项目，考虑拆分文件：

```
messages/
├── en/
│   ├── common.json      # 通用组件
│   ├── pages.json       # 页面内容
│   ├── tools.json       # 工具功能
│   └── domains.json     # 业务域
└── zh/
    ├── common.json
    ├── pages.json
    ├── tools.json
    └── domains.json
```

### 命名约定

- **key命名**: camelCase
- **层次**: 不超过4层嵌套
- **一致性**: 相同概念使用相同key名

### 版本控制

- 新增功能时先在一种语言中完成，再翻译
- 使用类型检查确保所有语言文件结构一致
- 考虑使用工具检查遗漏的翻译

## 总结

你们当前的结构已经采用了较好的实践。建议：

1. **保持现有的优点** - 功能域分组 + 通用组件
2. **小幅优化** - 加强一致性，提取共同概念
3. **渐进式改进** - 不需要大规模重构 
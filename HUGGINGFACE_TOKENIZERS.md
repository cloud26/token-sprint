# Hugging Face Transformers.js 集成说明

## 概述

本项目现在使用 [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) 在浏览器中本地运行多种模型的 tokenizer，无需 API 调用！

## 支持的模型类型

### 🤗 Hugging Face 社区 Tokenizer
这些模型使用开源社区维护的 tokenizer，在浏览器中本地运行：

**Claude 系列 (Xenova/claude-tokenizer):**
- Claude 4 Opus/Sonnet
- Claude 3.5 Sonnet/Haiku  
- Claude 3 Opus/Sonnet/Haiku

**Llama 系列:**
- Llama 3.3 → `unsloth/Llama-3.3-70B-Instruct`
- Llama 3.2 → `Xenova/Llama-3.2-Tokenizer`
- Llama 3.1 → `Xenova/Meta-Llama-3.1-Tokenizer`
- Llama 3 → `Xenova/llama3-tokenizer-new`
- Llama 2 → `Xenova/llama2-tokenizer`
- Code Llama → `Xenova/llama-code-tokenizer`

**DeepSeek 系列 (官方模型):**
- DeepSeek R1 → `deepseek-ai/DeepSeek-R1`
- DeepSeek V3 → `deepseek-ai/DeepSeek-V3`
- DeepSeek V2 → `deepseek-ai/DeepSeek-V2`

**Mistral 系列:**
- Mistral Large → `Xenova/mistral-tokenizer-v3`
- Mistral Nemo → `Xenova/Mistral-Nemo-Instruct-Tokenizer`
- Codestral → `Xenova/mistral-tokenizer-v3`

### ✅ 原生 js-tiktoken
这些模型使用官方原生 tokenizer：
- GPT-4o, GPT-4, GPT-4 Turbo
- GPT-3.5 Turbo, GPT-3 Davinci

### ⚠️ GPT-4 估算
这些模型暂时使用 GPT-4 tokenizer 进行估算：
- Google Gemini 系列
- Qwen 系列

## 技术特点

### 🚀 性能优势
- **本地处理**: 所有 tokenization 在浏览器中完成
- **无 API 调用**: 不需要网络请求，响应更快
- **隐私保护**: 文本不会发送到任何服务器
- **离线使用**: 加载后可离线使用

### 🔧 实现细节
- **动态加载**: 只在需要时加载 tokenizer
- **智能缓存**: tokenizer 在内存中缓存，避免重复下载
- **错误处理**: 加载失败时自动回退到估算
- **类型安全**: 完整的 TypeScript 支持

## 使用体验

### 首次加载
- 第一次使用某个 Hugging Face 模型时，会下载对应的 tokenizer
- 下载完成后，tokenizer 会被缓存在内存中
- 后续使用该模型将立即响应

### Token 分解功能
- 🤗 模型提供完整的 token 分解可视化
- 支持文本模式和 Token ID 模式切换
- 每个 token 用不同颜色高亮显示
- 悬停显示详细信息

### 准确性说明
- **OpenAI 模型**: 100% 准确（官方 tokenizer）
- **🤗 模型**: 95%+ 准确（社区逆向工程）
- **⚠️ 模型**: 近似估算（等待官方或社区 tokenizer）

## 开发者信息

### 模型配置
新增模型需要在 `components/token-counter.tsx` 中添加配置：

```typescript
{
    value: "model-name",
    label: "Model Display Name 🤗",
    encoding: "huggingface",
    hub: "organization/model-name"
}
```

### 支持的 Hub 格式
- `organization/model-name`: 标准 Hugging Face Hub 路径
- `Xenova/model-name`: Xenova 组织的优化版本
- `deepseek-ai/model-name`: 官方模型

### 错误处理
- 网络错误时自动回退到字符估算
- 详细的错误日志和用户提示
- 优雅降级，不影响其他功能

## 未来计划

- [ ] 添加更多社区 tokenizer 支持
- [ ] 实现 tokenizer 预加载功能
- [ ] 添加 tokenizer 更新检查
- [ ] 支持自定义 Hugging Face 端点

---

基于参考项目：https://github.com/ppaanngggg/token-counter 
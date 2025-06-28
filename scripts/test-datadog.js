#!/usr/bin/env node

/**
 * 测试 Datadog 配置的简单脚本
 * 
 * 使用方法:
 * node scripts/test-datadog.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 检查 Datadog 配置...\n')

// 检查必要的文件是否存在
const requiredFiles = [
  'config/datadog.ts',
  'lib/datadog-server-logger.ts',
  'doc/DATADOG_SETUP.md'
]

console.log('📁 检查必要文件:')
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  const exists = fs.existsSync(filePath)
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
})

console.log()

// 检查环境变量
console.log('🌍 检查环境变量:')
const envFiles = ['.env.local', '.env']
let hasEnvFile = false

envFiles.forEach(envFile => {
  const envPath = path.join(process.cwd(), envFile)
  if (fs.existsSync(envPath)) {
    hasEnvFile = true
    console.log(`  ✅ 找到环境文件: ${envFile}`)
    
    const content = fs.readFileSync(envPath, 'utf8')
    const hasDatadogToken = content.includes('NEXT_PUBLIC_DATADOG_CLIENT_TOKEN')
    const hasDatadogSite = content.includes('NEXT_PUBLIC_DATADOG_SITE')
    
    console.log(`    ${hasDatadogToken ? '✅' : '❌'} NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`)
    console.log(`    ${hasDatadogSite ? '✅' : '⚠️ '} NEXT_PUBLIC_DATADOG_SITE (可选)`)
  }
})

if (!hasEnvFile) {
  console.log('  ⚠️  没有找到环境文件 (.env.local 或 .env)')
  console.log('     请创建 .env.local 文件并添加 Datadog 配置')
}

console.log()

// 检查依赖包 - 现在使用服务器端实现，不需要额外依赖
console.log('📦 检查依赖包:')
console.log('  ✅ 使用原生 fetch API，无需额外依赖')

console.log()

// 提供配置指导
console.log('📖 配置指导:')
console.log('  1. 创建 .env.local 文件（如果还没有）')
console.log('  2. 添加以下环境变量:')
console.log('     NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=your_token_here')
console.log('     NEXT_PUBLIC_DATADOG_SITE=datadoghq.com  # 可选')
console.log('  3. 重启开发服务器: pnpm dev')
console.log('  4. 查看详细文档: doc/DATADOG_SETUP.md')

console.log()

// 检查当前环境变量（运行时）
console.log('🔧 当前运行时环境变量:')
const runtimeToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
const runtimeSite = process.env.NEXT_PUBLIC_DATADOG_SITE

console.log(`  NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: ${runtimeToken ? '✅ 已设置' : '❌ 未设置'}`)
console.log(`  NEXT_PUBLIC_DATADOG_SITE: ${runtimeSite || 'datadoghq.com (默认)'}`)

if (runtimeToken) {
  console.log(`  Token 长度: ${runtimeToken.length} 字符`)
  console.log(`  Token 预览: ${runtimeToken.substring(0, 8)}...`)
}

console.log()
console.log('🎉 配置检查完成!')

if (!runtimeToken) {
  console.log('⚠️  警告: Datadog 将以降级模式运行（仅控制台日志）')
} else {
  console.log('✅ Datadog 配置看起来正常!')
} 
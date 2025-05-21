import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { ref, path, timestamp } = await request.json()
        
        // 这里你可以：
        // 1. 将数据存储到数据库
        // 2. 发送到分析服务
        // 3. 记录到日志系统
        
        // 示例：记录到 console（实际使用时应该换成真实的存储方案）
        console.log({
            type: 'referral',
            source: ref,
            path,
            timestamp,
            userAgent: request.headers.get('user-agent'),
            ip: request.ip // 注意：在生产环境中要考虑隐私政策
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error tracking referral:', error)
        return NextResponse.json(
            { error: 'Failed to track referral' },
            { status: 500 }
        )
    }
} 
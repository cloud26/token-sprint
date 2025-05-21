import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const ref = searchParams.get('ref')

    // 如果有 ref 参数，可以在这里记录
    if (ref) {
        // 这里可以用你的分析工具记录，比如：
        console.log(`Referral from: ${ref}`)
        
        // 可以设置 cookie 来追踪用户来源
        const response = NextResponse.next()
        response.cookies.set('referral_source', ref, {
            maxAge: 30 * 24 * 60 * 60, // 30天
            path: '/',
        })
        return response
    }

    // 处理旧路径重定向
    const oldPaths = [
        "/token-generation-speed-visualizer",
        "/llm-gpu-memory-calculator"
    ]
    
    if (oldPaths.includes(pathname)) {
        return NextResponse.redirect(new URL(`/en${pathname}`, request.url))
    }

    // 如果是根路径，重定向到英文版
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/en", request.url))
    }

    // 检查语言参数是否有效
    const langMatch = pathname.match(/^\/([^/]+)/)
    if (langMatch) {
        const lang = langMatch[1]
        if (!["en", "zh"].includes(lang)) {
            // 如果语言无效，重定向到英文版
            const newPathname = pathname.replace(/^\/[^/]+/, "/en")
            return NextResponse.redirect(new URL(newPathname, request.url))
        }
    }

    return NextResponse.next()
}

// 配置匹配的路由
export const config = {
    matcher: [
        /*
         * 匹配所有路径，除了：
         * - api 路由
         * - _next 静态文件
         * - 图片文件
         * - favicon.ico
         * - sitemap.xml
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)",
    ],
} 
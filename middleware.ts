import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const ref = searchParams.get('ref')
    let response: NextResponse | null = null

    // 处理旧路径重定向
    const oldPaths = [
        "/token-generation-speed-visualizer",
        "/llm-gpu-memory-calculator"
    ]
    
    if (oldPaths.includes(pathname)) {
        const url = new URL(`/en${pathname}`, request.url)
        // 保持 ref 参数
        if (ref) url.searchParams.set('ref', ref)
        response = NextResponse.redirect(url)
    }
    // 如果是根路径，重定向到英文版
    else if (pathname === "/") {
        const url = new URL("/en", request.url)
        // 保持 ref 参数
        if (ref) url.searchParams.set('ref', ref)
        response = NextResponse.redirect(url)
    }
    // 检查语言参数是否有效
    else {
        const langMatch = pathname.match(/^\/([^/]+)/)
        if (langMatch) {
            const lang = langMatch[1]
            if (!["en", "zh"].includes(lang)) {
                // 如果语言无效，重定向到英文版
                const newPathname = pathname.replace(/^\/[^/]+/, "/en")
                const url = new URL(newPathname, request.url)
                // 保持 ref 参数
                if (ref) url.searchParams.set('ref', ref)
                response = NextResponse.redirect(url)
            }
        }
    }

    // 如果没有重定向，创建一个 next response
    if (!response) {
        response = NextResponse.next()
    }

    // 如果有 ref 参数，设置 cookie
    if (ref) {
        response.cookies.set('referral_source', ref, {
            maxAge: 30 * 24 * 60 * 60, // 30天
            path: '/',
        })
    }

    return response
}

// 配置匹配的路由
export const config = {
    matcher: [
        /*
         * 匹配所有路径，除了：
         * - api 路由
         * - _next 静态文件
         * - 图片文件
         * - favicon 相关文件 (ico, svg, png)
         * - sitemap.xml
         * - 所有 .txt 文件（验证文件等）
         */
        "/((?!api|_next/static|_next/image|favicon|.*\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|sitemap.xml|.*\\.txt).*)",
    ],
} 
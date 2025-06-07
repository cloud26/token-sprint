import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const ref = searchParams.get('ref')

    // 处理旧路径重定向
    const oldPaths = [
        "/token-generation-speed-visualizer",
        "/llm-gpu-memory-calculator"
    ]
    
    if (oldPaths.includes(pathname)) {
        const url = new URL(`/en${pathname}`, request.url)
        // 保持 ref 参数
        if (ref) url.searchParams.set('ref', ref)
        const response = NextResponse.redirect(url)
        
        // 如果有 ref 参数，设置 cookie
        if (ref) {
            response.cookies.set('referral_source', ref, {
                maxAge: 30 * 24 * 60 * 60, // 30天
                path: '/',
            })
        }
        return response
    }

    // 处理国际化路由
    const response = intlMiddleware(request);

    // 如果有 ref 参数，设置 cookie
    if (ref && response) {
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
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ReferralTrackerInner() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const ref = searchParams.get('ref')
        if (!ref) return

        // 发送到我们的 API
        fetch('/api/analytics/referral', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ref,
                path: pathname,
                timestamp: new Date().toISOString(),
            }),
        }).catch(console.error) // 静默处理错误，不影响用户体验
    }, [pathname, searchParams])

    return null // 这是一个无渲染组件
}

// 导出一个包装了 Suspense 的组件
export function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <ReferralTrackerInner />
        </Suspense>
    )
} 
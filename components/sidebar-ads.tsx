"use client"

import { useEffect } from "react"

declare global {
    interface Window {
        adsbygoogle: any
    }
}

export function SidebarAds() {
    useEffect(() => {
        try {
            // 只为大屏幕设备推送广告
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                // 延迟推送，确保DOM已渲染
                setTimeout(() => {
                    const screenWidth = window.innerWidth
                    
                    if (screenWidth >= 1024) {
                        // 大屏幕设备（包括iPad）：2个广告
                        window.adsbygoogle.push({})
                        window.adsbygoogle.push({})
                    }
                    // 手机端不推送，让 Auto ads 自动处理
                }, 100)
            }
        } catch (err) {
            console.error('AdSense error:', err)
        }
    }, [])

    return (
        <>
            {/* 超大屏幕 - 基于内容区域精确定位 */}
            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden 2xl:block" 
                 style={{ left: 'calc(50% - 288px - 200px - 160px)', width: '160px' }}>
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="6070874275"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden 2xl:block" 
                 style={{ left: 'calc(50% + 288px + 200px)', width: '160px' }}>
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="9024626084"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

            {/* iPad/平板 - 保守定位，避免溢出 */}
            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden lg:block 2xl:hidden" 
                 style={{ left: '60px', width: '160px' }}>
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="6070874275"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden lg:block 2xl:hidden" 
                 style={{ right: '20px', width: '160px' }}>
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="9024626084"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </>
    )
} 
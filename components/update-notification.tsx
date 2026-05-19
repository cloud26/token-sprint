"use client";

import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpdateNotification() {
    const [isVisible, setIsVisible] = useState(false);

    const UPDATE_VERSION = "2026-05-19-minimax-token-plan-ad";
    const AD_LINK = "https://platform.minimaxi.com/subscribe/token-plan?code=LONFQ0dT3m&source=link";

    useEffect(() => {
        const dismissedVersion = localStorage.getItem("dismissedUpdateNotification");
        if (dismissedVersion !== UPDATE_VERSION) {
            setIsVisible(true);
        }
    }, [UPDATE_VERSION]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("dismissedUpdateNotification", UPDATE_VERSION);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-[#ff8a80] bg-gradient-to-r from-[#ff5a52] to-[#ff4f45] text-white shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_42%)]" />
            <div className="relative p-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black/20">
                        <Megaphone className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                        <p className="text-sm font-semibold leading-relaxed">
                            🚀 MiniMax Token Plan 惊喜上线！新增语音、音乐、视频和图片生成权益。邀请好友享双重好礼，助力开发体验！
                        </p>
                        <p className="text-sm leading-relaxed text-white/95">
                            好友立享 <span className="font-semibold">9折</span> 专属优惠 + Builder 权益，你赢返利 + 社区特权！
                        </p>
                        <a
                            href={AD_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#ff4f45] transition-colors hover:bg-white/90"
                        >
                            👉 立即参与
                        </a>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 flex-shrink-0 rounded-full p-0 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">关闭广告</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

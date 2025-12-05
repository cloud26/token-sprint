"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Calculator, Zap, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function UpdateNotification() {
    const t = useTranslations("updateNotification");
    const [isVisible, setIsVisible] = useState(false);

    // 更新版本号 - 每次有新更新时修改这个值
    const UPDATE_VERSION = "2024-12-19-gpu-optimization";

    useEffect(() => {
        // 检查用户是否已经关闭过这个版本的通知
        const dismissedVersion = localStorage.getItem("dismissedUpdateNotification");
        if (dismissedVersion !== UPDATE_VERSION) {
            setIsVisible(true);
        }
    }, [UPDATE_VERSION]);

    const handleDismiss = () => {
        setIsVisible(false);
        // 记住用户已经关闭了这个版本的通知
        localStorage.setItem("dismissedUpdateNotification", UPDATE_VERSION);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="relative rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 shadow-sm">

            <div className="relative p-4">
                <div className="flex items-center gap-3">
                    {/* 图标 */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                {t("title")}
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                New
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/50">
                                    <Calculator className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span>{t("feature1")}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/50">
                                    <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span>{t("feature2")}</span>
                            </div>
                        </div>
                    </div>

                    {/* 关闭按钮 */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 rounded-full transition-colors"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">{t("dismiss")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

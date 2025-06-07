"use client"

import { useTranslations, useLocale } from 'next-intl'

export function GPUSelectionGuide() {
    const locale = useLocale()
    const t = useTranslations('common')
    
    return (
        <div className="space-y-8">
            {/* GPU选择指南 - 更有价值的内容 */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">
                    {t('gpu.selectionGuide')}
                </h2>
                <div className="text-sm text-muted-foreground space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{t('gpu.guide.budgetOptions.title')}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>{t('gpu.guide.budgetOptions.rtx4090')}</strong></li>
                            <li><strong>{t('gpu.guide.budgetOptions.rtx3090')}</strong></li>
                            <li><strong>{t('gpu.guide.budgetOptions.rtx4060ti')}</strong></li>
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{t('gpu.guide.enterpriseSolutions.title')}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>{t('gpu.guide.enterpriseSolutions.h100')}</strong></li>
                            <li><strong>{t('gpu.guide.enterpriseSolutions.a100')}</strong></li>
                            <li><strong>{t('gpu.guide.enterpriseSolutions.mi300x')}</strong></li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">{t('gpu.guide.proTips.title')}</h3>
                        <ul className="list-disc pl-5 space-y-1 text-blue-800">
                            <li><strong>{t('gpu.guide.proTips.fp8')}</strong></li>
                            <li><strong>{t('gpu.guide.proTips.moe')}</strong></li>
                            <li><strong>{t('gpu.guide.proTips.parallel')}</strong></li>
                            <li><strong>{t('gpu.guide.proTips.precision')}</strong></li>
                            <li><strong>{t('gpu.guide.proTips.mapping')}</strong></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 热门模型GPU需求 */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">
                    {t('gpu.popularModels')}
                </h2>
                <div className="text-sm text-muted-foreground space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <h3 className="font-medium text-emerald-900 mb-2">{t('gpu.models.qwen.title')}</h3>
                        <p className="text-emerald-800">
                            {t('gpu.models.qwen.description')}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">{t('gpu.models.deepseek.title')}</h3>
                        <p className="text-blue-800">
                            {t('gpu.models.deepseek.description')}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-900 mb-2">{t('gpu.models.llama70b.title')}</h3>
                        <p className="text-green-800">
                            {t('gpu.models.llama70b.description')}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-medium text-purple-900 mb-2">{t('gpu.models.llama405b.title')}</h3>
                        <p className="text-purple-800">
                            {t('gpu.models.llama405b.description')}
                        </p>
                    </div>
                    <p className="mt-4 text-gray-600">
                        {t('gpu.models.footer')}
                    </p>
                </div>
            </section>
        </div>
    )
} 
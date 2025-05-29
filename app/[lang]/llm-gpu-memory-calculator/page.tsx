import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import { SideNav } from "@/components/side-nav"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.linpp2009.com')
    const path = 'llm-gpu-memory-calculator'

    return {
        title: tools.llmGpuCalculator.metadata.title[lang],
        description: tools.llmGpuCalculator.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
    }
}

export default function LLMGPUMemoryCalculatorPage({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)
    const currentPath = `/${language}/llm-gpu-memory-calculator`

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-xl space-y-2 flex-1">
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.llmGpuCalculator.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.llmGpuCalculator.description[language]}
                        </p>
                    </header>

                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator language={language} />
                    </Suspense>

                    {/* GPU选择指南 - 更有价值的内容 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'GPU Selection Guide for LLM Deployment' : 'LLM部署GPU选择指南'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-3">
                            {language === 'en' ? (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">💰 Budget-Friendly Options (Under $10k)</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>RTX 4090 (24GB):</strong> Best for 7B-13B models, single card setup</li>
                                            <li><strong>RTX 3090 (24GB):</strong> Good value for smaller models and experimentation</li>
                                            <li><strong>Multiple RTX 4060 Ti (16GB):</strong> Cost-effective for distributed inference</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">🏢 Enterprise Solutions ($50k+)</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>NVIDIA H100 (80GB):</strong> Industry standard for production LLM deployment</li>
                                            <li><strong>NVIDIA A100 (80GB):</strong> Proven reliability, good for 70B+ models</li>
                                            <li><strong>AMD MI300X (192GB):</strong> Highest memory capacity, excellent for largest models</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-900 mb-2">⚡ Pro Tips for Optimization</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-blue-800">
                                            <li><strong>Use FP8/INT8:</strong> Reduce memory usage by 50-75% with minimal quality loss</li>
                                            <li><strong>Consider MoE Models:</strong> Qwen3-235B-A22B offers flagship performance with 4x H100 (vs 10x for DeepSeek-R1)</li>
                                            <li><strong>Model Parallelism:</strong> Split large models across multiple GPUs</li>
                                            <li><strong>Mixed Precision:</strong> Combine FP16 inference with FP32 gradients for training</li>
                                            <li><strong>Memory Mapping:</strong> Use CPU RAM for model storage, GPU for active layers</li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">💰 预算友好选择（1万美元以下）</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>RTX 4090 (24GB):</strong> 最适合7B-13B模型，单卡配置</li>
                                            <li><strong>RTX 3090 (24GB):</strong> 小型模型和实验的高性价比选择</li>
                                            <li><strong>多卡RTX 4060 Ti (16GB):</strong> 分布式推理的经济高效方案</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">🏢 企业级解决方案（5万美元以上）</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>NVIDIA H100 (80GB):</strong> 生产级LLM部署的行业标准</li>
                                            <li><strong>NVIDIA A100 (80GB):</strong> 经过验证的可靠性，适合70B+模型</li>
                                            <li><strong>AMD MI300X (192GB):</strong> 最高显存容量，适合最大模型</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-900 mb-2">⚡ 优化专业技巧</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-blue-800">
                                            <li><strong>使用FP8/INT8:</strong> 在质量损失最小的情况下减少50-75%显存使用</li>
                                            <li><strong>考虑MoE模型:</strong> Qwen3-235B-A22B提供4块H100旗舰性能（对比DeepSeek-R1需要10块）</li>
                                            <li><strong>模型并行:</strong> 在多个GPU上分割大型模型</li>
                                            <li><strong>混合精度:</strong> 结合FP16推理和FP32梯度进行训练</li>
                                            <li><strong>内存映射:</strong> 使用CPU内存存储模型，GPU处理活跃层</li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* 热门模型GPU需求 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'Popular AI Models GPU Requirements' : '热门AI模型GPU需求'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-4">
                            {language === 'en' ? (
                                <>
                                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                        <h3 className="font-medium text-emerald-900 mb-2">🆕 Qwen3-235B-A22B GPU Requirements</h3>
                                        <p className="text-emerald-800">
                                            <strong>Qwen3-235B-A22B (235B total, 22B active)</strong> is the latest flagship MoE model. With FP8 precision, you'll need 4x H100 GPUs. This efficient MoE architecture provides competitive performance with DeepSeek-R1 while using 60% less memory.
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-900 mb-2">DeepSeek R1 GPU Requirements</h3>
                                        <p className="text-blue-800">
                                            <strong>DeepSeek R1 (671B parameters)</strong> requires substantial GPU memory. With FP8 precision, you'll need approximately 10x NVIDIA H100 GPUs or equivalent high-memory configurations for optimal inference performance.
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h3 className="font-medium text-green-900 mb-2">Llama 3.1 70B GPU Requirements</h3>
                                        <p className="text-green-800">
                                            <strong>Llama 3.1 70B</strong> is more accessible. With FP16 precision, you'll need 2x NVIDIA A100 (80GB) or H100. For consumer hardware, you'll need 7x RTX 4090 cards (24GB each).
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h3 className="font-medium text-purple-900 mb-2">Llama 3.1 405B GPU Requirements</h3>
                                        <p className="text-purple-800">
                                            <strong>Llama 3.1 405B</strong> requires high-end infrastructure. With FP8 precision, you'll need 6x H100 GPUs. With FP16 precision, you'll need 11x A100 GPUs for deployment.
                                        </p>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        Use this calculator to get precise memory requirements for your specific use case and budget planning.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                        <h3 className="font-medium text-emerald-900 mb-2">🆕 Qwen3-235B-A22B GPU需求</h3>
                                        <p className="text-emerald-800">
                                            <strong>Qwen3-235B-A22B（235B总，22B活跃）</strong>是最新旗舰MoE模型。使用FP8精度，您只需要4块H100 GPU！这种高效的MoE架构提供了与DeepSeek-R1相竞争的性能，同时减少60%的内存使用。
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-900 mb-2">DeepSeek R1 GPU需求</h3>
                                        <p className="text-blue-800">
                                            <strong>DeepSeek R1（671B参数）</strong>需要大量GPU显存。使用FP8精度，您需要大约8-10块NVIDIA H100 GPU或同等的高显存配置来获得最佳推理性能。
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h3 className="font-medium text-green-900 mb-2">Llama 3.1 70B GPU需求</h3>
                                        <p className="text-green-800">
                                            <strong>Llama 3.1 70B</strong>更容易部署。使用FP16精度，您需要2块NVIDIA A100（80GB）或H100。对于消费级硬件，需要7块RTX 4090显卡（每块24GB）。
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h3 className="font-medium text-purple-900 mb-2">Llama 3.1 405B GPU需求</h3>
                                        <p className="text-purple-800">
                                            <strong>Llama 3.1 405B</strong>需要高端基础设施。使用FP8精度需要6块H100 GPU。使用FP16精度需要11块A100 GPU进行部署。
                                        </p>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        使用这个计算器来获得您特定用例的精确显存需求和预算规划。
                                    </p>
                                </>
                            )}
                        </div>
                    </section>
                </div>
                <Footer />
            </main>
        </div>
    )
} 
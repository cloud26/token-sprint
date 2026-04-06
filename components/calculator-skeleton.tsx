import { Card, CardContent } from "@/components/ui/card"

/**
 * A server-rendered skeleton that matches the LLMMemoryCalculator layout.
 * Used as a Suspense fallback so the skeleton itself becomes the LCP element,
 * painting instantly from the static HTML instead of waiting for JS hydration.
 */
export function CalculatorSkeleton() {
    return (
        <Card className="w-full" role="main">
            <CardContent className="p-4 space-y-3">
                {/* Model Selection skeleton */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* Parameters skeleton */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* Precision + Context Length skeleton (2-col grid) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                    </div>
                </div>

                {/* GPU Model skeleton */}
                <div className="space-y-1">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* Batch Size skeleton */}
                <div className="space-y-1">
                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* GPU Count skeleton */}
                <div className="space-y-2">
                    <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <div className="h-12 w-full bg-white/60 rounded-md border border-blue-300 animate-pulse" />
                            </div>
                            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Memory Breakdown skeleton */}
                <section>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                        {/* Total Memory */}
                        <div className="text-center p-3 bg-blue-100 rounded-lg border border-blue-300 mb-3">
                            <div className="h-6 w-48 bg-blue-200 rounded mx-auto animate-pulse" />
                            <div className="h-4 w-32 bg-blue-200 rounded mx-auto mt-2 animate-pulse" />
                        </div>

                        {/* 4-column memory breakdown */}
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="text-center p-2 bg-white rounded border">
                                    <div className="h-3 w-16 bg-muted rounded mx-auto animate-pulse" />
                                    <div className="h-5 w-12 bg-muted rounded mx-auto mt-1 animate-pulse" />
                                    <div className="h-3 w-20 bg-muted rounded mx-auto mt-1 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}

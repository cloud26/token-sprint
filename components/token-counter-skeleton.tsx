import { Card, CardContent } from "@/components/ui/card"

/**
 * A server-rendered skeleton that matches the TokenCounter layout.
 * Used as a Suspense/dynamic-loading fallback so the skeleton paints
 * instantly from static HTML, improving LCP.
 */
export function TokenCounterSkeleton() {
    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-6">
                {/* Model Selection skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* Text Input skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-[120px] w-full bg-muted rounded-md border animate-pulse" />
                </div>

                {/* Generate Example button skeleton */}
                <div className="bg-amber-50/50 px-3 py-2 rounded text-center border border-amber-200/50">
                    <div className="h-9 w-40 bg-amber-200 rounded mx-auto animate-pulse" />
                </div>

                {/* Results skeleton */}
                <div className="space-y-2">
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="text-center">
                                    <div className="h-3 w-16 bg-muted rounded mx-auto mb-1 animate-pulse" />
                                    <div className="h-6 w-12 bg-muted rounded mx-auto animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

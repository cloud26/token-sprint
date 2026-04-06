import { Card, CardContent } from "@/components/ui/card"

/**
 * A server-rendered skeleton that matches the TokenSpeedDemo layout.
 * Used as a dynamic-loading fallback so the skeleton paints instantly
 * from static HTML, improving LCP.
 */
export function TokenSpeedSkeleton() {
    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-6">
                {/* Speed slider skeleton */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-full bg-muted rounded-full py-2 animate-pulse" />
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-3 w-4 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Stats + text display skeleton */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-4 w-28 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="min-h-[220px] max-h-[220px] rounded-md border p-4 bg-muted/30 animate-pulse" />
                </div>

                {/* Button skeleton */}
                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
            </CardContent>
        </Card>
    )
}

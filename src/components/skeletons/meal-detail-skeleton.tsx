export function MealDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6">
        <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-muted animate-pulse" />
      </div>
      <div className="p-4 md:p-6 space-y-4">
        <div className="h-7 w-2/3 bg-muted animate-pulse rounded" />
        <div className="h-5 w-1/3 bg-muted animate-pulse rounded" />
        <div className="h-5 w-24 bg-muted animate-pulse rounded" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

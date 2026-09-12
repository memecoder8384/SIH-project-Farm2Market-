import React, { useState } from 'react';

/**
 * ShadowRouteLoader: Sleek glowing progress bar mounted at the top of the viewport
 * during navigation between pages/tabs.
 */
export const ShadowRouteLoader: React.FC<{ activeKey: string }> = ({ activeKey }) => {
  return <div key={activeKey} className="shadow-route-loader-bar" aria-hidden="true" />;
};

/**
 * ShadowImage: Image component with a shadow shimmer loader placeholder while loading,
 * and smooth fade-in with optional hover zoom once ready.
 */
interface ShadowImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string;
}

export const ShadowImage: React.FC<ShadowImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = 'w-full h-full',
  aspectRatio = 'aspect-4/3',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Shadow Shimmer Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 shadow-skeleton z-10 flex items-center justify-center" aria-hidden="true">
          <div className="w-7 h-7 rounded-full border-2 border-farm-orange/30 border-t-farm-orange animate-spin" />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-500 ease-out ${
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />

      {/* Fallback if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center p-3 text-stone-400">
          <span className="text-3xl">🥬</span>
          <span className="text-[11px] mt-1 font-semibold text-stone-600 text-center">{alt}</span>
        </div>
      )}
    </div>
  );
};

/**
 * ProduceCardSkeleton: Shimmering shadow loader card mimicking a fresh harvest lot card.
 */
export const ProduceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm shadow-loader-card flex flex-col justify-between">
      <div>
        {/* Photo Box Skeleton */}
        <div className="w-full h-48 rounded-2xl shadow-skeleton relative overflow-hidden" />

        {/* Title & Price Row Skeleton */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/4 rounded-md shadow-skeleton" />
            <div className="h-3 w-1/2 rounded-md shadow-skeleton" />
          </div>
          <div className="h-6 w-16 rounded-md shadow-skeleton shrink-0" />
        </div>

        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100">
          <div className="h-3 w-full rounded shadow-skeleton" />
          <div className="h-3 w-full rounded shadow-skeleton" />
        </div>
      </div>

      {/* Action Footer Skeleton */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="h-4 w-24 rounded shadow-skeleton" />
        <div className="h-9 w-28 rounded-full shadow-skeleton" />
      </div>
    </div>
  );
};

/**
 * DashboardStatSkeleton: Shimmering shadow loader for dashboard metric counters.
 */
export const DashboardStatSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm shadow-loader-card space-y-3">
      <div className="h-3 w-28 rounded shadow-skeleton" />
      <div className="flex items-baseline justify-between">
        <div className="h-8 w-24 rounded-lg shadow-skeleton" />
        <div className="h-5 w-14 rounded-full shadow-skeleton" />
      </div>
      <div className="h-3 w-40 rounded shadow-skeleton" />
    </div>
  );
};

/**
 * TableRowSkeleton: Shimmering shadow loader row for tables and lists.
 */
export const TableRowSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl border border-stone-200/80 bg-white shadow-xs shadow-loader-card flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 rounded-xl shadow-skeleton shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-48 rounded shadow-skeleton" />
          <div className="h-3 w-32 rounded shadow-skeleton" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-4 w-20 rounded shadow-skeleton ml-auto" />
        <div className="h-3 w-16 rounded shadow-skeleton ml-auto" />
      </div>
    </div>
  );
};

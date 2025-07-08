import React, { Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <ComponentSkeleton /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

const ComponentSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[300px]" />
    <div className="space-y-2">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const FormSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-6 w-[150px]" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-6 w-[120px]" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-6 w-[100px]" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-10 w-[120px]" />
  </div>
);

const CardSkeleton = () => (
  <div className="space-y-3 p-4 border rounded-lg">
    <Skeleton className="h-4 w-[100px]" />
    <Skeleton className="h-6 w-[200px]" />
    <Skeleton className="h-3 w-[150px]" />
    <Skeleton className="h-8 w-[80px]" />
  </div>
);

// Lazy loading HOC
export const withLazyLoading = <P extends Record<string, any>>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(() => Promise.resolve({ default: Component }));
  
  const WrappedComponent = (props: P) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...(props as any)} />
    </LazyWrapper>
  );
  
  return WrappedComponent;
};

// Pre-built skeletons for common components
export const skeletons = {
  component: ComponentSkeleton,
  dashboard: DashboardSkeleton,
  form: FormSkeleton,
  card: CardSkeleton,
};

export default LazyWrapper;
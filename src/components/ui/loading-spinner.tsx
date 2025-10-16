import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}>
      <Loader2 
        className={cn(
          "animate-spin text-green-600 drop-shadow-sm",
          sizeClasses[size]
        )} 
        style={{
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <p className={cn(
          "text-green-700 font-medium",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
}

// Composant pour une page complète de chargement
export function LoadingPage({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Composant pour un chargement inline
export function LoadingInline({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

// Composant pour le chargement dans une carte
export function LoadingCard({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

// Composant pour le chargement d'un bouton
export function LoadingButton({ 
  children, 
  isLoading, 
  loadingText = "Chargement...",
  ...props 
}: {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  [key: string]: any;
}) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
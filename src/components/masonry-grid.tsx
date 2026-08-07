import * as React from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: number;
}

const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ className, columns = 3, gap = 4, children, ...props }, ref) => {
    const style = {
      columnCount: columns,
      columnGap: `${gap * 0.25}rem`,
    };

    return (
      <div ref={ref} style={style} className={cn('w-full', className)} {...props}>
        {React.Children.map(children, (child) => (
          <div className="mb-4 break-inside-avoid">
            {child}
          </div>
        ))}
      </div>
    );
  }
);

MasonryGrid.displayName = 'MasonryGrid';
export { MasonryGrid };

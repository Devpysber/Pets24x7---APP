import React, { memo, ReactElement } from 'react';
import { Virtuoso, VirtuosoProps, VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';

interface FlatListProps<T> extends Omit<VirtuosoProps<T, any>, 'data' | 'itemContent'> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  numColumns?: number;
  columnWrapperClassName?: string;
  listClassName?: string;
}

/**
 * A virtualized list component optimized for performance.
 * Mimics React Native's FlatList API for ease of use.
 * Supports both list and grid layouts.
 */
export function FlatList<T>({
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  onEndReached,
  onEndReachedThreshold = 200,
  numColumns = 1,
  columnWrapperClassName,
  listClassName,
  ...virtuosoProps
}: FlatListProps<T>) {
  if (data.length === 0 && ListEmptyComponent) {
    return (
      <div className={listClassName}>
        {ListHeaderComponent}
        {ListEmptyComponent}
        {ListFooterComponent}
      </div>
    );
  }

  if (numColumns > 1) {
    return (
      <VirtuosoGrid
        data={data}
        itemContent={(index, item) => renderItem(item, index)}
        components={{
          Header: () => <>{ListHeaderComponent}</>,
          Footer: () => <>{ListFooterComponent}</>,
          List: React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(({ children, ...props }, ref) => (
            <div 
              {...props} 
              ref={ref} 
              className={columnWrapperClassName}
            >
              {children}
            </div>
          )),
        }}
        endReached={onEndReached}
        useWindowScroll
        {...(virtuosoProps as any)}
      />
    );
  }

  return (
    <Virtuoso
      data={data}
      itemContent={(index, item) => renderItem(item, index)}
      components={{
        Header: () => <>{ListHeaderComponent}</>,
        Footer: () => <>{ListFooterComponent}</>,
      }}
      endReached={onEndReached}
      increaseViewportBy={onEndReachedThreshold}
      useWindowScroll
      className={listClassName}
      {...virtuosoProps}
    />
  );
}

export default memo(FlatList) as typeof FlatList;

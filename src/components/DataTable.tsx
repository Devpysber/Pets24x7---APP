import React from 'react';
import { cn } from '../utils/theme';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onRowClick, 
  className 
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-black/5">
            {columns.map((column, idx) => (
              <th 
                key={idx} 
                className={cn(
                  "px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {data.map((item) => (
            <tr 
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "transition-colors",
                onRowClick ? "cursor-pointer hover:bg-gray-50/50" : ""
              )}
            >
              {columns.map((column, idx) => (
                <td 
                  key={idx} 
                  className={cn(
                    "px-4 py-4 text-sm text-gray-600",
                    column.className
                  )}
                >
                  {typeof column.accessor === 'function' 
                    ? column.accessor(item) 
                    : (item[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

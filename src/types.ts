import React from 'react';

export interface Column<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortType?: 'string' | 'number' | 'date';
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: Array<{ label: string; value: any }>;
  align?: 'left' | 'center' | 'right';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: any;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationConfig | false;
  sortConfig?: SortConfig;
  filterConfig?: FilterConfig;
  onSort?: (sortConfig: SortConfig | null) => void;
  onFilter?: (filterConfig: FilterConfig) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  rowKey?: keyof T | ((row: T) => string | number);
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  expandable?: boolean;
  onExpand?: (expanded: boolean, row: T) => void;
  expandedRowRender?: (row: T) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  emptyText?: React.ReactNode;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
} 
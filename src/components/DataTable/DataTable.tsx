import React, { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { DataTableProps, SortConfig, FilterConfig, Column } from '../../types';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';
import { useTheme } from '../../context/ThemeContext';
import './DataTable.css';

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  sortConfig,
  filterConfig,
  onSort,
  onFilter,
  onPaginationChange,
  rowKey = 'id',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  expandable = false,
  onExpand,
  expandedRowRender,
  className,
  style,
  size = 'medium',
  bordered = false,
  striped = false,
  hover = true,
  emptyText = 'No data',
}: DataTableProps<T>) => {
  const { theme } = useTheme();
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | null>(null);
  const [internalFilterConfig, setInternalFilterConfig] = useState<FilterConfig>({});
  const [internalSelectedRows, setInternalSelectedRows] = useState<(string | number)[]>([]);

  const currentSortConfig = sortConfig || internalSortConfig;
  const currentFilterConfig = filterConfig || internalFilterConfig;
  const currentSelectedRows = selectedRows.length > 0 ? selectedRows : internalSelectedRows;

  const getRowKey = useCallback((row: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return row[rowKey] || index;
  }, [rowKey]);

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(currentFilterConfig).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const column = columns.find(col => col.key === key);
        if (column) {
          result = result.filter(row => {
            const cellValue = row[key];
            if (column.filterType === 'select') {
              return cellValue === value;
            } else if (column.filterType === 'number') {
              return Number(cellValue) === Number(value);
            } else {
              return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
            }
          });
        }
      }
    });

    // Apply sorting
    if (currentSortConfig) {
      const { key, direction } = currentSortConfig;
      const column = columns.find(col => col.key === key);
      
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        let comparison = 0;
        
        if (column?.sortType === 'number') {
          comparison = Number(aVal) - Number(bVal);
        } else if (column?.sortType === 'date') {
          comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }
        
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, currentSortConfig, currentFilterConfig]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedAndFilteredData;
    
    const { page, pageSize } = pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, pagination]);

  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;
    
    const key = String(column.key);
    let newSortConfig: SortConfig | null = null;
    
    if (currentSortConfig?.key === key) {
      if (currentSortConfig.direction === 'asc') {
        newSortConfig = { key, direction: 'desc' };
      } else {
        newSortConfig = null;
      }
    } else {
      newSortConfig = { key, direction: 'asc' };
    }
    
    if (onSort) {
      onSort(newSortConfig);
    } else {
      setInternalSortConfig(newSortConfig);
    }
  }, [currentSortConfig, onSort]);

  const handleFilter = useCallback((key: string, value: any) => {
    const newFilterConfig = { ...currentFilterConfig, [key]: value };
    
    if (onFilter) {
      onFilter(newFilterConfig);
    } else {
      setInternalFilterConfig(newFilterConfig);
    }
  }, [currentFilterConfig, onFilter]);

  const handleSelectionChange = useCallback((selectedKeys: (string | number)[]) => {
    if (onSelectionChange) {
      onSelectionChange(selectedKeys);
    } else {
      setInternalSelectedRows(selectedKeys);
    }
  }, [onSelectionChange]);

  const tableClasses = clsx(
    'datatable',
    `datatable--${size}`,
    `datatable--${theme}`,
    {
      'datatable--bordered': bordered,
      'datatable--striped': striped,
      'datatable--hover': hover,
      'datatable--loading': loading,
    },
    className
  );

  if (loading) {
    return (
      <div className={tableClasses} style={style}>
        <div className="datatable__loading">
          <div className="datatable__spinner" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={tableClasses} style={style}>
      <div className="datatable__wrapper">
        <table className="datatable__table">
          <TableHeader
            columns={columns}
            sortConfig={currentSortConfig}
            filterConfig={currentFilterConfig}
            onSort={handleSort}
            onFilter={handleFilter}
            selectable={selectable}
            selectedRows={currentSelectedRows}
            data={paginatedData}
            onSelectionChange={handleSelectionChange}
            getRowKey={getRowKey}
          />
          <TableBody
            columns={columns}
            data={paginatedData}
            selectable={selectable}
            selectedRows={currentSelectedRows}
            onSelectionChange={handleSelectionChange}
            expandable={expandable}
            onExpand={onExpand}
            expandedRowRender={expandedRowRender}
            getRowKey={getRowKey}
            emptyText={emptyText}
          />
        </table>
      </div>
      
      {pagination && (
        <TablePagination
          pagination={pagination}
          total={sortedAndFilteredData.length}
          onChange={onPaginationChange}
        />
      )}
    </div>
  );
}; 
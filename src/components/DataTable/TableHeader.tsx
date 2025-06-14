import React, { useState } from 'react';
import { Column, SortConfig, FilterConfig } from '../../types';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig: SortConfig | null;
  filterConfig: FilterConfig;
  onSort: (column: Column<T>) => void;
  onFilter: (key: string, value: any) => void;
  selectable: boolean;
  selectedRows: (string | number)[];
  data: T[];
  onSelectionChange: (selectedKeys: (string | number)[]) => void;
  getRowKey: (row: T, index: number) => string | number;
}

export const TableHeader = <T extends Record<string, any>>({
  columns,
  sortConfig,
  filterConfig,
  onSort,
  onFilter,
  selectable,
  selectedRows,
  data,
  onSelectionChange,
  getRowKey,
}: TableHeaderProps<T>) => {
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({});

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = data.map((row, index) => getRowKey(row, index));
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const toggleFilter = (key: string) => {
    setShowFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const key = String(column.key);
    const isActive = sortConfig?.key === key;
    
    return (
      <span className="datatable__sort-icon">
        {isActive ? (
          sortConfig?.direction === 'asc' ? '↑' : '↓'
        ) : (
          '↕'
        )}
      </span>
    );
  };

  const renderFilter = (column: Column<T>) => {
    if (!column.filterable) return null;
    
    const key = String(column.key);
    const value = filterConfig[key] || '';
    
    if (column.filterType === 'select' && column.filterOptions) {
      return (
        <select
          className="datatable__filter-select"
          value={value}
          onChange={(e) => onFilter(key, e.target.value)}
        >
          <option value="">All</option>
          {column.filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        type={column.filterType === 'number' ? 'number' : 'text'}
        className="datatable__filter-input"
        placeholder={`Filter ${column.title}`}
        value={value}
        onChange={(e) => onFilter(key, e.target.value)}
      />
    );
  };

  return (
    <thead className="datatable__header">
      <tr className="datatable__header-row">
        {selectable && (
          <th className="datatable__header-cell datatable__header-cell--checkbox">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isIndeterminate;
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="datatable__checkbox"
            />
          </th>
        )}
        
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={`datatable__header-cell datatable__header-cell--${column.align || 'left'}`}
            style={{ width: column.width }}
          >
            <div className="datatable__header-content">
              <div
                className={`datatable__header-title ${column.sortable ? 'datatable__header-title--sortable' : ''}`}
                onClick={() => column.sortable && onSort(column)}
              >
                {column.title}
                {renderSortIcon(column)}
              </div>
              
              {column.filterable && (
                <div className="datatable__filter-container">
                  <button
                    className="datatable__filter-toggle"
                    onClick={() => toggleFilter(String(column.key))}
                  >
                    🔽
                  </button>
                  
                  {showFilters[String(column.key)] && (
                    <div className="datatable__filter-dropdown">
                      {renderFilter(column)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}; 
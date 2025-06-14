import React, { useState } from 'react';
import { Column } from '../../types';

interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable: boolean;
  selectedRows: (string | number)[];
  onSelectionChange: (selectedKeys: (string | number)[]) => void;
  expandable: boolean;
  onExpand?: (expanded: boolean, row: T) => void;
  expandedRowRender?: (row: T) => React.ReactNode;
  getRowKey: (row: T, index: number) => string | number;
  emptyText: React.ReactNode;
}

export const TableBody = <T extends Record<string, any>>({
  columns,
  data,
  selectable,
  selectedRows,
  onSelectionChange,
  expandable,
  onExpand,
  expandedRowRender,
  getRowKey,
  emptyText,
}: TableBodyProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  const handleRowSelection = (rowKey: string | number, checked: boolean) => {
    const newSelectedRows = checked
      ? [...selectedRows, rowKey]
      : selectedRows.filter(key => key !== rowKey);
    
    onSelectionChange(newSelectedRows);
  };

  const handleRowExpansion = (rowKey: string | number, row: T) => {
    const newExpandedRows = new Set(expandedRows);
    const isExpanded = expandedRows.has(rowKey);
    
    if (isExpanded) {
      newExpandedRows.delete(rowKey);
    } else {
      newExpandedRows.add(rowKey);
    }
    
    setExpandedRows(newExpandedRows);
    
    if (onExpand) {
      onExpand(!isExpanded, row);
    }
  };

  const renderCellContent = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    return value;
  };

  if (data.length === 0) {
    return (
      <tbody className="datatable__body">
        <tr className="datatable__empty-row">
          <td
            className="datatable__empty-cell"
            colSpan={columns.length + (selectable ? 1 : 0)}
          >
            <div className="datatable__empty-content">
              {emptyText}
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="datatable__body">
      {data.map((row, index) => {
        const rowKey = getRowKey(row, index);
        const isSelected = selectedRows.includes(rowKey);
        const isExpanded = expandedRows.has(rowKey);
        
        return (
          <React.Fragment key={rowKey}>
            <tr
              className={`datatable__row ${isSelected ? 'datatable__row--selected' : ''}`}
            >
              {selectable && (
                <td className="datatable__cell datatable__cell--checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleRowSelection(rowKey, e.target.checked)}
                    className="datatable__checkbox"
                  />
                </td>
              )}
              
              {expandable && (
                <td className="datatable__cell datatable__cell--expand">
                  <button
                    className="datatable__expand-button"
                    onClick={() => handleRowExpansion(rowKey, row)}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </td>
              )}
              
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`datatable__cell datatable__cell--${column.align || 'left'}`}
                >
                  {renderCellContent(column, row, index)}
                </td>
              ))}
            </tr>
            
            {expandable && isExpanded && expandedRowRender && (
              <tr className="datatable__expanded-row">
                <td
                  className="datatable__expanded-cell"
                  colSpan={columns.length + (selectable ? 1 : 0) + 1}
                >
                  <div className="datatable__expanded-content">
                    {expandedRowRender(row)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}; 
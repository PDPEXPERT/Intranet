import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = 'Sin resultados',
}: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <p className="font-body text-sm text-neutral-dark/60 py-4">{emptyMessage}</p>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-3"
              style={col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const alt = idx % 2 === 0 ? 'bg-surface' : 'bg-accent-light/10';
          const clickable = onRowClick
            ? 'cursor-pointer hover:bg-accent-light/20'
            : '';
          return (
            <tr
              key={rowKey(row)}
              className={`${alt} ${clickable} border-b border-neutral/30`.trim()}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top">
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

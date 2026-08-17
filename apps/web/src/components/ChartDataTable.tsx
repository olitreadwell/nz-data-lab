'use client';

/** One column in a chart data table. */
export interface ChartDataColumn<T> {
  key: keyof T;
  header: string;
  format?: (value: T[keyof T]) => string;
}

interface ChartDataTableProps<T> {
  summary: string;
  columns: ChartDataColumn<T>[];
  rows: T[];
}

/**
 * Keyboard- and screen-reader-accessible text alternative for a chart: the
 * same series data the hover tooltip shows, in a native <details>/<summary>
 * disclosure with a table.
 */
export function ChartDataTable<T>({
  summary,
  columns,
  rows,
}: ChartDataTableProps<T>): React.ReactElement {
  return (
    <details className="mt-2">
      <summary className="numeral-paragraph-sm cursor-pointer text-[var(--color-muted)] underline hover:text-[var(--color-fg)]">
        {summary}
      </summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{summary}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className="border-b border-[var(--color-border)] py-1 pr-3 font-semibold text-[var(--color-fg)]"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="border-b border-[var(--color-border)] py-1 pr-3 text-[var(--color-muted)]"
                  >
                    {column.format === undefined
                      ? String(row[column.key])
                      : column.format(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

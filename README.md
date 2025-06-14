# React Advanced DataTable

A powerful, customizable React DataTable component with sorting, filtering, pagination, and theming support. Built with TypeScript for type safety and excellent developer experience.

## Features

- ✅ **Sortable Columns** - Click headers to sort data ascending/descending
- ✅ **Filterable Columns** - Text, select, and number filters
- ✅ **Pagination** - Built-in pagination with customizable page sizes
- ✅ **Light/Dark Theming** - Theme context with automatic persistence
- ✅ **Row Selection** - Single and multi-row selection with callbacks
- ✅ **Row Expansion** - Expandable rows with custom content
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Responsive Design** - Mobile-friendly responsive layout
- ✅ **Customizable Rendering** - Custom cell renderers
- ✅ **Loading States** - Built-in loading spinner
- ✅ **Empty States** - Customizable empty data messages
- ✅ **Accessibility** - ARIA labels and keyboard navigation
- ✅ **Unit Tested** - Comprehensive test coverage

## Installation

```bash
npm install react-advanced-datatable
```

## Quick Start

```tsx
import React from 'react';
import { DataTable, ThemeProvider, Column } from 'react-advanced-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const columns: Column<User>[] = [
  { 
    key: 'name', 
    title: 'Name', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'email', 
    title: 'Email', 
    filterable: true 
  },
  { 
    key: 'role', 
    title: 'Role', 
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  },
  { 
    key: 'active', 
    title: 'Status',
    render: (value: boolean) => (
      <span className={value ? 'text-green-600' : 'text-red-600'}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  }
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: false },
  // ... more data
];

function App() {
  return (
    <ThemeProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <DataTable
          data={data}
          columns={columns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          selectable
          striped
          hover
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **required** | Array of data objects to display |
| `columns` | `Column<T>[]` | **required** | Column definitions |
| `loading` | `boolean` | `false` | Show loading spinner |
| `pagination` | `PaginationConfig \| false` | `false` | Pagination configuration |
| `sortConfig` | `SortConfig` | `undefined` | External sort state |
| `filterConfig` | `FilterConfig` | `undefined` | External filter state |
| `onSort` | `(config: SortConfig \| null) => void` | `undefined` | Sort change callback |
| `onFilter` | `(config: FilterConfig) => void` | `undefined` | Filter change callback |
| `onPaginationChange` | `(page: number, pageSize: number) => void` | `undefined` | Pagination change callback |
| `rowKey` | `keyof T \| ((row: T) => string \| number)` | `'id'` | Unique row identifier |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedRows` | `(string \| number)[]` | `[]` | Selected row keys |
| `onSelectionChange` | `(keys: (string \| number)[]) => void` | `undefined` | Selection change callback |
| `expandable` | `boolean` | `false` | Enable row expansion |
| `onExpand` | `(expanded: boolean, row: T) => void` | `undefined` | Expand change callback |
| `expandedRowRender` | `(row: T) => React.ReactNode` | `undefined` | Expanded row content renderer |
| `className` | `string` | `undefined` | Additional CSS classes |
| `style` | `React.CSSProperties` | `undefined` | Inline styles |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Table size |
| `bordered` | `boolean` | `false` | Show borders |
| `striped` | `boolean` | `false` | Alternate row colors |
| `hover` | `boolean` | `true` | Hover effects |
| `emptyText` | `React.ReactNode` | `'No data'` | Empty state content |

### Column Configuration

```tsx
interface Column<T> {
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
```

### Pagination Configuration

```tsx
interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}
```

## Theming

The component includes a theme context that supports light and dark modes:

```tsx
import { ThemeProvider, useTheme } from 'react-advanced-datatable';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div>
        <ThemeToggle />
        <DataTable data={data} columns={columns} />
      </div>
    </ThemeProvider>
  );
}
```

## Examples

### Basic Table

```tsx
<DataTable
  data={users}
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' }
  ]}
/>
```

### Sortable and Filterable

```tsx
<DataTable
  data={users}
  columns={[
    { 
      key: 'name', 
      title: 'Name', 
      sortable: true, 
      filterable: true 
    },
    { 
      key: 'age', 
      title: 'Age', 
      sortable: true, 
      sortType: 'number',
      filterable: true,
      filterType: 'number'
    }
  ]}
/>
```

### With Pagination

```tsx
const [pagination, setPagination] = useState({
  page: 1,
  pageSize: 10,
  total: users.length
});

<DataTable
  data={users}
  columns={columns}
  pagination={pagination}
  onPaginationChange={(page, pageSize) => {
    setPagination(prev => ({ ...prev, page, pageSize }));
  }}
/>
```

### Custom Cell Rendering

```tsx
const columns = [
  {
    key: 'avatar',
    title: 'Avatar',
    render: (url: string) => (
      <img src={url} alt="Avatar" className="w-8 h-8 rounded-full" />
    )
  },
  {
    key: 'status',
    title: 'Status',
    render: (status: string) => (
      <span className={`px-2 py-1 rounded text-sm ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    )
  }
];
```

### Row Selection

```tsx
const [selectedRows, setSelectedRows] = useState<number[]>([]);

<DataTable
  data={users}
  columns={columns}
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
/>
```

### Expandable Rows

```tsx
<DataTable
  data={users}
  columns={columns}
  expandable
  expandedRowRender={(user) => (
    <div className="p-4 bg-gray-50">
      <h4 className="font-semibold">Additional Details</h4>
      <p>Address: {user.address}</p>
      <p>Phone: {user.phone}</p>
    </div>
  )}
/>
```

## Styling

The component comes with default CSS that you can override. All classes are prefixed with `datatable__` to avoid conflicts.

### CSS Variables

```css
:root {
  --datatable-text-color: #333;
  --datatable-bg-color: #fff;
  --datatable-border-color: #e1e5e9;
  --datatable-hover-color: #f5f5f5;
  --datatable-selected-color: #e6f7ff;
  --datatable-primary-color: #1890ff;
}

[data-theme="dark"] {
  --datatable-text-color: #fff;
  --datatable-bg-color: #1f1f1f;
  --datatable-border-color: #404040;
  --datatable-hover-color: #333;
  --datatable-selected-color: #1a4a6b;
  --datatable-primary-color: #40a9ff;
}
```

### Custom Styling

```css
.datatable {
  /* Override default styles */
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.datatable__header-cell {
  background-color: #f8f9fa;
  font-weight: 600;
}

.datatable__row:hover {
  background-color: #f0f8ff;
}
```

## TypeScript Support

Full TypeScript support with generic types:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const columns: Column<User>[] = [
  { key: 'name', title: 'Name' }, // ✅ Typed
  { key: 'invalid', title: 'Invalid' } // ❌ TypeScript error
];

<DataTable<User>
  data={users}
  columns={columns}
  rowKey="id" // ✅ Typed to keyof User
/>
```

## Browser Support

- Chrome ≥ 60
- Firefox ≥ 60
- Safari ≥ 12
- Edge ≥ 79

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Run linting
npm run lint
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Basic table functionality
- Sorting and filtering
- Pagination support
- Theme context
- TypeScript support
- Comprehensive test coverage 
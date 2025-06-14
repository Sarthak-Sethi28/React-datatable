# React DataTable Component

Hey! This is my React DataTable component that I built for handling large datasets with sorting, filtering, and pagination. Been working on this for a while and finally got it to a place where I'm happy with it.

## What it does

- **Sorting** - Click any column header to sort (works with strings, numbers, dates)
- **Filtering** - Search and filter data with dropdowns and text inputs
- **Pagination** - Handles large datasets without performance issues
- **Themes** - Light and dark mode (because who doesn't love dark mode?)
- **Responsive** - Works on mobile, tablet, desktop
- **TypeScript** - Fully typed because I got tired of runtime errors

## Quick Start

```bash
npm install react-advanced-datatable
```

```jsx
import { DataTable } from 'react-advanced-datatable';

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  { key: 'age', title: 'Age', sortable: true, sortType: 'number' }
];

const data = [
  { id: 1, name: 'John', email: 'john@example.com', age: 30 },
  // more data...
];

function MyComponent() {
  return <DataTable data={data} columns={columns} />;
}
```

## Features I'm proud of

### Custom Rendering
You can customize how cells look:

```jsx
{
  key: 'status',
  title: 'Status',
  render: (value) => (
    <span className={value === 'active' ? 'green' : 'red'}>
      {value}
    </span>
  )
}
```

### Smart Filtering
Different filter types for different data:

```jsx
{
  key: 'department',
  title: 'Department',
  filterable: true,
  filterType: 'select',
  filterOptions: [
    { label: 'Engineering', value: 'eng' },
    { label: 'Marketing', value: 'marketing' }
  ]
}
```

### Theme Support
Wrap your app with the theme provider:

```jsx
import { ThemeProvider } from 'react-advanced-datatable';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourComponents />
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | Your data array |
| `columns` | `Array` | `[]` | Column definitions |
| `pagination` | `Object` | `{}` | Pagination settings |
| `selectable` | `boolean` | `false` | Enable row selection |
| `expandable` | `boolean` | `false` | Enable row expansion |

## Column Options

```jsx
{
  key: 'fieldName',           // required
  title: 'Display Name',      // required
  sortable: true,             // enable sorting
  sortType: 'string',         // 'string', 'number', 'date'
  filterable: true,           // enable filtering
  filterType: 'text',         // 'text', 'number', 'select'
  filterOptions: [],          // for select filters
  width: 150,                 // column width
  align: 'left',              // 'left', 'center', 'right'
  render: (value, row) => {}  // custom renderer
}
```

## Development

If you want to contribute or run this locally:

```bash
git clone https://github.com/Sarthak-Sethi28/React-datatable.git
cd React-datatable
npm install
npm run dev
```

The demo will be at `http://localhost:3000`

## Testing

```bash
npm test
npm run test:coverage
```

## Building

```bash
npm run build
```

## Why I built this

I was working on a project that needed a good data table and couldn't find one that did everything I wanted without being overly complicated. Most libraries were either too basic or had way too many features I didn't need.

So I built this one. It's not perfect, but it works well for most use cases.

## Issues?

If you find bugs or have feature requests, open an issue on GitHub. I try to respond pretty quickly.

## License

MIT - do whatever you want with it.

---

Built with ❤️ and lots of coffee ☕ 
import React, { useState } from 'react';
import { DataTable, ThemeProvider, useTheme, Column } from '../src';

// Sample data interface
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'moderator';
  department: string;
  salary: number;
  joinDate: string;
  active: boolean;
  avatar: string;
}

// Sample data
const sampleData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    age: 32,
    role: 'admin',
    department: 'Engineering',
    salary: 85000,
    joinDate: '2021-03-15',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    age: 28,
    role: 'user',
    department: 'Marketing',
    salary: 65000,
    joinDate: '2022-01-10',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    age: 35,
    role: 'moderator',
    department: 'Engineering',
    salary: 78000,
    joinDate: '2020-08-22',
    active: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    age: 29,
    role: 'user',
    department: 'Design',
    salary: 72000,
    joinDate: '2021-11-05',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    age: 31,
    role: 'admin',
    department: 'Engineering',
    salary: 92000,
    joinDate: '2019-05-12',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana.prince@company.com',
    age: 27,
    role: 'user',
    department: 'HR',
    salary: 58000,
    joinDate: '2022-09-18',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana'
  },
  {
    id: 7,
    name: 'Edward Norton',
    email: 'edward.norton@company.com',
    age: 33,
    role: 'moderator',
    department: 'Marketing',
    salary: 69000,
    joinDate: '2021-07-20',
    active: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edward'
  },
  {
    id: 8,
    name: 'Fiona Green',
    email: 'fiona.green@company.com',
    age: 26,
    role: 'user',
    department: 'Design',
    salary: 67000,
    joinDate: '2023-02-14',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona'
  }
];

// Theme toggle component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
        cursor: 'pointer',
        marginBottom: '20px'
      }}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
}

// Main demo component
function DataTableDemo() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    total: sampleData.length
  });

  // Column definitions
  const columns: Column<User>[] = [
    {
      key: 'avatar',
      title: 'Avatar',
      width: 80,
      align: 'center',
      render: (url: string, user: User) => (
        <img
          src={url}
          alt={`${user.name}'s avatar`}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      )
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterable: true,
      width: 150,
      render: (name: string, user: User) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
        </div>
      )
    },
    {
      key: 'age',
      title: 'Age',
      sortable: true,
      sortType: 'number',
      filterable: true,
      filterType: 'number',
      width: 80,
      align: 'center'
    },
    {
      key: 'role',
      title: 'Role',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Moderator', value: 'moderator' }
      ],
      render: (role: string) => {
        const colors = {
          admin: { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
          moderator: { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' },
          user: { bg: '#ecfdf5', text: '#065f46', border: '#34d399' }
        };
        const color = colors[role as keyof typeof colors];
        
        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: color.bg,
              color: color.text,
              border: `1px solid ${color.border}`,
              textTransform: 'capitalize'
            }}
          >
            {role}
          </span>
        );
      }
    },
    {
      key: 'department',
      title: 'Department',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Design', value: 'Design' },
        { label: 'HR', value: 'HR' }
      ]
    },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      sortType: 'number',
      align: 'right',
      render: (salary: number) => (
        <span style={{ fontWeight: '600' }}>
          ${salary.toLocaleString()}
        </span>
      )
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      sortable: true,
      sortType: 'date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      key: 'active',
      title: 'Status',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ],
      render: (active: boolean) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: active ? '#dcfce7' : '#fee2e2',
            color: active ? '#166534' : '#991b1b',
            border: `1px solid ${active ? '#22c55e' : '#ef4444'}`
          }}
        >
          {active ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, page, pageSize }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>React Advanced DataTable Demo</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        A comprehensive example showcasing all features of the DataTable component.
      </p>
      
      <ThemeToggle />
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Features Demonstrated:</h3>
        <ul style={{ color: '#666', fontSize: '14px' }}>
          <li>✅ Sortable columns (Name, Age, Salary, Join Date)</li>
          <li>✅ Filterable columns (Name, Age, Role, Department, Status)</li>
          <li>✅ Custom cell rendering (Avatar, Name/Email, Role badges, Status badges)</li>
          <li>✅ Pagination with customizable page sizes</li>
          <li>✅ Row selection with callbacks</li>
          <li>✅ Light/Dark theme switching</li>
          <li>✅ Responsive design</li>
          <li>✅ TypeScript type safety</li>
        </ul>
      </div>

      {selectedRows.length > 0 && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#e0f2fe',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
            marginBottom: '20px'
          }}
        >
          <strong>Selected:</strong> {selectedRows.length} user(s)
          <button
            onClick={() => setSelectedRows([])}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear Selection
          </button>
        </div>
      )}

      <DataTable<User>
        data={sampleData}
        columns={columns}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          showQuickJumper: true,
          showTotal: (total, range) => (
            <span>Showing {range[0]}-{range[1]} of {total} users</span>
          )
        }}
        onPaginationChange={handlePaginationChange}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        expandable
        expandedRowRender={(user) => (
          <div style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Additional Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <strong>Employee ID:</strong> {user.id}
              </div>
              <div>
                <strong>Full Email:</strong> {user.email}
              </div>
              <div>
                <strong>Department:</strong> {user.department}
              </div>
              <div>
                <strong>Annual Salary:</strong> ${user.salary.toLocaleString()}
              </div>
              <div>
                <strong>Join Date:</strong> {new Date(user.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div>
                <strong>Account Status:</strong> {user.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        )}
        striped
        hover
        bordered
        size="medium"
        className="demo-table"
        emptyText={
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No users found
            </div>
            <div style={{ color: '#666' }}>
              Try adjusting your filters or search criteria
            </div>
          </div>
        }
      />

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Try these interactions:</h3>
        <ul style={{ color: '#666', fontSize: '14px' }}>
          <li>Click column headers to sort (Name, Age, Salary, Join Date)</li>
          <li>Use the filter dropdowns (🔽) to filter data</li>
          <li>Select rows using checkboxes</li>
          <li>Click the expand button (+) to see additional details</li>
          <li>Change page size or navigate between pages</li>
          <li>Toggle between light and dark themes</li>
        </ul>
      </div>
    </div>
  );
}

// App component with theme provider
export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <DataTableDemo />
    </ThemeProvider>
  );
} 
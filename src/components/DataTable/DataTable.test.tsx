import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import { ThemeProvider } from '../../context/ThemeContext';
import { Column } from '../../types';

// Mock data for testing
interface TestData {
  id: number;
  name: string;
  age: number;
  email: string;
  role: string;
  active: boolean;
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', role: 'admin', active: true },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', role: 'user', active: false },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', role: 'user', active: true },
  { id: 4, name: 'Alice Brown', age: 28, email: 'alice@example.com', role: 'admin', active: true },
  { id: 5, name: 'Charlie Wilson', age: 32, email: 'charlie@example.com', role: 'user', active: false },
];

const mockColumns: Column<TestData>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'age', title: 'Age', sortable: true, sortType: 'number' },
  { key: 'email', title: 'Email', filterable: true },
  { 
    key: 'role', 
    title: 'Role', 
    filterable: true, 
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ]
  },
  { 
    key: 'active', 
    title: 'Status', 
    render: (value: boolean) => (
      <span className={value ? 'status-active' : 'status-inactive'}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  },
];

const renderWithTheme = (ui: React.ReactElement, theme: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider defaultTheme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('DataTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders table with data', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      renderWithTheme(
        <DataTable data={[]} columns={mockColumns} emptyText="No records found" />
      );

      expect(screen.getByText('No records found')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} loading />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts data when clicking sortable column headers', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />
      );

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Check if data is sorted (first item should be Alice Brown)
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Alice Brown');
    });

    it('calls onSort callback when provided', async () => {
      const user = userEvent.setup();
      const onSort = jest.fn();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} onSort={onSort} />
      );

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      expect(onSort).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc',
      });
    });

    it('toggles sort direction on multiple clicks', async () => {
      const user = userEvent.setup();
      const onSort = jest.fn();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} onSort={onSort} />
      );

      const nameHeader = screen.getByText('Name');
      
      // First click - ascending
      await user.click(nameHeader);
      expect(onSort).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc',
      });

      // Second click - descending
      await user.click(nameHeader);
      expect(onSort).toHaveBeenCalledWith({
        key: 'name',
        direction: 'desc',
      });

      // Third click - no sort
      await user.click(nameHeader);
      expect(onSort).toHaveBeenCalledWith(null);
    });
  });

  describe('Filtering', () => {
    it('filters data based on text input', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />
      );

      // Open filter for name column
      const filterToggle = screen.getAllByText('🔽')[0];
      await user.click(filterToggle);

      const filterInput = screen.getByPlaceholderText('Filter Name');
      await user.type(filterInput, 'John');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('filters data based on select dropdown', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />
      );

      // Open filter for role column
      const filterToggles = screen.getAllByText('🔽');
      const roleFilterToggle = filterToggles.find(toggle => 
        toggle.closest('th')?.textContent?.includes('Role')
      );
      
      if (roleFilterToggle) {
        await user.click(roleFilterToggle);
        
        const selectFilter = screen.getByDisplayValue('All');
        await user.selectOptions(selectFilter, 'admin');

        await waitFor(() => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
          expect(screen.getByText('Alice Brown')).toBeInTheDocument();
          expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        });
      }
    });

    it('calls onFilter callback when provided', async () => {
      const user = userEvent.setup();
      const onFilter = jest.fn();
      
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} onFilter={onFilter} />
      );

      const filterToggle = screen.getAllByText('🔽')[0];
      await user.click(filterToggle);

      const filterInput = screen.getByPlaceholderText('Filter Name');
      await user.type(filterInput, 'John');

      expect(onFilter).toHaveBeenCalledWith({
        name: 'John',
      });
    });
  });

  describe('Pagination', () => {
    it('renders pagination when configured', () => {
      const pagination = {
        page: 1,
        pageSize: 2,
        total: mockData.length,
      };

      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          pagination={pagination}
        />
      );

      expect(screen.getByText('Showing 1 to 2 of 5 entries')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('calls onPaginationChange when page changes', async () => {
      const user = userEvent.setup();
      const onPaginationChange = jest.fn();
      const pagination = {
        page: 1,
        pageSize: 2,
        total: mockData.length,
      };

      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      );

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      expect(onPaginationChange).toHaveBeenCalledWith(2, 2);
    });

    it('changes page size when size changer is used', async () => {
      const user = userEvent.setup();
      const onPaginationChange = jest.fn();
      const pagination = {
        page: 1,
        pageSize: 2,
        total: mockData.length,
        showSizeChanger: true,
      };

      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      );

      const sizeSelect = screen.getByDisplayValue('2 / page');
      await user.selectOptions(sizeSelect, '10');

      expect(onPaginationChange).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('Selection', () => {
    it('renders checkboxes when selectable is true', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} selectable />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(mockData.length + 1); // +1 for select all
    });

    it('calls onSelectionChange when row is selected', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First data row

      expect(onSelectionChange).toHaveBeenCalledWith([1]);
    });

    it('selects all rows when select all is clicked', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
    });
  });

  describe('Theming', () => {
    it('applies light theme classes', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />,
        'light'
      );

      const themeContainer = document.querySelector('.datatable-theme-light');
      expect(themeContainer).toBeInTheDocument();
    });

    it('applies dark theme classes', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />,
        'dark'
      );

      const themeContainer = document.querySelector('.datatable-theme-dark');
      expect(themeContainer).toBeInTheDocument();
    });
  });

  describe('Custom Rendering', () => {
    it('uses custom render function for columns', () => {
      renderWithTheme(
        <DataTable data={mockData} columns={mockColumns} />
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('applies custom className', () => {
      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          className="custom-table"
        />
      );

      const table = document.querySelector('.custom-table');
      expect(table).toBeInTheDocument();
    });

    it('applies size variants', () => {
      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          size="large"
        />
      );

      const table = document.querySelector('.datatable--large');
      expect(table).toBeInTheDocument();
    });

    it('applies styling variants', () => {
      renderWithTheme(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          bordered
          striped
          hover={false}
        />
      );

      const table = document.querySelector('.datatable--bordered');
      expect(table).toBeInTheDocument();
      
      const stripedTable = document.querySelector('.datatable--striped');
      expect(stripedTable).toBeInTheDocument();
    });
  });
}); 
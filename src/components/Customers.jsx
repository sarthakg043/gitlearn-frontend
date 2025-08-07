import React, { useState, useEffect } from 'react';
import { apiService } from '../config/apiConfig';
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from './common';

const CustomerCard = ({ customer }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-gray-900">{customer.name}</h4>
          <Badge variant="success">
            {customer.loyaltyTier}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Email:</span>
            <p className="font-medium break-all">{customer.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-medium">{customer.phone}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Orders:</span>
            <p className="font-medium text-blue-600">{customer.totalOrders}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Spent:</span>
            <p className="font-medium text-green-600">${customer.totalSpent.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Avg Order:</span>
            <p className="font-medium">${(customer.totalSpent / customer.totalOrders).toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-500">Registered:</span>
            <p className="font-medium">{formatDate(customer.registrationDate)}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Address:</span>
            <span className="font-medium">{customer.city}, {customer.country}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CustomerFilters = ({ filters, onFiltersChange }) => {
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'orders', label: 'Total Orders' },
    { value: 'spent', label: 'Total Spent' },
    { value: 'name', label: 'Name' },
    { value: 'registered', label: 'Registration Date' }
  ];

  return (
    <Card title="Filters">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Orders
          </label>
          <input
            type="number"
            min="0"
            value={filters.minOrders || ''}
            onChange={(e) => onFiltersChange({ ...filters, minOrders: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Spent ($)
          </label>
          <input
            type="number"
            min="0"
            value={filters.minSpent || ''}
            onChange={(e) => onFiltersChange({ ...filters, minSpent: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || ''}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <Button
          onClick={() => onFiltersChange({})}
          variant="outline"
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
};

const TopCustomers = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState('spent');

  const fetchTopCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopCustomers({ limit, sortBy });
      setTopCustomers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch top customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCustomers();
  }, [limit, sortBy]);

  return (
    <Card title="Top Customers">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Limit:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded text-sm"
            >
              <option value="spent">Spent</option>
              <option value="orders">Orders</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.loyaltyTier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {sortBy === 'spent' ? `$${customer.totalSpent.toLocaleString()}` : `${customer.totalOrders} orders`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sortBy === 'spent' ? `${customer.totalOrders} orders` : `$${customer.totalSpent.toLocaleString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clean up filters - remove empty values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const response = await apiService.getCustomers(cleanFilters);
      setCustomers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCustomers} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <Badge variant="info">{customers.length} customers found</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CustomerFilters filters={filters} onFiltersChange={setFilters} />
          <TopCustomers />
        </div>
        
        <div className="lg:col-span-3">
          {customers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">No customers found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;

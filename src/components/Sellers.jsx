import React, { useState, useEffect } from 'react';
import { apiService } from '../config/apiConfig';
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from './common';

const SellerCard = ({ seller }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-gray-900">{seller.name}</h4>
          <Badge variant="success">
            ★ {seller.rating.toFixed(1)}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm">{seller.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Business:</span>
            <p className="font-medium">{seller.businessType}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Sales:</span>
            <p className="font-medium">${seller.totalSales.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Products:</span>
            <p className="font-medium">{seller.productCount}</p>
          </div>
          <div>
            <span className="text-gray-500">Joined:</span>
            <p className="font-medium">{new Date(seller.joinedDate).getFullYear()}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Contact:</span>
            <span className="text-sm font-medium">{seller.email}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SellerFilters = ({ filters, onFiltersChange }) => {
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'rating', label: 'Rating' },
    { value: 'sales', label: 'Sales' },
    { value: 'name', label: 'Name' }
  ];

  return (
    <Card title="Filters">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={filters.minRating || ''}
            onChange={(e) => onFiltersChange({ ...filters, minRating: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0.0"
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

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);

  const fetchTopSellers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopSellers({ limit });
      setTopSellers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch top sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopSellers();
  }, [limit]);

  return (
    <Card title="Top Sellers">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Limit:
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="p-1 border border-gray-300 rounded text-sm"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {topSellers.map((seller, index) => (
              <div key={seller.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.businessType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">★ {seller.rating.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">${seller.totalSales.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchSellers = async () => {
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
      
      const response = await apiService.getSellers(cleanFilters);
      setSellers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filters]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSellers} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sellers</h2>
        <Badge variant="info">{sellers.length} sellers found</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SellerFilters filters={filters} onFiltersChange={setFilters} />
          <TopSellers />
        </div>
        
        <div className="lg:col-span-3">
          {sellers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">No sellers found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sellers;

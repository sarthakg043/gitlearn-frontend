import React, { useState, useEffect } from 'react';
import { apiService } from '../config/apiConfig';
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from './common';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => `$${price.toFixed(2)}`;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
          <Badge variant="info">{product.category}</Badge>
        </div>
        
        <p className="text-gray-600 text-sm">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Seller: {product.sellerName}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{product.rating}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProductFilters = ({ filters, onFiltersChange }) => {
  const categories = ['All', 'Electronics', 'Footwear', 'Clothing'];

  return (
    <Card title="Filters">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value === 'All' ? '' : e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="999999"
            />
          </div>
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchProducts = async () => {
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
      
      const response = await apiService.getProducts(cleanFilters);
      setProducts(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProducts} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Badge variant="info">{products.length} products found</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

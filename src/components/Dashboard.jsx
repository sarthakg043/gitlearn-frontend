import React, { useState, useEffect } from 'react';
import { apiService } from '../config/apiConfig';
import { LoadingSpinner, ErrorMessage, Card, Badge } from './common';
import ApiTester from './ApiTester';

const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const QuickStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSellers: 0,
    totalCustomers: 0,
    averageProductRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all endpoints
        const [productsRes, sellersRes, customersRes] = await Promise.all([
          apiService.getProducts(),
          apiService.getSellers(),
          apiService.getCustomers()
        ]);

        const products = productsRes.data.data || [];
        const sellers = sellersRes.data.data || [];
        const customers = customersRes.data.data || [];

        // Calculate average product rating
        const avgRating = products.length > 0
          ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
          : 0;

        setStats({
          totalProducts: products.length,
          totalSellers: sellers.length,
          totalCustomers: customers.length,
          averageProductRating: avgRating
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Products"
        value={stats.totalProducts}
        subtitle="Active listings"
        color="blue"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
      
      <StatCard
        title="Total Sellers"
        value={stats.totalSellers}
        subtitle="Active merchants"
        color="green"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      />
      
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers}
        subtitle="Registered users"
        color="purple"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        }
      />
      
      <StatCard
        title="Avg Rating"
        value={stats.averageProductRating.toFixed(1)}
        subtitle="Product rating"
        color="yellow"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        }
      />
    </div>
  );
};

const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await apiService.getProducts();
        // Get first 5 products as "recent"
        setProducts((response.data.data || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Card title="Recent Products">
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">${product.price}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-yellow-500 mr-1">★</span>
                {product.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TopPerformers = () => {
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const [sellersRes, customersRes] = await Promise.all([
          apiService.getTopSellers({ limit: 3 }),
          apiService.getTopCustomers({ limit: 3, sortBy: 'spent' })
        ]);

        setSellers(sellersRes.data.data || []);
        setCustomers(customersRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch top performers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Top Sellers">
        <div className="space-y-3">
          {sellers.map((seller, index) => (
            <div key={seller.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
      </Card>

      <Card title="Top Customers">
        <div className="space-y-3">
          {customers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
                <p className="font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your e-commerce analytics dashboard
        </p>
      </div>
      
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <RecentProducts />
          <ApiTester />
        </div>
        <div className="lg:col-span-2">
          <TopPerformers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

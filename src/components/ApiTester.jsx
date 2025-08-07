import React, { useState } from 'react';
import { apiService } from '../config/apiConfig';
import { Card, Button, Badge } from './common';

const ApiTester = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoints = [
    { name: 'Health Check', call: () => apiService.healthCheck() },
    { name: 'API Info', call: () => apiService.getApiInfo() },
    { name: 'Get Products', call: () => apiService.getProducts() },
    { name: 'Get Sellers', call: () => apiService.getSellers() },
    { name: 'Get Customers', call: () => apiService.getCustomers() },
    { name: 'Top Sellers', call: () => apiService.getTopSellers({ limit: 3 }) },
    { name: 'Top Customers', call: () => apiService.getTopCustomers({ limit: 3 }) }
  ];

  const runTests = async () => {
    setTesting(true);
    const results = {};

    for (const test of testEndpoints) {
      try {
        const response = await test.call();
        results[test.name] = {
          success: true,
          status: response.status,
          data: response.data
        };
      } catch (error) {
        results[test.name] = {
          success: false,
          error: error.response?.data?.message || error.message
        };
      }
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <Card title="API Connection Tester">
      <div className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Testing...' : 'Test All Endpoints'}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Test Results:</h4>
            {Object.entries(testResults).map(([name, result]) => (
              <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{name}</span>
                <Badge variant={result.success ? 'success' : 'error'}>
                  {result.success ? '✓ Success' : '✗ Failed'}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {Object.values(testResults).some(r => r.success) && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ API is working! You can now browse the different sections.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApiTester;

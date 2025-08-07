# E-Commerce Dashboard Frontend

A modern React frontend application for an e-commerce analytics dashboard built with React, Tailwind CSS, and Axios.

## Features

- **Dashboard Overview**: Quick stats and overview of products, sellers, and customers
- **Products Management**: Browse, filter, and search products with category and price filters
- **Sellers Analytics**: View seller information with rating and sales data
- **Customer Insights**: Track customer orders, spending, and loyalty tiers
- **Real-time API Integration**: Centralized API configuration with Axios
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive design
- **Error Handling**: Comprehensive error handling and loading states

## Tech Stack

- **React 19** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   └── index.js          # Reusable UI components
│   ├── ApiTester.jsx         # API connection tester
│   ├── Customers.jsx         # Customer management
│   ├── Dashboard.jsx         # Dashboard overview
│   ├── Layout.jsx            # App layout wrapper
│   ├── Products.jsx          # Product catalog
│   └── Sellers.jsx           # Seller management
├── config/
│   └── apiConfig.js          # API configuration and endpoints
├── hooks/
│   └── useApi.js             # Custom hooks for API calls
├── App.jsx                   # Main app component
└── main.jsx                  # App entry point
```

## API Integration

The application integrates with a REST API running on `http://localhost:3000` with the following endpoints:

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Sellers
- `GET /api/sellers` - Get all sellers with filtering
- `GET /api/sellers/:id` - Get seller by ID  
- `GET /api/sellers/top` - Get top sellers by rating

### Customers
- `GET /api/customers` - Get all customers with filtering
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/top` - Get top customers

### Utility
- `GET /health` - Health check endpoint
- `GET /` - API information

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_KEY=your_api_key_here
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API server running on http://localhost:3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API configuration
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Component Features

### Dashboard
- Overview statistics (total products, sellers, customers)
- Average product rating calculation
- Recent products listing
- Top performers (sellers and customers)
- API connection tester

### Products
- Product grid with card layout
- Category filtering (Electronics, Footwear, Clothing)
- Price range filtering (min/max)
- Seller filtering
- Real-time search and filtering

### Sellers
- Seller information cards
- Rating and sales data
- Business type and contact information
- Top sellers leaderboard
- Sorting by rating, sales, and name

### Customers
- Customer profile cards
- Order history and spending data
- Loyalty tier badges
- Top customers by spending or orders
- Registration date tracking

## API Configuration

The `src/config/apiConfig.js` file provides:

- Centralized endpoint management
- Axios instance with base configuration
- Request/response interceptors
- Error handling
- Environment-based configuration

## Error Handling

- Network error detection
- API error message display
- Retry functionality
- Loading states
- Connection status indicators

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface
- Optimized for tablets and desktops

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Modular, reusable React components
- **Hooks**: Custom hooks for API calls and utilities
- **Config**: Centralized configuration management
- **Common**: Shared UI components and utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

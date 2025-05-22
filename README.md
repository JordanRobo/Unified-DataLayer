# Unified DataLayer

A multi-framework utility package for managing XP Data Layer events across different platforms, with a focus on Adobe Analytics integration.

[![npm version](https://img.shields.io/npm/v/unified-datalayer.svg)](https://www.npmjs.com/package/unified-datalayer)
[![license](https://img.shields.io/npm/l/unified-datalayer.svg)](https://github.com/JordanRobo/Unified-DataLayer/blob/main/LICENSE)

## Overview

Unified DataLayer provides a standardised way to interact with Adobe's Data Layer across different web frameworks. It offers module-based architecture for various tracking scenarios like page views, product displays, cart interactions, and more.

## Features

- **Framework Agnostic**: Works with any JavaScript framework (React, Vue, Angular, etc.)
- **Singleton Pattern**: Consistent access to the data layer across your application
- **Modular Design**: Separate modules for different tracking scenarios
- **Smart Nullification**: Automatically handles data layer cleanup between events
- **Standardised Formatting**: Ensures consistent data structure across all events
- **Built-in Validation**: Comprehensive input validation with detailed error messages
- **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
# Using npm
npm install unified-datalayer

# Using yarn
yarn add unified-datalayer

# Using bun
bun add unified-datalayer
```

## Basic Usage

### Initialisation

Initialise the data layer with your site information:

```typescript
import { getDataLayer } from 'unified-datalayer';

// Get the singleton instance
const dataLayer = getDataLayer();

// Initialise with site info (required)
dataLayer.init({
  siteInfo: {
    name: 'My Store',
    experience: 'web',
    currency: 'USD',
    division: 'retail',
    domain: 'mystore.com',
    env: 'production',
    version: '1.0.0'
  }
});
```

### Tracking Page Views

```typescript
// Track homepage view
dataLayer.page.home();

// Track other page types
dataLayer.page.view('category');
dataLayer.page.view('search', 'results');
```

### Tracking Product Display

```typescript
// Track product view on PDP
const product = {
  brand: 'Brand Name',
  category: ['Footwear', 'Running'],
  child_sku: 'SKU12345',
  color: 'Blue',
  full_price: 150,
  gender: 'Men',
  listed_price: 150,
  name: 'Speed Runner 2.0',
  parent_category: 'Footwear',
  parent_sku: 'PARENT-SKU',
  sku_available: true
};

dataLayer.pdp.view(product);

// Track color selection
dataLayer.pdp.colorSelect('Red');

// Track size selection
dataLayer.pdp.sizeSelect('10');
```

### Tracking Cart Interactions

```typescript
// Track adding a product to cart
const cartProduct = {
  ...product,
  qty: 1,
  size: '10',
  sku_by_size: 'SKU12345-10'
};

dataLayer.cart.add(cartProduct);

// Track cart view
const cartItems = [
  { ...cartProduct, qty: 1 },
  { ...anotherCartProduct, qty: 2 }
];

dataLayer.cart.fullView(cartItems, { cartId: 'cart123' });

// Track cart updates
dataLayer.cart.update('SKU12345-10', 2);

// Track cart item removal
dataLayer.cart.remove('SKU12345-10');
```

## Available Modules

### Page Module
Handles tracking for general page views and navigation:
- `home()`: Track home page view
- `view(pageType, action?)`: Track any page type view
- `error()`: Track page errors

### Product Display Module (PDP)
Manages tracking for product detail pages:
- `view(productData)`: Track product detail view
- `colorSelect(color)`: Track color selection
- `sizeSelect(size)`: Track size selection

### Product Listing Module (PLP)
Manages tracking for product listing pages:
- `view(productsArray, listName?)`: Track product listing view
- `filter(listFilters)`: Track filter usage
- `sort(option)`: Track sort option selection
- `click()`: Track product click (placeholder)

### Cart Module
Manages tracking for cart interactions:
- `add(product)`: Track adding product to cart
- `remove(childSku)`: Track removing product from cart
- `update(childSku, quantity)`: Track updating cart item quantity
- `miniView(items, cartInfo)`: Track mini cart view
- `fullView(items, cartInfo)`: Track full cart view
- `getCartItems()`: Get current cart items
- `getCartInfo()`: Get current cart information

### Checkout Module
Manages tracking for checkout process:
- `start()`: Track checkout initiation
- `step2()`: Track checkout second step
- `step3()`: Track checkout third step

### Account Module
Manages tracking for user account actions:
- `createStart()`: Track account creation start
- `createComplete()`: Track account creation completion
- `loginStart()`: Track login attempt
- `loginSuccess()`: Track successful login

### Order Module
Manages tracking for order completion:
- `success()`: Track successful order completion

### Wishlist Module
Manages tracking for wishlist interactions:
- `view()`: Track wishlist view
- `add()`: Track adding item to wishlist

## Data Types

### ProductData Interface
```typescript
interface ProductData {
  brand: string;
  category: string[];
  child_sku: string;
  color: string;
  full_price: number;
  gender: string;
  listed_price: number;
  name: string;
  parent_category: string;
  parent_sku: string;
  sku_available: boolean;
  // Optional fields
  available_size?: string[];
  barcode?: string;
  feature?: string[];
  rating?: number;
  reward_points?: number;
  model?: string;
  speciality?: string;
  sport?: string;
  story?: string;
}
```

### CartProductData Interface
```typescript
interface CartProductData extends ProductData {
  qty: number;
  size: string;
  sku_by_size: string;
}
```

### ListFilters Interface
```typescript
interface ListFilters {
  filter_type: string;  // Pipe-separated: "category|price|color"
  filter_value: string; // Corresponding values: "sneakers|50-100|red,blue"
}
```

## Advanced Configuration

### Property Nullification

Configure which properties should be automatically nullified between events:

```typescript
// Set properties to nullify
dataLayer.setPropertiesToNullify({
  default: ['error', 'user'],
  cart: ['cart_item_removed']
});

// Add properties to nullify 
dataLayer.addPropertiesToNullify('default', ['search']);
```

### Error Handling

The library includes comprehensive error handling with detailed error messages. 

All errors are logged to the console and requires no implementation, this is all handled internally.


### State Management

Access current cart state:

```typescript
// Get current cart items
const currentItems = dataLayer.cart.getCartItems();

// Get current cart info
const cartInfo = dataLayer.cart.getCartInfo();
```

## Event Examples

### Product Listing with Filters
```typescript
// Track product listing view
const products = [
  {
    brand: 'Nike',
    category: ['Footwear', 'Running'],
    child_sku: 'NIKE-RUN-001',
    color: 'Black',
    full_price: 120.00,
    gender: 'Men',
    listed_price: 99.99,
    name: 'Air Max Runner',
    parent_category: 'Footwear',
    parent_sku: 'NIKE-RUN',
    sku_available: true
  }
];

dataLayer.plp.view(products, 'Running Shoes');

// Track filter application
dataLayer.plp.filter({
  filter_type: 'category|price|color',
  filter_value: 'running|50-150|black,white'
});

// Track sorting
dataLayer.plp.sort('price_ascending');
```

### Account Creation Flow
```typescript
// Track account creation start
dataLayer.account.createStart();

// After successful registration
dataLayer.account.createComplete();

// Track login attempts
dataLayer.account.loginStart();

// After successful login
dataLayer.account.loginSuccess();
```

## Development

### Prerequisites

- [Bun](https://bun.sh/) (for building and testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/JordanRobo/Unified-DataLayer
cd unified-datalayer

# Install dependencies
bun install
```

### Scripts

```bash
# Build the package
bun run build

# Generate TypeScript declarations
bun run build:types

# Run development mode with watch
bun run dev

# Run tests
bun run test

# Build and prepare for publishing
bun run prepare
```

### Testing

The package includes a comprehensive test suite with an interactive HTML test page:

```bash
# Open test/index.html in a browser to test all functionality
# The test page includes:
# - All module testing
# - Error handling validation
# - Real-time data layer state inspection
# - Console output monitoring
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Adobe Client Data Layer integration

## License

This project is licensed under the BSD 3-Clause License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Thanks

Example site cloned from https://github.com/SwiftMarket/swiftmarket-sveltekit.git
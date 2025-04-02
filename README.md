# Unified DataLayer

A multi-framework utility package for managing XP Data Layer events across different platforms, with a focus on Adobe Analytics integration.

[![npm version](https://img.shields.io/npm/v/unified-datalayer.svg)](https://www.npmjs.com/package/unified-datalayer)
[![license](https://img.shields.io/npm/l/unified-datalayer.svg)](https://github.com/yourusername/unified-datalayer/blob/main/LICENSE)

## Overview

Unified DataLayer provides a standardised way to interact with Adobe's Data Layer across different web frameworks. It offers module-based architecture for various tracking scenarios like page views, product displays, cart interactions, and more.

## Features

- **Framework Agnostic**: Works with any JavaScript framework (React, Vue, Angular, etc.)
- **Singleton Pattern**: Consistent access to the data layer across your application
- **Modular Design**: Separate modules for different tracking scenarios
- **Smart Nullification**: Automatically handles data layer cleanup between events
- **Standardised Formatting**: Ensures consistent data structure across all events

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

### Initialization

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
  discount: 0,
  feature: ['waterproof', 'lightweight'],
  full_price: 150,
  gender: 'Men',
  is_markdown: false,
  listed_price: 150,
  model: 'Speed Runner',
  name: 'Speed Runner 2.0',
  parent_category: 'Footwear',
  parent_sku: 'PARENT-SKU',
  rating: 4.5
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
dataLayer.cart.add(product);

// Track cart view
const cartItems = [
  { ...product, qty: 1 },
  { ...anotherProduct, qty: 2 }
];

dataLayer.cart.fullView(cartItems, { cartId: 'cart123' });
```

## Available Modules

### Page Module
Handles tracking for general page views and navigation:
- `home()`: Track home page view
- `view(pageType, action)`: Track any page type view
- `error()`: Track page errors

### Product Display Module (PDP)
Manages tracking for product detail pages:
- `view(productData)`: Track product detail view
- `colorSelect(colour)`: Track colour selection
- `sizeSelect(size)`: Track size selection

### Product Listing Module (PLP)
Manages tracking for product listing pages:
- `view(productsArray, listName)`: Track product listing view
- `filter(filterOptions)`: Track filter usage
- `sort(option)`: Track sort option selection

### Cart Module
Manages tracking for cart interactions:
- `add(product)`: Track adding product to cart
- `remove(removedProduct, remainingItems, cartInfo)`: Track removing product from cart
- `update(items, cartInfo)`: Track cart update
- `miniView(items, cartInfo)`: Track mini cart view
- `fullView(items, cartInfo)`: Track full cart view

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

### Wishlist Module
Manages tracking for wishlist interactions:
- `view()`: Track wishlist view
- `add()`: Track adding item to wishlist

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
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
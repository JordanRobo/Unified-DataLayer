# Unified DataLayer

A multi-framework utility package for managing XP Data Layer events, with built-in support for React, Svelte, and Angular (Coming Soon).

## Features

- Framework-specific implementations for React, Svelte, and Angular
- Vanilla JavaScript support for any other framework
- Simple, intuitive API with predefined methods for common tracking needs
- Smart event nullification to maintain clean state between events
- TypeScript support with full type definitions
- Configurable site information

## Installation

Using Bun:

```bash
bun add unified-datalayer
```

Using npm:

```bash
npm install unified-datalayer
```

Using yarn:

```bash
yarn add unified-datalayer
```

## Basic Setup

Include the Adobe Data Layer script in your HTML:

> For further instructions on this implementation visit [adobe-client-data-layer](https://github.com/adobe/adobe-client-data-layer)

```html
<script src="adobe-client-data-layer.min.js" async defer></script>
```

Then initialize the data layer in your application:

```javascript
import { initializeDataLayer } from 'unified-datalayer';

// Initialize with custom site information
initializeDataLayer({
  siteInfo: {
    name: "my-site",
    experience: "desktop",
    currency: "USD",
    division: "myCompany",
    domain: window.location.host,
    env: "prod",
    version: "2.0.0"
  }
});
```

## Framework-Specific Usage

### React

```jsx
// Coming Soon
```

### Svelte

```html
// Coming Soon
```

### Angular

```typescript
// Coming Soon
```

### Vanilla JavaScript

```javascript
import { initializeDataLayer, DataLayer } from 'unified-datalayer';

// Initialize
initializeDataLayer();

const dl = new DataLayer();

// Track home page
dl.page.home();

// Track product view
dl.pdp.view({
  id: '123',
  name: 'Example Product',
  price: 99.99
});

// Add event listeners
document.querySelector('#add-to-cart').addEventListener('click', () => {
  dl.cart.add({
    id: '123',
    name: 'Example Product',
    price: 99.99
  });
});
```

## API Reference

### Core Methods

- `initializeDataLayer(options?)`: Initialize the data layer
- `pushDataLayerEvent(eventName, eventData?)`: Push an event manually
- `resetFirstEventFlag()`: Reset the first event flag
- `getDataLayerManager()`: Get the manager instance
- `cleanValue(value)`: Utility to format strings for the data layer

### DLManager Methods

- `DataLayer.home.view(customData?)`: Track home page view
- `DataLayer.plp.view(listName?, customData?)`: Track product listing view
- `DataLayer.pdp.view(productData, customData?)`: Track product detail view
- `DataLayer.cart.add(productData, quantity?, customData?)`: Track add to cart
- `DataLayer.checkout.step1(option?, customData?)`: Track checkout step
- `DataLayer.account.loginStart(customData?)`: Track user login
- `DataLayer.custom(eventName, eventData?)`: Track custom event

## Development

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine

### Setup

```bash
# Clone the repository
git clone https://github.com/JordanRobo/xp-datalayer-manager.git
cd xp-datalayer-manager

# Install dependencies
bun install

# Run tests
bun test

# Build the package
bun run build
```

## License

MIT

# XP Data Layer Manager

A multi-framework utility package for managing XP Data Layer events, with built-in support for React, Svelte, and Angular.

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
bun add xp-datalayer-manager
```

Using npm:

```bash
npm install xp-datalayer-manager
```

Using yarn:

```bash
yarn add xp-datalayer-manager
```

## Basic Setup

Include the Adobe Data Layer script in your HTML:

> For further instructions on this implementation visit [adobe-client-data-layer](https://github.com/adobe/adobe-client-data-layer)

```html
<script src="adobe-client-data-layer.min.js" async defer></script>
```

Then initialize the data layer in your application:

```javascript
import { initializeDataLayer } from 'xp-datalayer-manager';

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
// Import from the React-specific entry point
import {
  initializeDataLayer,
  useHomeView,
  useProductView,
  useEventTracker
} from 'xp-datalayer-manager/react';

// Initialize
initializeDataLayer();

// Home Page Component
function HomePage() {
  // Track home page view with a hook
  useHomeView();

  return <h1>Home Page</h1>;
}

// Product Page Component
function ProductPage({ product }) {
  // Track product view when product changes
  useProductView(product, {}, [product.id]);

  // Track event handler
  const trackAddToCart = useEventTracker(
    (product, quantity = 1) => DLManager.addToCart(product, quantity)
  );

  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={() => trackAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Svelte

```html
<script>
  import {
    initializeDataLayer,
    SvelteDLManager,
    trackClick,
    trackPageView
  } from 'xp-datalayer-manager/svelte';

  import { onMount } from 'svelte';

  onMount(() => {
    initializeDataLayer();
  });

  const product = { id: '123', name: 'Example Product', price: 99.99 };
</script>

<!-- Track page view with action directive -->
<div use:trackPageView={{ type: 'product', action: 'detail-view' }}>
  <h1>{product.name}</h1>

  <!-- Track click with action directive -->
  <button use:trackClick={() => SvelteDLManager.addToCart(product)}>
    Add to Cart
  </button>
</div>

<!-- Or trigger tracking manually -->
{SvelteDLManager.productView(product)}
```

### Angular

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { DLManagerModule } from 'xp-datalayer-manager/angular';

@NgModule({
  imports: [
    DLManagerModule
  ]
})
export class AppModule { }

// app.component.ts
import { Component, OnInit } from '@angular/core';
import {
  DLManagerService,
  initializeDataLayer
} from 'xp-datalayer-manager/angular';

@Component({
  selector: 'app-root',
  template: `
    <!-- Track with directive -->
    <div trackView="home">
      <h1>Home Page</h1>
    </div>

    <!-- Track product with directive -->
    <div *ngIf="product" [trackProduct]="product">
      <h1>{{ product.name }}</h1>
      <button (click)="addToCart()">Add to Cart</button>
    </div>
  `
})
export class AppComponent implements OnInit {
  product = { id: '123', name: 'Example Product', price: 99.99 };

  constructor(private dlManager: DLManagerService) {}

  ngOnInit() {
    initializeDataLayer();
  }

  addToCart() {
    this.dlManager.manager.addToCart(this.product);
  }
}
```

### Vanilla JavaScript

```javascript
import { initializeDataLayer, DLManager } from 'xp-datalayer-manager';

// Initialize
initializeDataLayer();

// Track home page
DLManager.homeView();

// Track product view
DLManager.productView({
  id: '123',
  name: 'Example Product',
  price: 99.99
});

// Add event listeners
document.querySelector('#add-to-cart').addEventListener('click', () => {
  DLManager.addToCart({
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

- `DLManager.homeView(customData?)`: Track home page view
- `DLManager.productListingView(listName?, customData?)`: Track product listing view
- `DLManager.productView(productData, customData?)`: Track product detail view
- `DLManager.addToCart(productData, quantity?, customData?)`: Track add to cart
- `DLManager.checkoutStep(step, option?, customData?)`: Track checkout step
- `DLManager.userLogin(method, customData?)`: Track user login
- `DLManager.pageView(pageType, action?, customData?)`: Track generic page view
- `DLManager.formSubmit(formName, formData?, customData?)`: Track form submission
- `DLManager.search(searchTerm, resultsCount, customData?)`: Track search
- `DLManager.custom(eventName, eventData?)`: Track custom event

### React Hooks

- `useHomeView(customData?, dependencies?)`: Track home page view
- `useProductListingView(listName?, customData?, dependencies?)`: Track product listing
- `useProductView(productData, customData?, dependencies?)`: Track product view
- `usePageView(pageType, action?, customData?, dependencies?)`: Track generic page view
- `useEventTracker(trackingFunction)`: Create a tracking event handler

### Svelte Utilities

- `SvelteDLManager.*`: Same methods as DLManager with Svelte integration
- `trackClick(callback)`: Svelte action for tracking clicks
- `trackPageView(params)`: Svelte action for tracking page views
- `trackFormSubmit(params)`: Svelte action for tracking form submissions
- `dataLayerEvents`: Svelte store with event history
- `currentPage`: Svelte store with current page info
- `currentProduct`: Svelte store with current product info

### Angular Utilities

- `DLManagerService`: Angular service for tracking
- `TrackViewDirective`: Angular directive for tracking page views (`trackView`)
- `TrackProductDirective`: Angular directive for tracking product views (`trackProduct`)
- `TrackEventDirective`: Angular directive for tracking events (`trackEvent`)

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

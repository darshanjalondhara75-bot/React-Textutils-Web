import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all components used in App.js
jest.mock('./components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Mock</div>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page Mock</div>;
  };
});

jest.mock('./pages/Classes', () => {
  return function MockClasses() {
    return <div data-testid="classes-page">Classes Page Mock</div>;
  };
});

jest.mock('./pages/Pricing', () => {
  return function MockPricing() {
    return <div data-testid="pricing-page">Pricing Page Mock</div>;
  };
});

jest.mock('./pages/Trainers', () => {
  return function MockTrainers() {
    return <div data-testid="trainers-page">Trainers Page Mock</div>;
  };
});

jest.mock('./pages/Contact', () => {
  return function MockContact() {
    return <div data-testid="contact-page">Contact Page Mock</div>;
  };
});

jest.mock('./pages/Portfolio', () => {
  return function MockPortfolio() {
    return <div data-testid="portfolio-page">Portfolio Page Mock</div>;
  };
});

jest.mock('./pages/Collections', () => {
  return function MockCollections() {
    return <div data-testid="collections-page">Collections Page Mock</div>;
  };
});

jest.mock('./pages/Product', () => {
  return function MockProduct() {
    return <div data-testid="product-page">Product Page Mock</div>;
  };
});

jest.mock('./pages/About', () => {
  return function MockAbout() {
    return <div data-testid="about-page">About Page Mock</div>;
  };
});

jest.mock('./pages/Cart', () => {
  return function MockCart() {
    return <div data-testid="cart-page">Cart Page Mock</div>;
  };
});

jest.mock('./pages/Checkout', () => {
  return function MockCheckout() {
    return <div data-testid="checkout-page">Checkout Page Mock</div>;
  };
});

describe('App Component Routing', () => {
  test('renders Navbar and Footer on all routes', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/IronPulse Gym/i)).toBeInTheDocument(); // Check for Footer content
  });

  test('renders Home component for "/" route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());
  });

  test('renders Classes component for "/classes" route', async () => {
    render(
      <MemoryRouter initialEntries={['/classes']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('classes-page')).toBeInTheDocument());
  });

  test('renders Pricing component for "/pricing" route', async () => {
    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('pricing-page')).toBeInTheDocument());
  });

  test('renders Trainers component for "/trainers" route', async () => {
    render(
      <MemoryRouter initialEntries={['/trainers']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('trainers-page')).toBeInTheDocument());
  });

  test('renders Contact component for "/contact" route', async () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('contact-page')).toBeInTheDocument());
  });

  test('renders Portfolio component for "/portfolio" route', async () => {
    render(
      <MemoryRouter initialEntries={['/portfolio']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('portfolio-page')).toBeInTheDocument());
  });

  test('renders Collections component for "/collections" route', async () => {
    render(
      <MemoryRouter initialEntries={['/collections']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('collections-page')).toBeInTheDocument());
  });

  test('renders Product component for "/product/:id" route', async () => {
    render(
      <MemoryRouter initialEntries={['/product/123']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('product-page')).toBeInTheDocument());
  });

  test('renders About component for "/about" route', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('about-page')).toBeInTheDocument());
  });

  test('renders Cart component for "/cart" route', async () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('cart-page')).toBeInTheDocument());
  });

  test('renders Checkout component for "/checkout" route', async () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('checkout-page')).toBeInTheDocument());
  });

  test('renders loading fallback for lazy-loaded components', async () => {
    render(
      <MemoryRouter initialEntries={['/classes']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('classes-page')).toBeInTheDocument());
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { PRODUCTS } from '../data/products';

const noop = () => {};

describe('QuickViewModal', () => {
  it('opens after initially rendering with no product', () => {
    const { rerender } = render(
      <BrowserRouter>
        <QuickViewModal product={null} onClose={noop} />
      </BrowserRouter>
    );

    rerender(
      <BrowserRouter>
        <QuickViewModal product={PRODUCTS[0]} onClose={noop} />
      </BrowserRouter>
    );

    expect(screen.getByText(PRODUCTS[0].name)).toBeInTheDocument();
  });

  it('resets state when switching to a different product', () => {
    const { rerender } = render(
      <BrowserRouter>
        <QuickViewModal product={PRODUCTS[0]} onClose={noop} />
      </BrowserRouter>
    );

    rerender(
      <BrowserRouter>
        <QuickViewModal product={PRODUCTS[1]} onClose={noop} />
      </BrowserRouter>
    );

    expect(screen.getByText(PRODUCTS[1].name)).toBeInTheDocument();
  });
});

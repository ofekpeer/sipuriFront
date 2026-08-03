import { act, fireEvent, render } from '@testing-library/react';

import { useCart } from '../../context/CartContext';
import Cart from './Cart';

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../services/cartApi', () => ({
  createCartCheckoutRequest: jest.fn(),
}));

jest.mock('../../services/bookApi', () => ({
  getBookAssetUrl: (url) => url,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

const PRODUCTS = [
  {
    id: 'digital',
    label: 'ספר דיגיטלי',
    shortLabel: 'דיגיטלי',
    amountAgorot: 4_900,
    includesPhysicalBook: false,
  },
  {
    id: 'digital_physical',
    label: 'ספר דיגיטלי + ספר פיזי',
    shortLabel: 'דיגיטלי + פיזי',
    amountAgorot: 12_900,
    includesPhysicalBook: true,
  },
];

function deferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

test('shows a package selection immediately while the server update is pending', async () => {
  const request = deferredPromise();
  const updateBookProduct = jest.fn(() => request.promise);

  useCart.mockReturnValue({
    items: [{
      id: 'book:book-1',
      type: 'book',
      bookId: 'book-1',
      title: 'הספר שלי',
      childName: 'נועה',
      imageUrl: '',
      productType: 'digital',
      productLabel: 'ספר דיגיטלי',
      includesPhysicalBook: false,
      unitPriceAgorot: 4_900,
    }],
    products: PRODUCTS,
    summary: {
      itemCount: 1,
      subtotalAgorot: 4_900,
      checkoutConfigured: true,
      hasPhysicalItems: false,
    },
    loading: false,
    error: '',
    updatingBookId: '',
    removeBook: jest.fn(),
    emptyCart: jest.fn(),
    refreshCart: jest.fn(),
    updateBookProduct,
  });

  const { container } = render(<Cart />);

  const physicalOption = container.querySelector('input[value="digital_physical"]');
  fireEvent.click(physicalOption);

  expect(physicalOption.checked).toBe(true);
  expect(container.querySelector('input[name="street"]')).not.toBeNull();
  expect(updateBookProduct).toHaveBeenCalledWith('book-1', 'digital_physical');

  await act(async () => request.resolve());
});

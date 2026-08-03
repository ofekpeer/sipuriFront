import { fireEvent, render, waitFor } from '@testing-library/react';

import {
  getBookRequest,
  getPaymentConfigurationRequest,
} from '../../services/bookApi';
import BookCheckout from './BookCheckout';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useParams: () => ({ id: 'book-1' }),
}));

jest.mock('../../components/navbar/Navbar', () => () => <nav />);

jest.mock('../../services/bookApi', () => ({
  createBookCheckoutRequest: jest.fn(),
  getBookAssetUrl: (url) => url,
  getBookRequest: jest.fn(),
  getPaymentConfigurationRequest: jest.fn(),
}));

const PRODUCTS = [
  {
    id: 'digital',
    label: 'ספר דיגיטלי',
    amountAgorot: 4_900,
    includesPhysicalBook: false,
  },
  {
    id: 'digital_physical',
    label: 'ספר דיגיטלי + ספר פיזי',
    amountAgorot: 12_900,
    includesPhysicalBook: true,
  },
];

test('switches between digital and physical purchase options and asks for shipping only when needed', async () => {
  getBookRequest.mockResolvedValue({
    data: {
      _id: 'book-1',
      title: 'הספר שלי',
      child: { name: 'נועה' },
      cover: { imageUrl: '/cover.jpg' },
    },
  });
  getPaymentConfigurationRequest.mockResolvedValue({
    data: { configured: true, products: PRODUCTS },
  });

  const { container } = render(<BookCheckout />);
  await waitFor(() => {
    expect(container.querySelector('input[value="digital"]')).not.toBeNull();
  });

  const digitalOption = container.querySelector('input[value="digital"]');
  const physicalOption = container.querySelector('input[value="digital_physical"]');
  expect(digitalOption.checked).toBe(true);
  expect(container.querySelector('input[name="street"]')).toBeNull();

  fireEvent.click(physicalOption);
  expect(physicalOption.checked).toBe(true);
  expect(container.querySelector('input[name="street"]')).not.toBeNull();

  fireEvent.click(digitalOption);
  expect(digitalOption.checked).toBe(true);
  expect(container.querySelector('input[name="street"]')).toBeNull();
});

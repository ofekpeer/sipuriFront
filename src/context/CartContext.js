import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addBookToCartRequest,
  clearCartRequest,
  getCartRequest,
  removeBookFromCartRequest,
  updateBookInCartRequest,
} from '../services/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const EMPTY_CART = {
  items: [],
  products: [
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
  ],
  summary: {
    itemCount: 0,
    subtotalAgorot: 0,
    currency: 'ILS',
    pricingConfigured: false,
    checkoutConfigured: false,
    hasPhysicalItems: false,
  },
};

function normalizeCart(nextCart) {
  if (!nextCart) return EMPTY_CART;

  return {
    ...EMPTY_CART,
    ...nextCart,
    items: Array.isArray(nextCart.items) ? nextCart.items : [],
    products: Array.isArray(nextCart.products) && nextCart.products.length
      ? nextCart.products
      : EMPTY_CART.products,
    summary: {
      ...EMPTY_CART.summary,
      ...(nextCart.summary || {}),
    },
  };
}

export function CartProvider({ children }) {
  const { user, token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingBookId, setUpdatingBookId] = useState('');

  const refreshCart = useCallback(async ({ silent = false } = {}) => {
    if (!user || !token) {
      setCart(EMPTY_CART);
      setError('');
      return EMPTY_CART;
    }

    if (!silent) setLoading(true);

    try {
      const response = await getCartRequest();
      const normalizedCart = normalizeCart(response.data);
      setCart(normalizedCart);
      setError('');
      return normalizedCart;
    } catch (requestError) {
      if (!silent) setError(requestError.message || 'לא הצלחנו לטעון את העגלה.');
      throw requestError;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (authLoading) return undefined;

    let active = true;
    if (!user || !token) {
      setCart(EMPTY_CART);
      setError('');
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    getCartRequest()
      .then((response) => {
        if (!active) return;
        setCart(normalizeCart(response.data));
        setError('');
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || 'לא הצלחנו לטעון את העגלה.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, token, user]);

  const addBook = useCallback(async (bookId, productType = 'digital') => {
    setUpdatingBookId(String(bookId));
    setError('');
    try {
      const response = await addBookToCartRequest(bookId, productType);
      setCart(normalizeCart(response.data));
      return response.data;
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להוסיף את הספר לעגלה.');
      throw requestError;
    } finally {
      setUpdatingBookId('');
    }
  }, []);

  const updateBookProduct = useCallback(async (bookId, productType) => {
    setUpdatingBookId(String(bookId));
    setError('');
    try {
      const response = await updateBookInCartRequest(bookId, productType);
      setCart(normalizeCart(response.data));
      return response.data;
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו לעדכן את חבילת הספר בעגלה.');
      throw requestError;
    } finally {
      setUpdatingBookId('');
    }
  }, []);

  const removeBook = useCallback(async (bookId) => {
    setUpdatingBookId(String(bookId));
    setError('');
    try {
      const response = await removeBookFromCartRequest(bookId);
      setCart(normalizeCart(response.data));
      return response.data;
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להסיר את הספר מהעגלה.');
      throw requestError;
    } finally {
      setUpdatingBookId('');
    }
  }, []);

  const emptyCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await clearCartRequest();
      setCart(normalizeCart(response.data));
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו לרוקן את העגלה.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const bookIds = useMemo(
    () => new Set(cart.items.map((item) => String(item.bookId))),
    [cart.items],
  );

  const value = useMemo(() => ({
    ...cart,
    loading,
    error,
    updatingBookId,
    addBook,
    updateBookProduct,
    removeBook,
    emptyCart,
    refreshCart,
    containsBook: (bookId) => bookIds.has(String(bookId)),
  }), [
    addBook,
    bookIds,
    cart,
    emptyCart,
    error,
    loading,
    refreshCart,
    removeBook,
    updatingBookId,
    updateBookProduct,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

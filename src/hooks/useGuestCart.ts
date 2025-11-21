import { useState, useEffect } from 'react';

export interface GuestCartItem {
  productId: string;
  sellerId: string;
  quantity: number;
}

const GUEST_CART_KEY = 'guest_cart';

export const useGuestCart = () => {
  const [items, setItems] = useState<GuestCartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing guest cart:', e);
        localStorage.removeItem(GUEST_CART_KEY);
      }
    }
  }, []);

  const saveToStorage = (newItems: GuestCartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addToGuestCart = (item: Omit<GuestCartItem, 'quantity'> & { quantity?: number }) => {
    const existingItemIndex = items.findIndex(
      i => i.productId === item.productId && i.sellerId === item.sellerId
    );

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity || 1;
      saveToStorage(newItems);
    } else {
      const newItems = [...items, { ...item, quantity: item.quantity || 1 }];
      saveToStorage(newItems);
    }
  };

  const updateGuestQuantity = (productId: string, sellerId: string, quantity: number) => {
    const newItems = items.map(item =>
      item.productId === productId && item.sellerId === sellerId
        ? { ...item, quantity }
        : item
    );
    saveToStorage(newItems);
  };

  const removeFromGuestCart = (productId: string, sellerId: string) => {
    const newItems = items.filter(
      item => !(item.productId === productId && item.sellerId === sellerId)
    );
    saveToStorage(newItems);
  };

  const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
    setItems([]);
  };

  const getGuestCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    items,
    addToGuestCart,
    updateGuestQuantity,
    removeFromGuestCart,
    clearGuestCart,
    getGuestCartCount,
  };
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';

export interface CartAttribute {
  key: string;
  value: string;
}

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  customAttributes: CartAttribute[];
}

// Two lines are the "same line" (and should merge quantity instead of
// creating a new one) only if they share a variant AND the same custom
// attributes (e.g. Cut Style) — different cut styles of the same fish are
// distinct cart lines.
const sameLine = (a: Pick<CartItem, 'variantId' | 'customAttributes'>, b: Pick<CartItem, 'variantId' | 'customAttributes'>) =>
  a.variantId === b.variantId &&
  JSON.stringify(a.customAttributes ?? []) === JSON.stringify(b.customAttributes ?? []);

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  deliveryDate: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  setDeliveryDate: (date: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl
        lines(first: 100) { edges { node { id attributes { key value } merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id attributes { key value } merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_ATTRIBUTES_UPDATE_MUTATION = `
  mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

async function createShopifyCart(item: CartItem, deliveryDate: string | null): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: {
      lines: [{ quantity: item.quantity, merchandiseId: item.variantId, attributes: item.customAttributes }],
      attributes: deliveryDate ? [{ key: 'Requested Delivery Date', value: deliveryDate }] : [],
    },
  });
  if (data?.data?.cartCreate?.userErrors?.length > 0) return null;
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

async function addLineToShopifyCart(cartId: string, item: CartItem): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId, lines: [{ quantity: item.quantity, merchandiseId: item.variantId, attributes: item.customAttributes }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l: { node: { id: string; attributes: CartAttribute[]; merchandise: { id: string } } }) =>
    l.node.merchandise.id === item.variantId &&
    JSON.stringify(l.node.attributes ?? []) === JSON.stringify(item.customAttributes ?? [])
  );
  return { success: true, lineId: newLine?.node?.id };
}

async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, { cartId, lines: [{ id: lineId, quantity }] });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

async function updateShopifyCartAttributes(cartId: string, date: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_ATTRIBUTES_UPDATE_MUTATION, {
    cartId,
    attributes: [{ key: 'Requested Delivery Date', value: date }],
  });
  const userErrors = data?.data?.cartAttributesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      deliveryDate: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, deliveryDate, clearCart } = get();
        const existingItem = items.find(i => sameLine(i, item));
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null }, deliveryDate);
            if (result) {
              set({ cartId: result.cartId, checkoutUrl: result.checkoutUrl, items: [{ ...item, lineId: result.lineId }] });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              set({ items: get().items.map(i => i.lineId === existingItem.lineId ? { ...i, quantity: newQuantity } : i) });
            } else if (result.cartNotFound) clearCart();
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              set({ items: [...get().items, { ...item, lineId: result.lineId ?? null }] });
            } else if (result.cartNotFound) clearCart();
          }
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId, quantity) => {
        if (quantity <= 0) { await get().removeItem(lineId); return; }
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.lineId === lineId);
        if (!item || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, lineId, quantity);
          if (result.success) {
            set({ items: get().items.map(i => i.lineId === lineId ? { ...i, quantity } : i) });
          } else if (result.cartNotFound) clearCart();
        } catch (error) {
          console.error('Failed to update quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.lineId === lineId);
        if (!item || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, lineId);
          if (result.success) {
            const newItems = get().items.filter(i => i.lineId !== lineId);
            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) clearCart();
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setDeliveryDate: async (date) => {
        const { cartId, clearCart } = get();
        set({ deliveryDate: date });
        if (!cartId) return; // no cart yet — will be applied when the cart is created
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartAttributes(cartId, date);
          if (result.cartNotFound) clearCart();
        } catch (error) {
          console.error('Failed to set delivery date:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl, deliveryDate: state.deliveryDate }),
    }
  )
);

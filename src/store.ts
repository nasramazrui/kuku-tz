import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variations?: any;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
    logout: () => {
      auth.signOut();
      set({ user: null });
    },
  })
);

// Initialize auth listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

interface AppState {
  branch: any | null;
  setBranch: (branch: any) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      branch: null,
      setBranch: (branch) => set({ branch }),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'app-settings' }
  )
);

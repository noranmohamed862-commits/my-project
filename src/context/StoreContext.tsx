import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
  };
  status: "Processing" | "Shipped" | "Delivered";
}

interface StoreCtx {
  products: Product[];
  loading: boolean;
  error: string | null;
  wishlist: number[];
  cart: CartItem[];
  orders: Order[];
  searchQuery: string;
  setSearch: (q: string) => void;
  toggleWish: (id: number) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  placeOrder: (shipping: Order["shipping"]) => string;
  cartTotal: number;
  cartCount: number;
  wishCount: number;
  filtered: Product[];
  visibleCount: number;
  loadMore: () => void;
  hasMore: boolean;
  activeCategory: string;
  setCategory: (cat: string) => void;
  categoryProducts: Product[];
}

const StoreContext = createContext<StoreCtx | null>(null);

const wishKey = (e: string) => `newran_wish_${e}`;
const cartKey = (e: string) => `newran_cart_${e}`;
const ordersKey = (e: string) => `newran_orders_${e}`;

const PAGE_SIZE = 8;

export function StoreProvider({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCategory, setActiveCategory] = useState("");


  useEffect(() => {
    if (!userEmail) return;
    setWishlist(JSON.parse(localStorage.getItem(wishKey(userEmail)) || "[]"));
    setCart(JSON.parse(localStorage.getItem(cartKey(userEmail)) || "[]"));
    setOrders(JSON.parse(localStorage.getItem(ordersKey(userEmail)) || "[]"));
  }, [userEmail]);


  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (userEmail)
      localStorage.setItem(wishKey(userEmail), JSON.stringify(wishlist));
  }, [wishlist, userEmail]);
  useEffect(() => {
    if (userEmail)
      localStorage.setItem(cartKey(userEmail), JSON.stringify(cart));
  }, [cart, userEmail]);
  useEffect(() => {
    if (userEmail)
      localStorage.setItem(ordersKey(userEmail), JSON.stringify(orders));
  }, [orders, userEmail]);

  const toggleWish = (id: number) =>
    setWishlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
    );
  const addToCart = (p: Product) =>
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      return ex
        ? c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { ...p, qty: 1 }];
    });
  const removeFromCart = (id: number) =>
    setCart((c) => c.filter((x) => x.id !== id));
  const updateQty = (id: number, qty: number) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((x) => x.id !== id)
        : c.map((x) => (x.id === id ? { ...x, qty } : x)),
    );
  const clearCart = () => setCart([]);


  const placeOrder = (shipping: Order["shipping"]): string => {
    const orderId = `NWR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      items: [...cart],
      total: total + (total > 200 ? 0 : 12.99) + total * 0.08,
      shipping,
      status: "Processing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return orderId;
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishCount = wishlist.length;

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categoryProducts = activeCategory
    ? products.filter((p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase()),
      )
    : products;

  const hasMore = visibleCount < products.length;
  const loadMore = () =>
    setVisibleCount((n) => Math.min(n + PAGE_SIZE, products.length));
  const setCategory = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
    setSearchQuery("");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        error,
        wishlist,
        cart,
        orders,
        searchQuery,
        setSearch: setSearchQuery,
        toggleWish,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        placeOrder,
        cartTotal,
        cartCount,
        wishCount,
        filtered,
        visibleCount,
        loadMore,
        hasMore,
        activeCategory,
        setCategory,
        categoryProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

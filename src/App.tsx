import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  RadialBarChart, 
  RadialBar,
  Legend
} from 'recharts';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  User, 
  MapPin, 
  Search, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  Settings,
  LogOut,
  Home,
  MessageCircle,
  Clock,
  CreditCard,
  CheckCircle2,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  PlusCircle,
  Save,
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
  MinusCircle,
  PlusSquare,
  MinusSquare,
  CreditCard as CreditCardIcon,
  Smartphone,
  Wallet,
  Coins,
  Receipt,
  Users,
  FileText,
  Bell,
  MessageSquare,
  Ticket,
  Percent,
  Monitor,
  Tv,
  Calendar,
  Layers,
  Table
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useCartStore, useAppStore, useAuthStore } from './store';
import { auth } from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const { branch } = useAppStore();
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
          FoodAppi
        </Link>

        <div className="flex items-center gap-2 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Branch</span>
            <button className="flex items-center gap-1 text-xs font-bold text-gray-700">
              {branch?.name || 'Main Branch'}
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Menu', path: '/menu' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', isCart: true },
    { icon: MessageCircle, label: 'Offers', path: '/offers' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-safe">
      <div className="max-w-7xl mx-auto flex items-center justify-around h-16 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCart) {
            return (
              <Link 
                key={item.path}
                to={item.path}
                className="relative -top-6"
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 border-4 border-white">
                  <Icon className="w-6 h-6 text-white" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-emerald-500" : "text-gray-400"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <h3 className="text-white text-xl font-bold mb-4">FoodAppi</h3>
        <p className="text-sm leading-relaxed">
          The best food delivery system in Tanzania. Order your favorite meals with just a few clicks.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-emerald-400">Contact Us</Link></li>
          <li><Link to="/terms" className="hover:text-emerald-400">Terms & Conditions</Link></li>
          <li><Link to="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Support</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/faq" className="hover:text-emerald-400">FAQ</Link></li>
          <li><Link to="/help" className="hover:text-emerald-400">Help Center</Link></li>
          <li><Link to="/feedback" className="hover:text-emerald-400">Feedback</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Newsletter</h4>
        <p className="text-xs mb-4">Subscribe to get latest offers and updates.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Email" className="bg-gray-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-500" />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Join</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs">
      <p>&copy; 2024 FoodAppi. All rights reserved.</p>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/items?featured=true').then(res => res.json()).then(setFeaturedItems);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none focus:ring-0 text-sm"
          />
        </div>
      </div>

      {/* Promo Slider */}
      <div className="px-4 py-4">
        <div className="relative h-44 rounded-3xl overflow-hidden shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
            className="w-full h-full object-cover"
            alt="Promo"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-transparent flex flex-col justify-center p-6">
            <span className="text-white text-xs font-bold uppercase tracking-widest mb-1">Super Sale</span>
            <h2 className="text-white text-2xl font-black mb-2 leading-tight">VEGAN BURGER <br /> <span className="text-amber-300">20% OFF</span></h2>
            <button className="bg-white text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full w-fit uppercase">Order Now</button>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Slider */}
      <section className="py-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-800">Our Menu</h2>
          <Link to="/menu" className="text-emerald-500 text-xs font-bold px-4 py-1.5 bg-emerald-50 rounded-full">View All</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/menu?category=${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-emerald-100 transition-all text-center w-24"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-sm">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Items */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-black text-gray-800 mb-6">New Items</h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredItems.map((item) => (
            <motion.div 
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-gray-400">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-tight">Our CHICK and CRISP is loaded with chopped lettuce...</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      addItem({ ...item, quantity: 1 });
                      toast.success(`Added ${item.name}`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const FloatingCart = () => {
  const total = useCartStore((state) => state.total());
  const items = useCartStore((state) => state.items);
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 z-50 bg-pink-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold md:hidden"
    >
      <ShoppingBag className="w-6 h-6" />
      <span>${total.toFixed(2)}</span>
    </motion.button>
  );
};

const ItemOptionsModal = ({ item, isOpen, onClose, onAdd }: { item: any, isOpen: boolean, onClose: () => void, onAdd: (item: any) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  const [instructions, setInstructions] = useState('');

  const options = item.options ? JSON.parse(item.options) : {};
  const sizes = options.sizes || [];
  const extras = options.extras || [];
  const addons = options.addons || [];

  useEffect(() => {
    if (sizes.length > 0) setSelectedSize(sizes[0]);
  }, [item]);

  const calculateTotal = () => {
    let total = item.price;
    if (selectedSize) total += selectedSize.price;
    selectedExtras.forEach(e => total += e.price);
    selectedAddons.forEach(a => total += a.price);
    return total * quantity;
  };

  const handleAdd = () => {
    onAdd({
      ...item,
      quantity,
      price: item.price + (selectedSize?.price || 0) + selectedExtras.reduce((acc, e) => acc + e.price, 0) + selectedAddons.reduce((acc, a) => acc + a.price, 0),
      selectedOptions: {
        size: selectedSize,
        extras: selectedExtras,
        addons: selectedAddons,
        instructions
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-black text-gray-900">Customize Item</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8 flex-1">
              <div className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-lg font-black text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                  <span className="text-emerald-600 font-black text-lg">${item.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="font-bold text-gray-700">Quantity</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-emerald-500 transition-colors border border-gray-100">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-gray-900 w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-emerald-500 transition-colors border border-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Meal Size</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size: any) => (
                      <button 
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "p-3 rounded-2xl border-2 transition-all text-center",
                          selectedSize?.name === size.name ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn("w-4 h-4 rounded-full border-2 mx-auto mb-2 flex items-center justify-center", selectedSize?.name === size.name ? "border-emerald-500" : "border-gray-300")}>
                          {selectedSize?.name === size.name && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <span className="block text-[10px] font-black text-gray-900">{size.name}</span>
                        <span className="block text-[10px] text-gray-400">+{size.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {extras.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Extras</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {extras.map((extra: any) => (
                      <button 
                        key={extra.name}
                        onClick={() => {
                          if (selectedExtras.find(e => e.name === extra.name)) {
                            setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
                          } else {
                            setSelectedExtras([...selectedExtras, extra]);
                          }
                        }}
                        className={cn(
                          "p-3 rounded-2xl border-2 transition-all flex items-center gap-3",
                          selectedExtras.find(e => e.name === extra.name) ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn("w-5 h-5 rounded-lg border-2 flex items-center justify-center", selectedExtras.find(e => e.name === extra.name) ? "border-emerald-500 bg-emerald-500" : "border-gray-300")}>
                          {selectedExtras.find(e => e.name === extra.name) && <Plus className="w-3 h-3 text-white" />}
                        </div>
                        <div className="text-left">
                          <span className="block text-[10px] font-black text-gray-900">{extra.name}</span>
                          <span className="block text-[10px] text-gray-400">+{extra.price.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {addons.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Addons</h5>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
                    {addons.map((addon: any) => (
                      <div key={addon.name} className="flex-shrink-0 w-40 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
                        <img src={addon.image || 'https://picsum.photos/seed/addon/200/200'} className="w-full h-24 object-cover rounded-xl mb-2" referrerPolicy="no-referrer" />
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-[10px] font-black text-gray-900">{addon.name}</span>
                            <span className="block text-[10px] text-gray-400">${addon.price.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => {
                              if (selectedAddons.find(a => a.name === addon.name)) {
                                setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
                              } else {
                                setSelectedAddons([...selectedAddons, addon]);
                              }
                            }}
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              selectedAddons.find(a => a.name === addon.name) ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"
                            )}
                          >
                            {selectedAddons.find(a => a.name === addon.name) ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-3">
                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Special instructions</h5>
                <textarea 
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Add note (extra mayo, cheese, etc.)"
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
              <button 
                onClick={handleAdd}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/30 flex items-center justify-between px-6 hover:bg-emerald-600 transition-all"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </div>
                <span>${calculateTotal().toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MenuPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/items').then(res => res.json()).then(setItems);
  }, []);

  const filteredItems = items.filter(i => {
    const catMatch = selectedCategory ? i.category_id === selectedCategory : true;
    const vegMatch = filter === 'all' ? true : filter === 'veg' ? i.is_veg === 1 : i.is_veg === 0;
    return catMatch && vegMatch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 pb-24">
      {/* Category Horizontal Slider */}
      <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar -mx-4 px-4">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
            selectedCategory === null ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-gray-50"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Utensils className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">All</span>
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
              selectedCategory === cat.id ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-gray-50"
            )}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Veg/Non-Veg Filters */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setFilter(filter === 'non-veg' ? 'all' : 'non-veg')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all border shadow-sm",
            filter === 'non-veg' ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-100"
          )}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" className="w-4 h-4" alt="Non-Veg" />
          Non-Veg
        </button>
        <button 
          onClick={() => setFilter(filter === 'veg' ? 'all' : 'veg')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all border shadow-sm",
            filter === 'veg' ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-100"
          )}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" className="w-4 h-4" alt="Veg" />
          Veg
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-emerald-600">
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Items'}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all relative group flex flex-col">
            <div className="relative h-32 md:h-40 rounded-2xl overflow-hidden mb-3">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{item.name}</h3>
            <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-tight">{item.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-extrabold text-gray-900 text-sm">${item.price.toFixed(2)}</span>
              <button 
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemOptionsModal 
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={(item) => {
            addItem(item);
            toast.success('Added to cart');
          }}
        />
      )}
    </div>
  );
};

const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 pb-24">
      <h1 className="text-2xl font-black text-center text-gray-800 mb-8">My Cart</h1>
      
      {/* Delivery/Takeaway Toggle */}
      <div className="flex bg-emerald-50 p-1 rounded-full mb-8">
        <button 
          onClick={() => setOrderType('delivery')}
          className={cn(
            "flex-1 py-3 rounded-full text-xs font-black transition-all",
            orderType === 'delivery' ? "bg-emerald-500 text-white shadow-md" : "text-emerald-500"
          )}
        >
          Delivery
        </button>
        <button 
          onClick={() => setOrderType('takeaway')}
          className={cn(
            "flex-1 py-3 rounded-full text-xs font-black transition-all",
            orderType === 'takeaway' ? "bg-emerald-500 text-white shadow-md" : "text-emerald-500"
          )}
        >
          Takeaway
        </button>
      </div>

      <div className="space-y-6 mb-12">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-2">Size: Medium Meal</p>
              <p className="text-emerald-500 font-black text-sm">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                className="p-1.5 bg-gray-50 text-red-500 rounded-full border border-gray-100"
              >
                {item.quantity > 1 ? <Minus className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 bg-gray-50 text-emerald-500 rounded-full border border-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Frequently Bought Together */}
      <section className="mb-12">
        <h3 className="text-sm font-black text-gray-800 mb-4">Frequently Bought Together</h3>
        <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
          {[1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 bg-white p-3 rounded-3xl border border-gray-100 flex items-center gap-3">
              <img src="https://picsum.photos/seed/extra/100/100" className="w-16 h-16 rounded-2xl object-cover" alt="Extra" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Pepsi (Cane)</h4>
                <p className="text-emerald-500 font-black text-xs">$1.00</p>
              </div>
              <button className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-400">Subtotal</span>
          <span className="text-lg font-black text-emerald-500">${total().toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/checkout')}
        className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

const CheckoutPage = () => {
  const { items, total, clearCart } = useCartStore();
  const { branch } = useAppStore();
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    orderType: 'delivery',
    branchId: branch?.id || ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to checkout');
      navigate('/login');
    } else if (user) {
      fetch(`/api/user/profile/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData(prev => ({
            ...prev,
            name: user.displayName || data.name || '',
            phone: data.phone || ''
          }));
        });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetch('/api/branches').then(res => res.json()).then(setBranches);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: formData.name,
        customer_phone: formData.phone,
        branch_id: formData.branchId,
        total_amount: total(),
        order_type: formData.orderType,
        items: items
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      toast.success('Order placed successfully!');
      
      // WhatsApp Integration
      const message = `*Order - FoodAppi - PWA Online Food Ordering System*\n` +
        `*****************************************\n` +
        `Order ID#: ${data.orderId}\n` +
        `Order Type: ${formData.orderType.toUpperCase()}\n` +
        `Delivery Time: ${new Date().toLocaleString()}\n` +
        `*****************************************\n` +
        `Order Details\n` +
        `*****************************************\n` +
        items.map((i, idx) => `${idx + 1}) ${i.name}\n   Price: $${i.price.toFixed(2)}\n   Quantity: ${i.quantity}\n   Total: $${(i.price * i.quantity).toFixed(2)}`).join('\n\n') +
        `\n*****************************************\n` +
        `Total: $${total().toFixed(2)}`;
      
      const whatsappUrl = `https://wa.me/255687225353?text=${encodeURIComponent(message)}`;
      
      clearCart();
      window.open(whatsappUrl, '_blank');
      navigate('/order-success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-24">
      <h1 className="text-2xl font-black text-center text-gray-800 mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cart Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-center text-gray-400 uppercase tracking-widest mb-6">Cart Summary</h3>
          
          <div className="flex bg-emerald-50 p-1 rounded-full mb-6 max-w-[200px] mx-auto">
            <button 
              type="button"
              onClick={() => setFormData({...formData, orderType: 'delivery'})}
              className={cn(
                "flex-1 py-2 rounded-full text-[10px] font-black transition-all",
                formData.orderType === 'delivery' ? "bg-emerald-500 text-white shadow-md" : "text-emerald-500"
              )}
            >
              Delivery
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, orderType: 'takeaway'})}
              className={cn(
                "flex-1 py-2 rounded-full text-[10px] font-black transition-all",
                formData.orderType === 'takeaway' ? "bg-emerald-500 text-white shadow-md" : "text-emerald-500"
              )}
            >
              Takeaway
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-900 text-white text-[10px] font-black flex items-center justify-center rounded-full flex-shrink-0">
                  {idx + 1}
                </div>
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                  <p className="text-[10px] text-gray-400">Size: Medium Meal</p>
                </div>
                <span className="text-xs font-black text-gray-900">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Subtotal</span>
              <span className="text-gray-900 font-black">${total().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Discount</span>
              <span className="text-gray-900 font-black">$0.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Delivery Charge</span>
              <span className="text-emerald-500 font-black">$0.25</span>
            </div>
            <div className="flex justify-between text-lg pt-2">
              <span className="text-gray-900 font-black">Total</span>
              <span className="text-emerald-500 font-black">${(total() + 0.25).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800">Delivery Information</h3>
          <div className="space-y-4">
            <input 
              required
              type="text" 
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm" 
            />
            <input 
              required
              type="tel" 
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm" 
            />
            <textarea 
              required
              placeholder="Delivery Address"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm h-24" 
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          Proceed to WhatsApp
        </button>
      </form>
    </div>
  );
};

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Lookup email by identifier (name, email, or phone)
      const lookupRes = await fetch('/api/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      let email = identifier;
      if (lookupRes.ok) {
        const data = await lookupRes.json();
        email = data.email;
      } else if (!identifier.includes('@')) {
        throw new Error('User not found with this identifier. Please use Email, Phone or Name.');
      }

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      if (user.email === 'amytzee@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Login with Name, Email or Phone</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Name, Email or Phone</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type="text" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Name, Email or Phone"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={() => {
                if (!identifier.includes('@')) return toast.error('Please enter your email to reset password');
                sendPasswordResetEmail(auth, identifier);
                toast.success('Password reset email sent!');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Firebase User
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      // 2. Register metadata in backend
      await fetch('/api/auth/register-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name,
          email,
          phone,
          whatsapp: whatsapp || null
        })
      });

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join FoodAppi and start ordering</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0687225353"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">WhatsApp Number (Optional)</label>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="tel" 
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="0687225353"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Login Now</Link>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, logout, loading } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetch(`/api/user/profile/${user.uid}`)
        .then(res => res.json())
        .then(setProfile);
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold mb-4">
            {user.displayName?.[0] || user.email?.[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {profile && (
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Phone</p>
              <p className="text-sm font-bold text-gray-900">{profile.phone}</p>
            </div>
            {profile.whatsapp && (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">WhatsApp</p>
                <p className="text-sm font-bold text-gray-900">{profile.whatsapp}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {user.email === 'amytzee@gmail.com' && (
            <Link to="/admin" className="flex items-center justify-center gap-3 w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl font-bold hover:bg-emerald-100 transition-all">
              <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
            </Link>
          )}
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold hover:bg-red-100 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderSuccessPage = () => (
  <div className="max-w-7xl mx-auto py-24 px-4 text-center">
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
    </motion.div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">Your order has been received and is being prepared. You can track your order in the "My Orders" section.</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/orders" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
        Track Order
      </Link>
      <Link to="/" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
        Back to Home
      </Link>
    </div>
  </div>
);

const InvoiceModal = ({ order, isOpen, onClose }: { order: any, isOpen: boolean, onClose: () => void }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 print:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col print:shadow-none print:rounded-none print:max-w-none"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
              <h3 className="font-black text-gray-900">Order Invoice</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-white" id="printable-invoice">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">FoodAppi</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Main Branch, Dar es Salaam</p>
                <p className="text-[10px] text-gray-500 font-bold">Tel: +255 687 225 353</p>
                <p className="text-[10px] text-gray-500 font-bold">Opening Hours: 12pm to 10pm</p>
              </div>

              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 border-y border-dashed border-gray-200 py-3">
                <div>
                  <p>Order #{order.id || order.orderId}</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p>{new Date().toLocaleTimeString()}</p>
                  <p>Token #{order.token_no}</p>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                    <th className="text-left pb-2">Qty</th>
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Price</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-700">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-3 align-top">{item.quantity}</td>
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{item.name || item.item_name}</p>
                        {item.selectedOptions && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            {item.selectedOptions.size && <p>Size: {item.selectedOptions.size.name}</p>}
                            {item.selectedOptions.extras?.length > 0 && <p>Extras: {item.selectedOptions.extras.map((e: any) => e.name).join(', ')}</p>}
                            {item.selectedOptions.addons?.length > 0 && <p>Addons: {item.selectedOptions.addons.map((a: any) => a.name).join(', ')}</p>}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right align-top">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 border-t border-dashed border-gray-200 pt-4 mb-8">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-400 uppercase">Sub Total</span>
                  <span className="font-black text-gray-900">${(order.subtotal || order.total_amount).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-400 uppercase">Discount</span>
                    <span className="font-black text-red-500">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-400 uppercase">VAT (0%)</span>
                  <span className="font-black text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                  <span className="font-black text-gray-900 uppercase">Total</span>
                  <span className="font-black text-emerald-600">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-block px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-black mb-4">
                  Token #{order.token_no}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thank You</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Please Come Again</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const POSPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posCart, setPosCart] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery' | 'dine-in'>('takeaway');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mfs' | 'other'>('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', password: 'password123' });
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const { branch } = useAppStore();

  const fetchData = async () => {
    const [catsRes, itemsRes, ordersRes, tablesRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/items'),
      fetch('/api/admin/orders'),
      fetch(`/api/dining-tables/branch/${branch?.id || 1}`)
    ]);
    
    setCategories(await catsRes.json());
    setItems(await itemsRes.json());
    const ordersData = await ordersRes.json();
    
    // Extract unique customers from orders
    const uniqueCustomers = Array.from(new Set(ordersData.map((o: any) => o.customer_phone)))
      .map(phone => ordersData.find((o: any) => o.customer_phone === phone))
      .filter(Boolean);
    setCustomers(uniqueCustomers);
    setTables(await tablesRes.json());
  };

  useEffect(() => {
    fetchData();
  }, [branch]);

  const filteredItems = items.filter(i => {
    const catMatch = selectedCategory ? i.category_id === selectedCategory : true;
    const searchMatch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const subtotal = posCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const handleAddToCart = (item: any) => {
    setPosCart([...posCart, item]);
  };

  const updateQuantity = (idx: number, delta: number) => {
    const newCart = [...posCart];
    newCart[idx].quantity = Math.max(1, newCart[idx].quantity + delta);
    setPosCart(newCart);
  };

  const removeItem = (idx: number) => {
    setPosCart(posCart.filter((_, i) => i !== idx));
  };

  const handleProcessOrder = async () => {
    if (orderType === 'dine-in' && !selectedTable) {
      toast.error('Please select a table for Dine-in');
      return;
    }

    const orderData = {
      customer_name: selectedCustomer?.customer_name || 'Walking Customer',
      customer_phone: selectedCustomer?.customer_phone || '',
      total_amount: total,
      subtotal,
      discount,
      order_type: orderType,
      payment_method: paymentMethod,
      received_amount: parseFloat(receivedAmount) || total,
      change_amount: (parseFloat(receivedAmount) || total) - total,
      transaction_id: transactionId,
      table_id: selectedTable?.id || null,
      items: posCart
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      const data = await res.json();

      // Update table occupancy if dine-in
      if (orderType === 'dine-in' && selectedTable) {
        await fetch(`/api/admin/dining-tables/${selectedTable.id}/occupancy`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_occupied: true })
        });
      }

      setLastOrder({ ...orderData, orderId: data.orderId, token_no: data.token_no });
      setShowPaymentModal(false);
      setShowInvoiceModal(true);
      setPosCart([]);
      setDiscount(0);
      setReceivedAmount('');
      setTransactionId('');
      setSelectedTable(null);
      fetchData(); // Refresh tables
    }
  };

  const handleAddCustomer = () => {
    setCustomers([...customers, { customer_name: newCustomer.name, customer_phone: newCustomer.phone }]);
    setSelectedCustomer({ customer_name: newCustomer.name, customer_phone: newCustomer.phone });
    setShowAddCustomerModal(false);
    setNewCustomer({ name: '', phone: '', email: '', password: 'password123' });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Side: Item Selection */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search items manually..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-emerald-500 transition-colors">
              <Utensils className="w-6 h-6" />
            </button>
            <button className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 text-white">
              <LayoutDashboard className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
              selectedCategory === null ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white text-gray-400 hover:bg-gray-100"
            )}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex-shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                selectedCategory === cat.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white text-gray-400 hover:bg-gray-100"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 content-start pb-6">
          {filteredItems.map(item => (
            <motion.div 
              layout
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group border border-transparent hover:border-emerald-100"
            >
              <div className="relative h-32 rounded-2xl overflow-hidden mb-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlusCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1">{item.name}</h4>
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-600">${item.price.toFixed(2)}</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Order Summary */}
      <div className="w-[400px] bg-white border-l border-gray-100 flex flex-col h-full shadow-2xl z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">Order Summary</h3>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Token #---</span>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <select 
                value={selectedCustomer?.customer_phone || ''}
                onChange={e => {
                  const customer = customers.find(c => c.customer_phone === e.target.value);
                  setSelectedCustomer(customer || null);
                }}
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="">Walking Customer</option>
                {customers.map((c, idx) => (
                  <option key={idx} value={c.customer_phone}>{c.customer_name} ({c.customer_phone})</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
            <button 
              onClick={() => setShowAddCustomerModal(true)}
              className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
            >
              <PlusSquare className="w-6 h-6" />
            </button>
          </div>

          <div className="flex bg-gray-50 p-1 rounded-2xl">
            {(['takeaway', 'delivery', 'dine-in'] as const).map(type => (
              <button 
                key={type}
                onClick={() => setOrderType(type)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  orderType === type ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {orderType === 'dine-in' && (
            <div className="mt-4 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Table</label>
              <div className="grid grid-cols-4 gap-2">
                {tables.map(table => (
                  <button 
                    key={table.id}
                    disabled={table.is_occupied}
                    onClick={() => setSelectedTable(table)}
                    className={cn(
                      "p-2 rounded-xl text-[10px] font-bold border-2 transition-all",
                      selectedTable?.id === table.id ? "border-emerald-500 bg-emerald-50 text-emerald-600" : 
                      table.is_occupied ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed" : "border-gray-100 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {table.name}
                    {table.is_occupied && <span className="block text-[8px] opacity-50">Occupied</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {posCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Cart is empty</p>
            </div>
          ) : (
            posCart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-gray-900 text-xs truncate">{item.name}</h5>
                  <p className="text-[10px] text-gray-400 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-colors">
                    <MinusSquare className="w-4 h-4" />
                  </button>
                  <span className="font-black text-gray-900 text-xs w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-colors">
                    <PlusSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeItem(idx)} className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Sub Total</span>
              <span className="font-black text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Discount</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-16 p-1 bg-white border border-gray-200 rounded text-right font-black text-emerald-600"
                />
                <button className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-black uppercase">Apply</button>
              </div>
            </div>
            <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
              <span className="font-black text-gray-900 uppercase tracking-widest">Total</span>
              <span className="font-black text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => { setPosCart([]); setDiscount(0); }}
              className="flex-1 py-4 bg-white text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs border border-red-100 hover:bg-red-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={posCart.length === 0}
              onClick={() => setShowPaymentModal(true)}
              className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Order Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="text-center">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Amount</p>
                  <h2 className="text-4xl font-black text-emerald-600">${total.toFixed(2)}</h2>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Payment Method</h5>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'cash', icon: Coins, label: 'Cash' },
                      { id: 'card', icon: CreditCardIcon, label: 'Card' },
                      { id: 'mfs', icon: Smartphone, label: 'MFS' },
                      { id: 'other', icon: Wallet, label: 'Other' }
                    ].map(method => (
                      <button 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                          paymentMethod === method.id ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-gray-100 text-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'cash' ? (
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Enter Received Amount</h5>
                    <div className="relative">
                      <input 
                        type="number"
                        value={receivedAmount}
                        onChange={e => setReceivedAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-2xl font-black text-gray-900 focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">USD</div>
                    </div>
                    {parseFloat(receivedAmount) > total && (
                      <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-600 uppercase">Change to return</span>
                        <span className="text-xl font-black text-emerald-600">${(parseFloat(receivedAmount) - total).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Enter Transaction ID</h5>
                    <input 
                      type="text"
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="TXN123456789"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-lg font-black text-gray-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <button 
                  onClick={handleProcessOrder}
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  <Receipt className="w-6 h-6" /> Confirm & Print Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCustomerModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Add New Customer</h3>
                <button onClick={() => setShowAddCustomerModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name *</label>
                    <input 
                      type="text"
                      value={newCustomer.name}
                      onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone *</label>
                    <input 
                      type="tel"
                      value={newCustomer.phone}
                      onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                  <input 
                    type="email"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button 
                  onClick={handleAddCustomer}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
                >
                  Add Customer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Options Modal for POS */}
      {selectedItem && (
        <ItemOptionsModal 
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleAddToCart}
        />
      )}

      {/* Invoice Modal */}
      <InvoiceModal 
        order={lastOrder}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.email !== 'amytzee@gmail.com')) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="p-8">Verifying...</div>;
  if (!user || user.email !== 'amytzee@gmail.com') return null;

  return <>{children}</>;
};

const AdminLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Utensils, label: 'Items', path: '/admin/items' },
    { icon: Layers, label: 'Item Categories', path: '/admin/categories' },
    { icon: Table, label: 'Dining Tables', path: '/admin/tables' },
    { type: 'header', label: 'POS & ORDERS' },
    { icon: ShoppingBag, label: 'POS', path: '/admin/pos' },
    { icon: FileText, label: 'POS Orders', path: '/admin/orders?type=pos' },
    { icon: ShoppingBag, label: 'Online Orders', path: '/admin/orders?type=online' },
    { icon: Table, label: 'Table Orders', path: '/admin/orders?type=table' },
    { icon: Monitor, label: 'K.D.S', path: '/admin/kds' },
    { icon: Tv, label: 'O.S.S', path: '/admin/oss' },
    { type: 'header', label: 'PROMO' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    { icon: Percent, label: 'Offers', path: '/admin/offers' },
    { type: 'header', label: 'COMMUNICATIONS' },
    { icon: Bell, label: 'Push Notifications', path: '/admin/notifications' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Users, label: 'Subscribers', path: '/admin/subscribers' },
    { type: 'header', label: 'USERS' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block fixed h-full overflow-y-auto no-scrollbar">
        <div className="text-xl font-bold text-emerald-600 mb-10">FoodAppi Admin</div>
        <nav className="space-y-1">
          {menuItems.map((item, idx) => (
            item.type === 'header' ? (
              <div key={idx} className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-6 pb-2 px-3">
                {item.label}
              </div>
            ) : (
              <Link 
                key={item.path}
                to={item.path!} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl font-medium transition-all text-sm",
                  location.pathname === item.path 
                    ? "bg-pink-50 text-pink-600 font-bold" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            )
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium w-full"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">AD</div>
            <button className="text-gray-400 hover:text-gray-600"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

const AdminDiningTables = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '1',
    status: 'Active',
    branch_id: '',
    qr_code: ''
  });

  const fetchData = async () => {
    const [tablesRes, branchesRes] = await Promise.all([
      fetch('/api/admin/dining-tables'),
      fetch('/api/admin/branches')
    ]);
    setTables(await tablesRes.json());
    setBranches(await branchesRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTable ? `/api/admin/dining-tables/${editingTable.id}` : '/api/admin/dining-tables';
    const method = editingTable ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        capacity: parseInt(formData.capacity),
        qr_code: formData.qr_code || `TABLE-${formData.name}-${formData.branch_id}`
      })
    });

    if (res.ok) {
      toast.success(editingTable ? 'Table updated' : 'Table added');
      setIsModalOpen(false);
      setEditingTable(null);
      setFormData({ name: '', capacity: '1', status: 'Active', branch_id: '', qr_code: '' });
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this table?')) {
      await fetch(`/api/admin/dining-tables/${id}`, { method: 'DELETE' });
      toast.success('Table deleted');
      fetchData();
    }
  };

  return (
    <AdminLayout title="Dining Tables">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Filter <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Export <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>
        <button 
          onClick={() => {
            setEditingTable(null);
            setFormData({ name: '', capacity: '1', status: 'Active', branch_id: branches[0]?.id || '', qr_code: '' });
            setIsModalOpen(true);
          }}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <PlusCircle className="w-5 h-5" /> Add Tables
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Branch</th>
                <th className="px-8 py-4">Size</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Occupancy</th>
                <th className="px-8 py-4">QR Code</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-sm font-bold text-gray-900">{table.name}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-600">{table.branch_name}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-600">{table.capacity}</td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      table.status === 'Active' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {table.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      table.is_occupied ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"
                    )}>
                      {table.is_occupied ? 'Occupied' : 'Free'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="p-2 bg-white border border-gray-100 rounded-lg inline-block">
                      <QRCodeSVG value={table.qr_code || ''} size={40} />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingTable(table);
                          setFormData({
                            name: table.name,
                            capacity: table.capacity.toString(),
                            status: table.status,
                            branch_id: table.branch_id.toString(),
                            qr_code: table.qr_code
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">{editingTable ? 'Edit Table' : 'Add Table'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branch *</label>
                  <select 
                    required
                    value={formData.branch_id}
                    onChange={e => setFormData({...formData, branch_id: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Table Name *</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity (watu wangapi) *</label>
                  <input 
                    required
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <div className="flex gap-4">
                    {['Active', 'Inactive'].map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio"
                          name="status"
                          value={s}
                          checked={formData.status === s}
                          onChange={e => setFormData({...formData, status: e.target.value})}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-emerald-600 transition-colors">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
                >
                  {editingTable ? 'Update Table' : 'Save Table'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

  const orderStatusData = stats.statusStats.map((s: any) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count
  }));

  return (
    <AdminLayout title="Dashboard">
      {/* Reminder Banner */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-8 flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg text-red-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">Reminder!</p>
          <p className="text-[10px] text-gray-500 font-medium">Dummy data will be reset in every 60 minutes.</p>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-pink-600 mb-1">Good Morning!</h2>
        <p className="text-lg font-bold text-gray-900">John Doe</p>
      </div>

      {/* Overview Cards */}
      <div className="mb-12">
        <h3 className="text-lg font-black text-gray-900 mb-6">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Sales', value: `$${stats.overview.totalSales.toFixed(2)}`, icon: Coins, color: 'bg-pink-500' },
            { label: 'Total Orders', value: stats.overview.totalOrders, icon: Package, color: 'bg-indigo-500' },
            { label: 'Total Customers', value: stats.overview.totalCustomers, icon: Users, color: 'bg-blue-500' },
            { label: 'Total Menu Items', value: stats.overview.totalItems, icon: FileText, color: 'bg-purple-500' },
          ].map((card, idx) => (
            <div key={idx} className={cn("p-6 rounded-[2rem] text-white flex items-center gap-6 shadow-lg", card.color)}>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <card.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{card.label}</p>
                <p className="text-2xl font-black">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Statistics */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900">Order Statistics</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-[10px] font-black text-gray-400">
            <Calendar className="w-4 h-4" /> 03/01/2026 - 03/01/2026 <X className="w-3 h-3 cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Orders', value: stats.overview.totalOrders, icon: Package, color: 'text-pink-500', bg: 'bg-pink-50' },
            { label: 'Pending', value: stats.statusStats.find((s: any) => s.status === 'pending')?.count || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Accept', value: stats.statusStats.find((s: any) => s.status === 'accepted')?.count || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Preparing', value: stats.statusStats.find((s: any) => s.status === 'preparing')?.count || 0, icon: Utensils, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Prepared', value: stats.statusStats.find((s: any) => s.status === 'prepared')?.count || 0, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Out For Delivery', value: stats.statusStats.find((s: any) => s.status === 'out_for_delivery')?.count || 0, icon: Truck, color: 'text-cyan-500', bg: 'bg-cyan-50' },
            { label: 'Delivered', value: stats.statusStats.find((s: any) => s.status === 'delivered')?.count || 0, icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Canceled', value: stats.statusStats.find((s: any) => s.status === 'canceled')?.count || 0, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Returned', value: stats.statusStats.find((s: any) => s.status === 'returned')?.count || 0, icon: ArrowLeft, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Rejected', value: stats.statusStats.find((s: any) => s.status === 'rejected')?.count || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Sales Summary */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-gray-500">Sales Summary</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400">
              03/01/2026 - 03/31/2026 <Calendar className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-end gap-8 mb-8">
            <div>
              <p className="text-2xl font-black text-gray-900">${stats.overview.totalSales.toFixed(2)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">${(stats.overview.totalSales / 30).toFixed(2)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Sales Per Day</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesSummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={3} dot={false} fillOpacity={1} fill="url(#colorSales)" />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-gray-500">Orders Summary</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400">
              03/01/2026 - 03/31/2026 <Calendar className="w-3 h-3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-gray-900">{stats.overview.totalOrders}</p>
              </div>
            </div>
            <div className="space-y-4 flex flex-col justify-center">
              {orderStatusData.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">{item.name} ({Math.round((item.value / stats.overview.totalOrders) * 100)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${(item.value / stats.overview.totalOrders) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-gray-500">Customer Stats</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400">
              03/01/2026 - 03/31/2026 <Calendar className="w-3 h-3" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <h4 className="font-black text-gray-500 mb-8">Top Customers</h4>
          <div className="grid grid-cols-3 gap-4">
            {stats.topCustomers.map((customer: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <User className="w-8 h-8" />
                </div>
                <p className="text-xs font-black text-gray-900 truncate mb-1">{customer.customer_name}</p>
                <div className="bg-emerald-500 text-white rounded-lg py-2 px-3 text-[10px] font-black uppercase tracking-widest">
                  {customer.order_count} Orders
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Items */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <h4 className="font-black text-gray-500 mb-8">Featured Items</h4>
          <div className="grid grid-cols-4 gap-4">
            {stats.featuredItems.map((item: any) => (
              <div key={item.id} className="space-y-2">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <p className="text-[10px] font-black text-gray-900 truncate text-center">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Items */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <h4 className="font-black text-gray-500 mb-8">Most Popular Items</h4>
          <div className="grid grid-cols-2 gap-6">
            {stats.popularItems.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-black text-gray-900 truncate">{item.name}</h5>
                  <p className="text-[10px] font-bold text-emerald-600 mb-1">{item.category}</p>
                  <p className="text-xs font-black text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    toast.success('Status updated');
    fetchOrders();
  };

  if (loading) return <AdminLayout title="Orders">Loading...</AdminLayout>;

  return (
    <AdminLayout title="Order Management">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Branch</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-gray-900">#{order.id}</td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-gray-900">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_phone}</div>
                  </td>
                  <td className="px-8 py-4 text-gray-600 text-sm">{order.branch_name}</td>
                  <td className="px-8 py-4 font-bold text-emerald-600">${order.total_amount.toFixed(2)}</td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold uppercase text-gray-400">{order.order_type}</span>
                  </td>
                  <td className="px-8 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer",
                        order.status === 'pending' ? "bg-amber-100 text-amber-600" : 
                        order.status === 'delivered' ? "bg-emerald-100 text-emerald-600" :
                        "bg-blue-100 text-blue-600"
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', image: '', status: 'Active' });

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    setCategories(await res.json());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCat ? `/api/admin/categories/${editingCat.id}` : '/api/admin/categories';
    const method = editingCat ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast.success(editingCat ? 'Category updated' : 'Category added');
      setIsModalOpen(false);
      setEditingCat(null);
      setFormData({ name: '', image: '', status: 'Active' });
      fetchCategories();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      toast.success('Category deleted');
      fetchCategories();
    }
  };

  return (
    <AdminLayout title="Item Categories">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Export <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Import <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>
        <button 
          onClick={() => {
            setEditingCat(null);
            setFormData({ name: '', image: '', status: 'Active' });
            setIsModalOpen(true);
          }}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <PlusCircle className="w-5 h-5" /> Add Item Category
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4 w-12"><Layers className="w-4 h-4" /></th>
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-600">{cat.name}</td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      cat.status === 'Active' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-50 flex items-center gap-1 text-[10px] font-bold uppercase">
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCat(cat);
                          setFormData({ name: cat.name, image: cat.image, status: cat.status });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-50 flex items-center gap-1 text-[10px] font-bold uppercase"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-600 border border-red-100 rounded-lg hover:bg-red-50 flex items-center gap-1 text-[10px] font-bold uppercase"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">{editingCat ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name *</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image URL *</label>
                  <input 
                    required
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
                >
                  {editingCat ? 'Update Category' : 'Save Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

const AdminItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tax: '0',
    image: '',
    category_id: '',
    item_type: 'Veg',
    is_featured: false,
    status: 'Active',
    caution: ''
  });

  const fetchData = async () => {
    const [itemsRes, catsRes] = await Promise.all([
      fetch('/api/admin/items'),
      fetch('/api/admin/categories')
    ]);
    setItems(await itemsRes.json());
    setCategories(await catsRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingItem ? `/api/admin/items/${editingItem.id}` : '/api/admin/items';
    const method = editingItem ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        tax: parseFloat(formData.tax),
        is_featured: formData.is_featured ? 1 : 0
      })
    });

    if (res.ok) {
      toast.success(editingItem ? 'Item updated' : 'Item added');
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', tax: '0', image: '', category_id: '', item_type: 'Veg', is_featured: false, status: 'Active', caution: '' });
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
      toast.success('Item deleted');
      fetchData();
    }
  };

  return (
    <AdminLayout title="Items">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Filter <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Export <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-2">
            Import <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', description: '', price: '', tax: '0', image: '', category_id: '', item_type: 'Veg', is_featured: false, status: 'Active', caution: '' });
            setIsModalOpen(true);
          }}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <PlusCircle className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-sm font-bold text-gray-600">{item.name}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-400">{item.category_name}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.status === 'Active' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-50">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            name: item.name,
                            description: item.description || '',
                            price: item.price?.toString() || '0',
                            tax: item.tax?.toString() || '0',
                            image: item.image,
                            category_id: item.category_id?.toString() || '',
                            item_type: item.item_type,
                            is_featured: item.is_featured === 1,
                            status: item.status,
                            caution: item.caution || ''
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-50"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 border border-red-100 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">{editingItem ? 'Edit Item' : 'Add Item'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name *</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price *</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category *</label>
                    <select 
                      required
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tax (Including) %</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={formData.tax}
                      onChange={e => setFormData({...formData, tax: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image URL *</label>
                  <input 
                    required
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="item_type" value="Veg" checked={formData.item_type === 'Veg'} onChange={e => setFormData({...formData, item_type: e.target.value})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">Veg</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="item_type" value="Non Veg" checked={formData.item_type === 'Non Veg'} onChange={e => setFormData({...formData, item_type: e.target.value})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">Non Veg</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Is Featured</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="is_featured" value="Yes" checked={formData.is_featured} onChange={() => setFormData({...formData, is_featured: true})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="is_featured" value="No" checked={!formData.is_featured} onChange={() => setFormData({...formData, is_featured: false})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={e => setFormData({...formData, status: e.target.value})} className="text-emerald-500 focus:ring-emerald-500" />
                        <span className="text-xs font-bold text-gray-600">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Caution</label>
                  <textarea 
                    value={formData.caution}
                    onChange={e => setFormData({...formData, caution: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
                >
                  {editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

const AdminSettings = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [branchForm, setBranchForm] = useState({ name: '', address: '', is_active: true });

  const fetchData = async () => {
    const [branchesRes] = await Promise.all([
      fetch('/api/admin/branches')
    ]);
    setBranches(await branchesRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingBranch ? `/api/admin/branches/${editingBranch.id}` : '/api/admin/branches';
    const method = editingBranch ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchForm)
    });
    toast.success(editingBranch ? 'Branch updated' : 'Branch added');
    setIsBranchModalOpen(false);
    setEditingBranch(null);
    setBranchForm({ name: '', address: '', is_active: true });
    fetchData();
  };

  return (
    <AdminLayout title="System Settings">
      <div className="grid grid-cols-1 gap-8">
        {/* Branches Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Branches</h2>
            <button 
              onClick={() => {
                setEditingBranch(null);
                setBranchForm({ name: '', address: '', is_active: true });
                setIsBranchModalOpen(true);
              }}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Branch
            </button>
          </div>
          <div className="p-8 space-y-4">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <div className="font-bold text-gray-900">{branch.name}</div>
                  <div className="text-xs text-gray-400">{branch.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingBranch(branch);
                      setBranchForm({ name: branch.name, address: branch.address, is_active: branch.is_active === 1 });
                      setIsBranchModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Modal */}
      <AnimatePresence>
        {isBranchModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBranchModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{editingBranch ? 'Edit Branch' : 'Add Branch'}</h2>
                <button onClick={() => setIsBranchModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleBranchSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Branch Name</label>
                  <input 
                    required
                    type="text" 
                    value={branchForm.name}
                    onChange={e => setBranchForm({...branchForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Address</label>
                  <textarea 
                    required
                    value={branchForm.address}
                    onChange={e => setBranchForm({...branchForm, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 h-24" 
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={branchForm.is_active}
                    onChange={e => setBranchForm({...branchForm, is_active: e.target.checked})}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="text-sm font-bold text-gray-700">Active Branch</span>
                </label>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

// --- Main App ---

export default function App() {
  const { branch, setBranch } = useAppStore();

  useEffect(() => {
    if (!branch) {
      fetch('/api/branches')
        .then(res => res.json())
        .then(branches => {
          if (branches && branches.length > 0) {
            setBranch(branches[0]);
          }
        });
    }
  }, [branch, setBranch]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/pos" element={<AdminRoute><POSPage /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/tables" element={<AdminRoute><AdminDiningTables /></AdminRoute>} />
            <Route path="/admin/items" element={<AdminRoute><AdminItems /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <BottomNav />
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

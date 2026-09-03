export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  stockQuantity: number;
  isbn?: string;
  imageUrl?: string;
  publicationYear?: number;
  active: boolean;
  category?: Category;
  brand?: Brand;
  salesCount: number;
  deliveryDate?: string;
  inStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  priceAtAdd: number;
  currentPrice: number;
  priceChanged: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

export interface Address {
  id: number;
  fullName: string;
  phoneNumber: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  bookId?: number;
  bookTitle: string;
  bookAuthor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  rewardPointsEarned: number;
  rewardPointsRedeemed: number;
  snapshotFullName: string;
  snapshotLine1: string;
  snapshotLine2?: string;
  snapshotCity: string;
  snapshotState: string;
  snapshotPostalCode: string;
  snapshotCountry: string;
  snapshotPhone: string;
  placedAt: string;
  canCancel: boolean;
  payment?: Payment;
}

export interface Payment {
  id: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  cardHolderName?: string;
  maskedCardNumber?: string;
  amount: number;
  processedAt?: string;
}

export interface RewardTransaction {
  id: number;
  type: 'EARNED' | 'REDEEMED' | 'REVERSED_EARN' | 'REVERSED_REDEEM';
  points: number;
  description?: string;
  createdAt: string;
}

export interface RewardPoints {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: RewardTransaction[];
}

export interface WishlistItem {
  id: number;
  book: Book;
  addedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

export interface BookFilters {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CheckoutRequest {
  addressId: number;
  rewardPointsToRedeem?: number;
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CheckoutResponse {
  order: Order;
  payment: unknown;
}

export interface AdminStats {
  totalBooks: number;
  totalCategories: number;
  totalBrands: number;
  totalOrders: number;
  totalUsers?: number;
  totalRevenue?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  price: number | string;
  stockQuantity: number | string;
  isbn?: string;
  imageUrl?: string;
  publicationYear?: number | string;
  categoryId?: number | string;
  brandId?: number | string;
  active: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface BrandFormData {
  name: string;
  description?: string;
  logoUrl?: string;
}

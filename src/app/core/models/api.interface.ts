export interface IResponse<T> {
  results: number;
  metadata: Metadata;
  data: T[];
  message?: string;
  token?: string;
  status?: string;
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

export interface IProduct {
  sold?: number;
  images?: string[];
  subcategory?: ISubcategory[];
  ratingsQuantity?: number;
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  quantity?: number;
  price?: number;
  imageCover?: string;
  category?: ICategory;
  brand?: IBrand;
  ratingsAverage?: number;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  priceAfterDiscount?: number;
  availableColors?: any[];
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
  _id?: string;
}

export interface IAuthResponse {
  message: string;
  user?: IUser;
  token?: string;
}

export interface ICartItem {
  count: number;
  _id: string;
  product: IProduct;
  price: number;
}

export interface ICart {
  _id: string;
  cartOwner: string;
  products: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
  totalCartPrice: number;
  totalPriceAfterDiscount?: number;
  numOfCartItems?: number;
}

export interface ICartResponse {
  status: string;
  numOfCartItems: number;
  data: ICart;
}

export interface IWishlistItem extends IProduct {}

export interface IWishlistResponse {
  status: string;
  message?: string;
  data: IWishlistItem[];
}

export interface IOrder {
  _id: string;
  user: string;
  cartItems: ICartItem[];
  shippingAddress: IShippingAddress;
  paymentMethodType: string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface IReview {
  _id: string;
  user: { _id: string; name: string };
  product: string;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  _id: string;
  name: string;
  expire: string;
  discount: number;
}

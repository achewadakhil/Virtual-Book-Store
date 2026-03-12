export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "";

export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
  },
  users: {
    me: "/users/me",
    all: "/users",
    byId: (userId) => `/users/${userId}`,
    public: "/users/public",
  },
  books: {
    all: "/books",
    byId: (bookId) => `/books/${bookId}`,
    search: "/books/search",
    category: "/books/category",
    add: "/books/addBook",
    update: (bookId) => `/books/${bookId}`,
    remove: (bookId) => `/books/${bookId}`,
    load: "/books/load",
  },
  cart: {
    current: "/cart",
    add: "/cart/items",
    remove: (bookId) => `/cart/items/${bookId}`,
    decrease: (bookId) => `/cart/items/${bookId}/decrease`,
    clear: "/cart/items",
    total: "/cart/total",
  },
  orders: {
    all: "/orders",
    checkout: "/orders/checkout",
  },
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  shops: {
    list: "/shops",
    detail: (shopId: string) => `/shops/${shopId}`,
  },
  services: {
    byShop: (shopId: string) => `/shops/${shopId}/services`,
    create: (shopId: string) => `/shops/${shopId}/services`,
    update: (shopId: string, serviceId: string) =>
      `/shops/${shopId}/services/${serviceId}`,
    delete: (shopId: string, serviceId: string) =>
      `/shops/${shopId}/services/${serviceId}`,
  },
  orders: {
    list: "/orders",
    create: "/orders/create",
    detail: (orderId: string) => `/orders/${orderId}`,
    status: (orderId: string) => `/orders/${orderId}/status`,
    cancel: (orderId: string) => `/orders/${orderId}`,
  },
  payments: {
    create: "/payments/create",
    byOrder: (orderId: string) => `/payments/order/${orderId}`,
    status: (paymentId: string) => `/payments/${paymentId}/status`,
  },
};

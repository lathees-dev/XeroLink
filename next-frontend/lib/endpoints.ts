export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  orders: {
    // Student
    create: "/orders/create", // POST (multipart) field name: "document"
    listMine: "/orders", // GET (student)
    detail: (orderId: string) => `/orders/${orderId}`, // GET (student)
    cancel: (orderId: string) => `/orders/${orderId}`, // DELETE (student or shop)
    // Shop
    updateStatus: (orderId: string) => `/orders/${orderId}/status`, // PATCH (shop)
    feedback: (orderId: string) => `/orders/${orderId}/feedback`, // POST (student)
  },
  payments: {
    create: "/payments/create", // POST
    byOrder: (orderId: string) => `/payments/order/${orderId}`, // GET
    updateStatus: (paymentId: string) => `/payments/${paymentId}/status`, // PATCH
  },
  shop: {
    // All require shop auth
    profile: "/shop/profile", // PUT (no GET route in backend)
    status: "/shop/status", // PATCH
    services: "/shop/services", // POST
    service: (serviceId: string) => `/shop/services/${serviceId}`, // PUT/DELETE
    orders: "/shop/orders", // GET shop's orders
  },
};

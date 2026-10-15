
export interface ShippingAddress {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface PaymentSummary {
    last4: number | string;
    brand: string;
    exp_month: number;
    exp_year: number;
}

export interface Order {
    id: number;
    buyerEmail: string;
    shippingAddress: ShippingAddress;
    orderDate: string;
    orderItems: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    orderStatus: string;
    paymentSummary: PaymentSummary;
    total: number;
    returnReason?: string;
    returnComments?: string;
    returnedAt?: string;
}

export interface OrderItem {
    productId: number;
    name?: string;
    productName?: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}

export interface CreateOrder {
    basketId?: string;
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
}

export interface Basket {
    basketId: string;
    items: BasketItem[];
    coupon: Coupon | null;
    clientSecret?: string;
}

export interface BasketItem {
    productId: number;
    name: string;
    price: number;
    imageUrl: string;
    brand: string;
    type: string;
    quantity: number;
}

export interface Coupon {
    name: string;
    amountOff: number | null;
    percentOff: number | null;
    promotionCode: string;
    couponId: string;
}
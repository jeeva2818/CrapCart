import {
    useClearBasketMutation,
    useFetchBasketQuery
} from '../../features/catalog/catalogApi'

export const useBasket = () => {
    const { data: basket } = useFetchBasketQuery()
    const [clearBasket] = useClearBasketMutation()

    const subtotal =
        basket?.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        ) ?? 0

    const deliveryFee = subtotal > 10000 ? 0 : 500

    let discount = 0

    if (basket?.coupon) {
        if (basket.coupon.amountOff) {
            discount = basket.coupon.amountOff / 100
        }

        if (basket.coupon.percentOff) {
            discount =
                subtotal * (basket.coupon.percentOff / 100)
        }
    }

    const total = subtotal - discount + deliveryFee

    return {
        basket,
        subtotal,
        discount,
        deliveryFee,
        total,
        clearBasket
    }
}
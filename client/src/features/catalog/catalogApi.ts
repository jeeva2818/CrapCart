
import { createApi } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import { baseQueryWithErrorHandling } from '../../app/api/baseApi'
import type { Product } from '../../app/models/products'
import type { Basket, BasketItem } from '../../app/models/basket'
import type { ProductParams } from '../../app/models/productParams'
import { filterEmptyValues } from '../../lib/filterEmptyValues'
import type { Pagination } from '../../app/models/pagination'

function isBasketItem(
    product: Product | BasketItem
): product is BasketItem {
    return (product as BasketItem).quantity !== undefined
}

function getBasketId(): string {
    let basketId = Cookies.get('basketId')

    if (!basketId) {
        basketId = crypto.randomUUID()

        Cookies.set('basketId', basketId, {
            expires: 7,
            sameSite: 'lax'
        })
    }

    return basketId
}

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],

    endpoints: builder => ({

        fetchFilters: builder.query<
            { brands: string[], types: string[] },
            void
        >({
            query: () => ({
                url: 'products/filters'
            })
        }),

        fetchProducts: builder.query<
            {
                items: Product[]
                pagination: Pagination | null
            },
            ProductParams
        >({
            query: productParams => ({
                url: 'products',
                params: filterEmptyValues(productParams)
            }),

            transformResponse: (
                items: Product[],
                meta
            ) => {
                const paginationHeader =
                    meta?.response?.headers.get('Pagination')

                const pagination = paginationHeader
                    ? JSON.parse(paginationHeader)
                    : null

                return {
                    items,
                    pagination
                }
            }
        }),

        fetchProductDetails: builder.query<Product, number>({
            query: productId => ({
                url: `products/${productId}`
            })
        }),

        fetchBasket: builder.query<Basket, void>({
            query: () => ({
                url: `basket/${getBasketId()}`
            }),
            providesTags: ['Basket']
        }),

        addBasketItem: builder.mutation<
            Basket,
            {
                product: Product | BasketItem
                quantity: number
            }
        >({
            query: ({ product, quantity }) => {
                const productId = isBasketItem(product)
                    ? product.productId
                    : product.id

                return {
                    url: 'basket/items',
                    method: 'POST',
                    body: {
                        basketId: getBasketId(),
                        productId,
                        quantity
                    }
                }
            },
            invalidatesTags: ['Basket']
        }),

        removeBasketItem: builder.mutation<
            Basket,
            {
                productId: number
                quantity: number
            }
        >({
            query: ({ productId, quantity }) => ({
                url: `basket/${getBasketId()}/items/${productId}`,
                method: 'DELETE',
                params: { quantity }
            }),
            invalidatesTags: ['Basket']
        }),

        clearBasket: builder.mutation<void, void>({
            query: () => ({
                url: `basket/${getBasketId()}`,
                method: 'DELETE'
            }),

            async onQueryStarted(
                _,
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled

                    Cookies.remove('basketId')

                    dispatch(
                        catalogApi.util.updateQueryData(
                            'fetchBasket',
                            undefined,
                            draft => {
                                draft.items = []
                                draft.basketId = ''
                                draft.coupon = null
                                draft.clientSecret = undefined
                            }
                        )
                    )
                } catch (error) {
                    console.error('Failed to clear basket:', error)
                }
            }
        }),

        addCoupon: builder.mutation<Basket, string>({
            query: code => ({
                url: `basket/${code}`,
                method: 'POST'
            }),
            invalidatesTags: ['Basket']
        }),

        removeCoupon: builder.mutation<void, void>({
            query: () => ({
                url: 'basket/remove-coupon',
                method: 'DELETE'
            }),
            invalidatesTags: ['Basket']
        })

    })
})

export const {
    useFetchProductsQuery,
    useFetchProductDetailsQuery,
    useFetchBasketQuery,
    useAddBasketItemMutation,
    useFetchFiltersQuery,
    useRemoveBasketItemMutation,
    useClearBasketMutation,
    useAddCouponMutation,
    useRemoveCouponMutation
} = catalogApi

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { CreateOrder, Order } from '../../app/models/order';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Orders'],
    endpoints: builder => ({
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['Orders']
        }),

        fetchOrderDetails: builder.query<Order, number>({
            query: (id) => ({
                url: `orders/${id}`
            }),
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }]
        }),

        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                await queryFulfilled;

                dispatch(
                    orderApi.util.invalidateTags(['Orders'])
                );
            }
        }),

        updateOrderStatus: builder.mutation<Order, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `orders/${id}/status`,
                method: 'PUT',
                body: JSON.stringify(status),
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Orders', id },
                'Orders'
            ]
        }),

        requestReturn: builder.mutation<Order, { id: number; reason: string; comments?: string }>({
            query: ({ id, ...body }) => ({
                url: `orders/${id}/return`,
                method: 'POST',
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Orders', id },
                'Orders'
            ]
        }),

        processReturnDecision: builder.mutation<Order, { id: number; approved: boolean }>({
            query: ({ id, approved }) => ({
                url: `orders/${id}/return-decision`,
                method: 'PUT',
                body: { approved }
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Orders', id },
                'Orders'
            ]
        })
    })
});

export const {
    useFetchOrdersQuery,
    useFetchOrderDetailsQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useRequestReturnMutation,
    useProcessReturnDecisionMutation
} = orderApi;

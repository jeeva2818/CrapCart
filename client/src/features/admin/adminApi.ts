
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const adminApi = createApi({
    reducerPath: "adminApi",

    baseQuery: baseQueryWithErrorHandling,

    endpoints: builder => ({
        createProduct: builder.mutation<void, FormData>({
            query: data => ({
                url: "products",
                method: "POST",
                body: data
            })
        }),

        updateProduct: builder.mutation<
            void,
            {
                id: number;
                data: FormData;
            }
        >({
            query: ({ id, data }) => {
                data.append("id", id.toString());

                return {
                    url: "products",
                    method: "PUT",
                    body: data
                };
            }
        }),

        deleteProduct: builder.mutation<void, number>({
            query: id => ({
                url: `products/${id}`,
                method: "DELETE"
            })
        })
    })
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = adminApi;

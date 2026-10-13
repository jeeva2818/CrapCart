import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithErrorHandling } from '../../app/api/baseApi'
import { router } from '../../app/routes/Routes'
import { toast } from 'react-toastify'

import type { Address, User } from '../../app/models/user'
import type { LoginSchema } from '../../lib/schemas/loginSchema'

export const accountsApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],

    endpoints: builder => ({
        login: builder.mutation<void, LoginSchema>({
            query: (creds) => ({
                url: 'login?useCookies=true',
                method: 'POST',
                body: creds
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled

                    dispatch(
                        accountsApi.util.invalidateTags(['UserInfo'])
                    )
                } catch (error) {
                    console.log(error)
                    throw error
                }
            }
        }),

        register: builder.mutation<void, {
            email: string
            password: string
        }>({
            query: (creds) => ({
                url: 'account/register',
                method: 'POST',
                body: creds
            }),

            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled

                    toast.success(
                        'Registration successful. You can now sign in!'
                    )

                    router.navigate('/login')
                } catch (error) {
                    console.log(error)
                    throw error
                }
            }
        }),

        userInfo: builder.query<User, void>({
            query: () => ({
                url: 'account/user-info'
            }),
            providesTags: ['UserInfo']
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled

                dispatch(
                    accountsApi.util.invalidateTags(['UserInfo'])
                )

                router.navigate('/')
            }
        }),

        fetchAddress: builder.query<Address, void>({
            query: () => ({
                url: 'account/address'
            })
        }),

        updateUserAddress: builder.mutation<Address, Address>({
            query: (address) => ({
                url: 'account/address',
                method: 'POST',
                body: address
            }),

            async onQueryStarted(
                address,
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    accountsApi.util.updateQueryData(
                        'fetchAddress',
                        undefined,
                        draft => {
                            Object.assign(draft, { ...address })
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch (error) {
                    patchResult.undo()
                    console.log(error)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useUserInfoQuery,
    useLazyUserInfoQuery,
    useLogoutMutation,
    useFetchAddressQuery,
    useUpdateUserAddressMutation
} = accountsApi
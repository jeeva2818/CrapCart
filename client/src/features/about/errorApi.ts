import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithErrorHandling } from '../../app/api/baseApi'

export const errorApi = createApi({
    reducerPath: 'errorApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: builder => ({
        get400Error: builder.query<void, void>({
            query: () => ({ url: 'buggy/badrequest' })
        }),
        get401Error: builder.query<void, void>({
            query: () => ({ url: 'buggy/unauthorized' })
        }),
        get404Error: builder.query<void, void>({
            query: () => ({ url: 'buggy/notfound' })
        }),
        get500Error: builder.query<void, void>({
            query: () => ({ url: 'buggy/servererror' })
        }),
        getValidationError: builder.query<void, void>({
            query: () => ({ url: 'buggy/validationerror' })
        })
    })
})

export const {
    useLazyGet400ErrorQuery,
    useLazyGet401ErrorQuery,
    useLazyGet404ErrorQuery,
    useLazyGet500ErrorQuery,
    useLazyGetValidationErrorQuery
} = errorApi
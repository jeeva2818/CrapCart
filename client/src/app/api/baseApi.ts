import {
    fetchBaseQuery,
    type BaseQueryApi,
    type FetchArgs
} from '@reduxjs/toolkit/query'
import { startLoading, stopLoading } from '../layouts/uiSlice'
import { toast } from 'react-toastify'
import { router } from '../routes/Routes'

type ErrorResponse =
    | string
    | { title: string }
    | { errors: { [key: string]: string[] } }

const customBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('crapcart_token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        const basketId = localStorage.getItem('basketId')
        if (basketId) {
            headers.set('BasketId', basketId)
        }
        return headers
    }
})

const sleep = () =>
    new Promise(resolve => setTimeout(resolve, 1000))

export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {

    if (import.meta.env.DEV) {
        await sleep()
    }

    api.dispatch(startLoading())

    const result = await customBaseQuery(
        args,
        api,
        extraOptions
    )

    api.dispatch(stopLoading())

    if (result.error) {
        const { status, data } = result.error

        const originalStatus =
            result.error.status === 'PARSING_ERROR'
                ? result.error.originalStatus
                : result.error.status

        const responseData =
            result.error.data as ErrorResponse

        switch (originalStatus) {

            case 400:
                if (typeof responseData === 'string') {
                    toast.error(responseData)
                }
                else if ('errors' in responseData) {
                    throw new Error(
                        Object.values(responseData.errors)
                            .flat()
                            .join(', ')
                    )
                }
                else {
                    toast.error(responseData.title)
                }
                break

            case 401:
                localStorage.removeItem('crapcart_token')
                if (typeof responseData === 'object' && responseData) {
                    const msg = (responseData as any).detail === 'Failed'
                        ? 'Invalid email or password'
                        : ('title' in responseData ? responseData.title : 'Unauthorized')
                    toast.error(msg)
                } else if (typeof responseData === 'string') {
                    toast.error(responseData)
                }
                break

            case 403:
                toast.error('Forbidden')
                break

            case 404:
                router.navigate('/not-found')
                break

            case 500:
                if (typeof responseData === 'object') {
                    router.navigate('/server-error', {
                        state: {
                            error: responseData
                        }
                    })
                }
                break
        }

        console.log(status, data)
        console.log(result.error)
    }

    return result
}
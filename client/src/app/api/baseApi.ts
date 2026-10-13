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
    credentials: 'include'
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
                if (
                    typeof responseData === 'object' &&
                    'title' in responseData
                ) {
                    toast.error(responseData.title)
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
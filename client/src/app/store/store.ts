import { legacy_createStore as createStore } from 'redux'
import counterReducer from '../../features/contact/counterReducer'
import { counterSlice } from '../../features/contact/counterReducer'
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { catalogApi } from '../../features/catalog/catalogApi'
import { uiSlice } from '../layouts/uiSlice'
import { errorApi } from '../../features/about/errorApi'
import { accountsApi } from '../../features/accounts/accountsApi'
import { checkoutApi } from '../../features/checkout/checkoutApi'
import { orderApi } from '../../features/orders/orderApi'
import { adminApi } from "../../features/admin/adminApi";

import { catalogSlice } from '../../features/catalog/catalogSlice'


export const store = configureStore({
    reducer: {
    counter: counterSlice.reducer,
    catalog: catalogSlice.reducer,
    ui: uiSlice.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer
},

    middleware: getDefaultMiddleware =>
    getDefaultMiddleware()

        .concat(catalogApi.middleware)
        .concat(errorApi.middleware)
        .concat(accountsApi.middleware)
        .concat(checkoutApi.middleware)
        .concat(orderApi.middleware)
        .concat(adminApi.middleware),
})
export default function configureLegacyStore() {
    return createStore(counterReducer)
}
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
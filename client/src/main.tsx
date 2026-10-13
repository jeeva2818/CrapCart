import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './app/layouts/Styles.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes/Routes'
import { Provider } from 'react-redux'
import { store } from './app/store/store'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ToastContainer
         position="bottom-right"
         hideProgressBar
         theme="colored"
        />

<RouterProvider router={router} />
    </Provider>
)

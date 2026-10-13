import { useFetchProductsQuery, useFetchFiltersQuery } from './catalogApi'

import ProductList from './ProductList'

import Filters from './Filters'

import loadingGif from '../../assets/Let Me Think What GIF.gif'

import { Grid, Typography  } from '@mui/material'

import AppPagination from '../../app/shared/components/AppPagination'


import { setPageNumber } from './catalogSlice'

import { useAppSelector,useAppDispatch } from '../../app/store/store'

export default function Catalog() {


const productParams = useAppSelector(state => state.catalog)
const dispatch = useAppDispatch()
const { data, isLoading } =
    useFetchProductsQuery(productParams)
const {data: filtersData,isLoading: filtersLoading} = useFetchFiltersQuery()
if (isLoading || !data || filtersLoading || !filtersData) {
    return <div><img src={loadingGif} alt="Loading..." /></div>
}

 return (
    <Grid container spacing={3}>
        <Grid size={3}>
            <Filters filtersData={filtersData} />
        </Grid>

        <Grid size={9}>
    {data.items.length > 0 ? (
    <>
        <ProductList products={data.items} />

        <AppPagination
            metadata={data.pagination!}
            onPageChange={page => {
            dispatch(setPageNumber(page))
            window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }}
/>
    </>
) : (
    <Typography variant="h5">
        There are no results for this filter.
    </Typography>
)}
</Grid>
    </Grid>
)
}
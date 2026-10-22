import { useFetchProductsQuery, useFetchFiltersQuery } from './catalogApi'
import ProductList from './ProductList'
import Filters from './Filters'
import loadingGif from '../../assets/Let Me Think What GIF.gif'
import { Grid, Typography } from '@mui/material'
import AppPagination from '../../app/shared/components/AppPagination'
import { setPageNumber } from './catalogSlice'
import { useAppSelector, useAppDispatch } from '../../app/store/store'

export default function Catalog() {
  const productParams = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch()
  const { data, isLoading } = useFetchProductsQuery(productParams)
  const { data: filtersData, isLoading: filtersLoading } = useFetchFiltersQuery()

  if (isLoading || !data || filtersLoading || !filtersData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <img src={loadingGif} alt="Loading..." />
      </div>
    )
  }

  return (
    <Grid container spacing={2.5}>
      {/* Left Sidebar Filter (compact 2.5 width) */}
      <Grid size={{ xs: 12, md: 2.5 }}>
        <Filters filtersData={filtersData} />
      </Grid>

      {/* Main Product Area (wide 9.5 width for 4-column cards) */}
      <Grid size={{ xs: 12, md: 9.5 }}>
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
          <Typography variant="h5" sx={{ color: '#ffffff', mt: 4 }}>
            There are no results for this filter.
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}
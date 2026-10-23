import { useFetchProductsQuery, useFetchFiltersQuery } from './catalogApi'
import ProductList from './ProductList'
import Filters from './Filters'
import { Grid, Paper, Skeleton, Typography } from '@mui/material'
import AppPagination from '../../app/shared/components/AppPagination'
import { setPageNumber } from './catalogSlice'
import { useAppSelector, useAppDispatch } from '../../app/store/store'
import ProductCardSkeleton from './ProductCardSkeleton'

export default function Catalog() {
  const productParams = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch()
  const { data, isLoading } = useFetchProductsQuery(productParams)
  const { data: filtersData, isLoading: filtersLoading } = useFetchFiltersQuery()

  return (
    <Grid container spacing={2.5}>
      {/* Left Sidebar Filter (compact 2.5 width) */}
      <Grid size={{ xs: 12, md: 2.5 }}>
        {filtersLoading || !filtersData ? (
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: 'linear-gradient(180deg, #1c090d 0%, #120407 100%)',
              border: '1px solid rgba(229, 9, 20, 0.25)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5
            }}
          >
            <Skeleton animation="wave" height={36} width="60%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
            <Skeleton animation="wave" height={24} width="90%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
            <Skeleton animation="wave" height={24} width="80%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
            <Skeleton animation="wave" height={24} width="70%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
          </Paper>
        ) : (
          <Filters filtersData={filtersData} />
        )}
      </Grid>

      {/* Main Product Area (wide 9.5 width for 4-column cards) */}
      <Grid size={{ xs: 12, md: 9.5 }}>
        {isLoading || !data ? (
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={index} sx={{ display: 'flex' }}>
                <ProductCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : data.items.length > 0 ? (
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

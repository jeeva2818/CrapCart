import {
  Box,
  Paper,
  Button
} from '@mui/material'
import { setBrands, setOrderBy, setTypes, resetParams } from './catalogSlice'
import { useAppDispatch, useAppSelector } from '../../app/store/store'
import RadioButtonGroup from '../../app/shared/components/RadioButtonGroup'
import CheckboxButtons from '../../app/shared/components/CheckboxButtons'

type Props = {
  filtersData: {
    brands: string[]
    types: string[]
  }
}

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'price', label: 'Price: Low to high' }
]

export default function Filters({ filtersData }: Props) {
  const dispatch = useAppDispatch()
  const data = filtersData
  const { orderBy, brands, types } = useAppSelector(state => state.catalog)

  const cardStyle = {
    p: 2.5,
    borderRadius: 3,
    background: 'linear-gradient(180deg, #1c090d 0%, #120407 100%)',
    border: '1px solid rgba(229, 9, 20, 0.25)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
    color: '#ffffff'
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5
      }}
    >
      <Paper sx={cardStyle}>
        <RadioButtonGroup
          selectedValue={orderBy}
          options={sortOptions}
          onChange={e => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>

      <Paper sx={cardStyle}>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={items => dispatch(setBrands(items))}
        />
      </Paper>

      <Paper sx={cardStyle}>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={items => dispatch(setTypes(items))}
        />
      </Paper>

      {/* Modern RESET FILTERS button */}
      <Button
        onClick={() => dispatch(resetParams())}
        variant="outlined"
        fullWidth
        sx={{
          py: 1.2,
          borderColor: '#e50914',
          color: '#ffffff',
          fontWeight: 800,
          letterSpacing: 1.2,
          borderRadius: 2,
          bgcolor: 'rgba(229, 9, 20, 0.15)',
          '&:hover': {
            borderColor: '#ff3344',
            bgcolor: '#e50914',
            color: '#ffffff'
          }
        }}
      >
        RESET FILTERS
      </Button>
    </Box>
  )
}
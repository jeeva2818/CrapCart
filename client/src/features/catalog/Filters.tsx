import {
    Box,
    Paper,
    Button
} from '@mui/material'
import { setBrands, setOrderBy, setTypes, resetParams, } from './catalogSlice'
import { useAppDispatch, useAppSelector } from '../../app/store/store'
import Search from './Search'
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
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' }
]

export default function Filters({ filtersData }: Props) {
    const dispatch = useAppDispatch()

    const data = filtersData

    const { orderBy, brands, types } = useAppSelector(
        state => state.catalog
    )
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}
        >
            <Search />

            <Paper sx={{ p: 3 }}>
                <RadioButtonGroup
                    selectedValue={orderBy}
                    options={sortOptions}
                    onChange={e =>
                        dispatch(setOrderBy(e.target.value))
                    }
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <CheckboxButtons
                    items={data.brands}
                    checked={brands}
                    onChange={items =>
                        dispatch(setBrands(items))
                    }
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <CheckboxButtons
                    items={data.types}
                    checked={types}
                    onChange={items =>
                        dispatch(setTypes(items))
                    }
                />
            </Paper>
            <Button
    onClick={() => dispatch(resetParams())}
    variant="contained"
>
    Reset Filters
</Button>
        </Box>
    )
}
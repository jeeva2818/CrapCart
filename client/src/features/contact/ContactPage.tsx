import { useAppDispatch, useAppSelector } from '../../app/store/store'
import { increment, decrement } from './counterReducer'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

export default function ContactPage() {
    const { data } = useAppSelector(state => state.counter)
    const dispatch = useAppDispatch()
    return (
        <div>
            <Typography>
                Contact Page
            </Typography>

            <Typography>
                the data is: {data}
            </Typography>
            <ButtonGroup>
    <Button
        color="error"
        onClick={() => {
            dispatch(decrement(1))
        }}
    >
        decrement
    </Button>

    <Button
        color="secondary"
        onClick={() => {
            dispatch(increment(1))
        }}
    >
        increment
    </Button>
    <Button
    color="primary"
    onClick={() => {
        dispatch(increment(5))
    }}
>
    increment by 5
</Button>
<Button
    color="primary"
    onClick={() => {
        dispatch(decrement(5))
    }}
>
    decrement by 5
</Button>
</ButtonGroup>
        </div>
    )
}
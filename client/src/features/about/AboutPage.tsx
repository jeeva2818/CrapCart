
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  Typography
} from '@mui/material'

import { useState } from 'react'

import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery
} from './errorApi'

export default function AboutPage() {

  const [trigger400Error] = useLazyGet400ErrorQuery()
  const [trigger401Error] = useLazyGet401ErrorQuery()
  const [trigger404Error] = useLazyGet404ErrorQuery()
  const [trigger500Error] = useLazyGet500ErrorQuery()
  const [triggerValidationError] = useLazyGetValidationErrorQuery()

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const getValidationError = async () => {
    try {
      await triggerValidationError().unwrap()
    } catch (error) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    const errorArray = (error as { message: string }).message.split(', ')
    console.log(errorArray)
    setValidationErrors(errorArray)
  }
}
  }

  return (
    <Container maxWidth="lg">

      <Typography gutterBottom variant="h3">
        Errors for testing
      </Typography>

      <ButtonGroup fullWidth>

        <Button
          variant="contained"
          onClick={() => {
            trigger400Error().catch(error => console.log(error))
          }}
        >
          Test 400 error
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            trigger401Error().catch(error => console.log(error))
          }}
        >
          401 error
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            trigger404Error().catch(error => console.log(error))
          }}
        >
          404 error
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            trigger500Error().catch(error => console.log(error))
          }}
        >
          500 error
        </Button>

        <Button
          variant="contained"
          onClick={getValidationError}
        >
          Test validation error
        </Button>

      </ButtonGroup>
      {validationErrors.length > 0 && (
  <Alert severity="error">
    Validation Errors
    <List>
      {validationErrors.map(error => (
        <ListItem key={error}>
          {error}
        </ListItem>
      ))}
    </List>
  </Alert>
)}

    </Container>
  )
}

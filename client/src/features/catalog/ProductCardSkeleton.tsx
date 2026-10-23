import { Card, CardContent, Skeleton } from '@mui/material'

export default function ProductCardSkeleton() {
  return (
    <Card
      elevation={4}
      sx={{
        width: '100%',
        borderRadius: '12px',
        bgcolor: '#140306',
        border: '1.5px solid rgba(229, 9, 20, 0.25)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        animation="wave"
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }}
      />
      <CardContent sx={{ pt: 2, pb: 2.5, px: 2 }}>
        <Skeleton
          animation="wave"
          height={26}
          width="85%"
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mb: 1 }}
        />
        <Skeleton
          animation="wave"
          height={20}
          width="60%"
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', mb: 2 }}
        />
        <Skeleton
          animation="wave"
          height={32}
          width="45%"
          sx={{ bgcolor: 'rgba(229, 9, 20, 0.25)' }}
        />
      </CardContent>
    </Card>
  )
}

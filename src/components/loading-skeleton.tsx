import { Skeleton } from './ui/skeleton'

const WeatherSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='grid gap-6'>
        <Skeleton className='h-[300px] w-full rounded-lg' />
        <Skeleton className='h-[300px] w-full rounded-lg' />
        <div className='grid md:grid-cols-2 gap-6'>
          <Skeleton className='h-[300px] w-full rounded-lg' />
          <Skeleton className='h-[300px] w-full rounded-lg' />
        </div>
      </div>
    </div>
  )
}

export default WeatherSkeleton

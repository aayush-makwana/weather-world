import CurrentWeather from '@/components/current-weather'
import FavoriteButton from '@/components/favorite-button'
import HourlyTemperature from '@/components/hourly-temperature'
import WeatherSkeleton from '@/components/loading-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import WeatherDetails from '@/components/weather-details'
import WeatherForecast from '@/components/weather-forecast'
import { useForecastQuery, useWeatherQuery } from '@/hooks/use-weather'
import { AlertTriangle } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const CityPage = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  const navigate = useNavigate()

  // Redirect to home if coordinates are missing or invalid
  if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Invalid Location</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>The location coordinates are missing or invalid.</p>
          <Button variant='outline' className='w-fit' onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const coordinates = {
    lat: parseFloat(lat),
    lon: parseFloat(lon)
  }

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          Failed to fetch weather data. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold tracking-tight'>
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavoriteButton data={{ ...weatherQuery.data, name: params.cityName }} />
        </div>
      </div>

      <div className='grid gap-6'>
        <div className='flex flex-col gap-4'>
          <CurrentWeather data={weatherQuery.data} />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className='grid gap-6 md:grid-cols-2 items-start'>
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default CityPage

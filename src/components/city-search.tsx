'use client'

import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Button } from './ui/button'
import { Clock, Loader2, Search, Star, Trash2 } from 'lucide-react'
import { useLocationSearch } from '@/hooks/use-weather'
import { useNavigate } from 'react-router-dom'
import { useSearchHistory } from '@/hooks/use-search-history'
import { format } from 'date-fns'
import { useFavorite } from '@/hooks/use-favorite'

const CitySearch = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { data: locations, isLoading } = useLocationSearch(query)
  const { history, addToHistory, clearHistory } = useSearchHistory()
  const { favorites } = useFavorite()
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split('|')

    addToHistory.mutate({ query, name, lat: parseFloat(lat), lon: parseFloat(lon), country })

    setOpen(false)
    setQuery('')

    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
  }

  return (
    <>
      <Button
        variant='outline'
        className='relative h-8 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64'
        onClick={() => setOpen(true)}
      >
        <Search className='h-4 w-4' />
        <span className='hidden lg:inline-flex'>Search cities...</span>
        <span className='inline-flex lg:hidden'>Search...</span>
        <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium opacity-100 sm:flex'>
          <span className='text-[10px]'>⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search cities...' value={query} onValueChange={setQuery} />
        <CommandList>
          {query.length > 2 && !isLoading && <CommandEmpty>No cities found.</CommandEmpty>}
          {favorites.length > 0 && (
            <CommandGroup heading='Favorites'>
              {favorites.map(location => {
                return (
                  <CommandItem
                    key={location.id}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className='mr-2 h-4 w-4 text-yellow-500' />
                    <span>{location.name}</span>
                    {location.state && <span className='text-sm text-muted-foreground'>, {location.state}</span>}
                    <span className='text-sm text-muted-foreground'>, {location.country}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup
                heading={
                  <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium text-muted-foreground'>Recent Searches</p>
                    <button title='Clear history' onClick={() => clearHistory.mutate()}>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                }
              >
                {history.map(location => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
                      <span>{location.name}</span>
                      {location.state && <span className='text-sm text-muted-foreground'>, {location.state}</span>}
                      <span className='text-sm text-muted-foreground'>, {location.country}</span>
                      <span className='ml-auto text-xs text-muted-foreground'>
                        {format(location.searchedAt, 'MMM d, h:mm a')}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </>
          )}

          {locations && locations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading='Suggestions'>
                {isLoading && (
                  <div className='flex items-center justify-center p-4'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </div>
                )}
                {locations.map(location => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Search className='mr-2 h-4 w-4' />
                      <span>{location.name}</span>
                      {location.state && <span className='text-sm text-muted-foreground'>, {location.state}</span>}
                      {location.country && <span className='text-sm text-muted-foreground'>, {location.country}</span>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CitySearch

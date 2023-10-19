import Select from 'react-select'
import { useEffect, useState } from 'react'
import { GeoCoding } from '../types/Geocoding'
import { Coordinate } from '../types/Coordinate'

const url = 'https://api.digitransit.fi/geocoding/v1/autocomplete'
const MAX_LATITUDE = '60.655922'
const MIN_LATITUDE = '60.160260'
const MAX_LONGITUDE = '26.310512'
const MIN_LONGITUDE = '23.802292'

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  return debouncedValue
}

type AddressOption = {
  type: 'address'
  label: string
  value: string
  coordinate: Coordinate
}

type MyLocationOption = {
  type: 'mylocation'
  label: string
  value: string
}

export type Option = AddressOption | MyLocationOption

type LocationProps = {
  CoordinateCallback: (option: Option) => void
}

function LocationAutocomplete(props: LocationProps) {
  const [options, setOptions] = useState<GeoCoding>()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedVal = useDebounce(searchTerm, 500)

  useEffect(() => {
    let cancelled = false
    if (debouncedVal.length !== 0) {
      fetch(
        `${url}?${new URLSearchParams({
          text: debouncedVal,
          layers: 'address',
          'boundary.rect.min_lat': MIN_LATITUDE,
          'boundary.rect.max_lat': MAX_LATITUDE,
          'boundary.rect.min_lon': MIN_LONGITUDE,
          'boundary.rect.max_lon': MAX_LONGITUDE,
          'digitransit-subscription-key': '0655993151044b858b8850da50c4c65b',
        })}`
      )
        .then(res => res.json())
        .then(res => {
          if (!cancelled) setOptions(res)
        })
        .catch(err => {
          console.log('request failed', err)
        })
    }
    return () => {
      cancelled = true
    }
  }, [debouncedVal])

  const handleSelectionChange = (option: Option | null) => {
    if (option) {
      setSearchTerm(option.label)
      props.CoordinateCallback(option)
    }
  }

  return (
    <div>
      <Select
        onChange={e => handleSelectionChange(e)}
        onInputChange={e => setSearchTerm(e)}
        options={[
          {
            type: 'mylocation' as const,
            value: 'mylocation',
            label: 'My current location',
          },
          ...(options?.features.map(option => ({
            type: 'address' as const,
            label: option.properties.label,
            value: option.properties.id,
            coordinate: {
              longitude: option.geometry.coordinates[0],
              latitude: option.geometry.coordinates[1],
            },
          })) ?? []),
        ]}
      />
    </div>
  )
}

export default LocationAutocomplete

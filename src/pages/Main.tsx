import { useEffect, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { useGetStopsByRadiusQuery } from '../generated/graphql'
import ArrivalTimeDisplay from '../components/ArrivalTimes'
import LocationAutocomplete, {
  Option,
} from '../components/LocationAutocomplete'
import { isDefined } from '../util'
import './Main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const DEFAULT_DISTANCE = 500
const DEFAULT_POLLINTERVAL = 60000

function MainPage() {
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [distance, setDistance] = useState<number>(DEFAULT_DISTANCE)
  const [status, setStatus] = useState<string | undefined>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const latitudeParam = searchParams.get('lat')
    const longitudeParam = searchParams.get('lon')
    if (latitudeParam && longitudeParam) {
      setLatitude(Number(latitudeParam))
      setLongitude(Number(longitudeParam))
    }
  }, [searchParams])

  const { data: stopsData, loading: stopsLoading } = useGetStopsByRadiusQuery({
    variables: {
      lat: latitude!,
      lon: longitude!,
      radius: distance,
    },
    pollInterval: DEFAULT_POLLINTERVAL,
    skip: !isDefined(latitude) || !isDefined(longitude),
  })

  const getCurrentUserLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser')
    } else {
      setStatus('Locating...')
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setStatus(undefined)
          navigate({
            pathname: '/schedule',
            search: `?${createSearchParams({
              lat: position.coords.latitude.toString(),
              lon: position.coords.longitude.toString(),
            })}`,
          })
        },
        () => {
          setStatus(
            'Unable to retrieve your location. Make sure to allow location in your browser.'
          )
        }
      )
    }
  }

  const UpdateCoordinate = async (option: Option) => {
    if (option.type === 'address') {
      setLatitude(option.coordinate.latitude)
      setLongitude(option.coordinate.longitude)
      setStatus(undefined)
      navigate({
        pathname: '/schedule',
        search: `?${createSearchParams({
          lat: option.coordinate.latitude.toString(),
          lon: option.coordinate.longitude.toString(),
        })}`,
      })
    } else if (option.type === 'mylocation') {
      getCurrentUserLocation()
    }
  }

  return (
    <div>
      <div className="mx-3 pt-2 filterHeader">
        <Form>
          <div className="locationRow">
            <div className="locationTitle">
              <div>
                <img
                  src="/images/search.svg"
                  alt="HSL search Logo"
                  width={20}
                  height={20}
                />
              </div>
              <div>Location</div>
            </div>
            <div className="locationAutocomplete">
              <LocationAutocomplete CoordinateCallback={UpdateCoordinate} />
            </div>
          </div>
          <Form.Text className="text-muted">{status}</Form.Text>

          <div className="distanceRow mt-2">
            <div className="distanceTitle">
              <img
                src="/images/walker.svg"
                alt="HSL walker Logo"
                width={20}
                height={20}
              />
              <div>Distance</div>
            </div>
            <div className="locationAutocomplete">
              <DropdownButton
                title={`${distance} meters`}
                onSelect={(e: string | null) => setDistance(Number(e))}
                variant="light"
                className="distanceSelector"
              >
                <Dropdown.Item key={200} eventKey={'200'}>
                  200 meters
                </Dropdown.Item>
                <Dropdown.Item key={500} eventKey={'500'}>
                  500 meters
                </Dropdown.Item>
                <Dropdown.Item key={1000} eventKey={'1000'}>
                  1 km
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </Form>
      </div>
      <div className="content table-responsive">
        {stopsLoading ? (
          <p>Loading ...</p>
        ) : (
          stopsData && (
            <div className="m-3">
              <h3>Schedule:</h3>
              <ArrivalTimeDisplay arrivalQuery={stopsData} />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default MainPage

import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import StopDisplay from '../components/Stop'
import { useGetStopByIdQuery } from '../generated/graphql'
import { isDefined } from '../util'
import './StopPage.css'

function StopPage() {
  const [stopId, setStopId] = useState<string | undefined>()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  useEffect(() => {
    const idParam = searchParams.get('id')
    if (idParam) {
      setStopId(idParam)
    }
  }, [searchParams])

  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: {
      stopId: stopId!,
      numberOfDepartures: 15,
    },
    skip: !isDefined(stopId),
  })

  return (
    <div>
      <div className="m-3 navigationRow">
        <div className="navigationRow" onClick={() => navigate(-1)}>
          <div className="backButton">
            <img
              src="/images/backButton.svg"
              alt="HSL walker Logo"
              width={25}
              height={25}
            />
          </div>
          <div>Back to Timetable</div>
        </div>
      </div>
      {stopLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData && (
          <div className="m-3">
            <StopDisplay stopQuery={stopData} />
          </div>
        )
      )}
    </div>
  )
}

export default StopPage

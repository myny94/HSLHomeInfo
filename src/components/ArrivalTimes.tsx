import { useNavigate } from 'react-router'
import { createSearchParams } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { GetStopsByRadiusQuery } from '../generated/graphql'
import { remainingTimeConverter, timeConverter } from '../util'
import './ArrivalTimes.css'

type ArrivalProps = {
  arrivalQuery: GetStopsByRadiusQuery
}

function ArrivalTimeDisplay(props: ArrivalProps) {
  const navigate = useNavigate()
  const { arrivalQuery } = props

  const arrivals =
    arrivalQuery.stopsByRadius?.edges?.flatMap(
      stopData =>
        stopData?.node?.stop?.stoptimesWithoutPatterns?.filter(timePattern => {
          const scheduledArrival = timePattern?.scheduledArrival
          const serviceDay = timePattern?.serviceDay
          if (scheduledArrival && serviceDay) {
            return scheduledArrival + serviceDay > Math.floor(Date.now() / 1000)
          }
          return false
        }) ?? []
    ) ?? []

  const sortedArrivals = [...arrivals].sort((a, b) =>
    (a?.scheduledArrival ?? 0) + (a?.serviceDay ?? 0) >=
    (b?.scheduledArrival ?? 0) + (b?.serviceDay ?? 0)
      ? 1
      : -1
  )

  function RouteModeToIconName(mode: string | null | undefined) {
    if (mode!) {
      return `/images/${mode.toLowerCase()}Icon.svg`
    }
  }

  return (
    <Table size="sm">
      <thead className="scheduleTableHead">
        <tr>
          <th>Transportation</th>
          <th>Stop</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="scheduleTableBody">
        {sortedArrivals.map((arrivalData, index) => {
          const serviceDay = arrivalData?.serviceDay
          const scheduledArrival = arrivalData?.scheduledArrival
          return (
            <tr key={`${index}-${arrivalData?.scheduledArrival}`}>
              <td>
                <div className="transportationRow">
                  <span>
                    <img
                      src={RouteModeToIconName(arrivalData?.trip?.route.mode)}
                      alt="HSL transportation Logo"
                      width={20}
                      height={20}
                    />
                  </span>
                  <span
                    className={`shortName ${arrivalData?.trip?.route.mode?.toLowerCase()}`}
                  >
                    {arrivalData?.trip?.route.shortName}
                  </span>
                  <span
                    className={`longName ${arrivalData?.trip?.route.mode?.toLowerCase()}`}
                  >
                    {arrivalData?.headsign
                      ? `  (${arrivalData?.headsign})`
                      : `  (${arrivalData?.trip?.route.longName})`}
                  </span>
                </div>
              </td>
              <td>
                <div
                  className="stopName"
                  onClick={() =>
                    navigate({
                      pathname: '/stop',
                      search: `?${createSearchParams({
                        id: arrivalData?.stop?.gtfsId ?? '',
                      })}`,
                    })
                  }
                >
                  {arrivalData?.stop?.name}
                </div>
              </td>
              <td>
                <div className="transportationRow">
                  <span className="remainingTime">
                    {serviceDay && scheduledArrival && (
                      <span className="stopRemainingTime">
                        {remainingTimeConverter(serviceDay + scheduledArrival)}
                      </span>
                    )}
                  </span>
                  <span className="arrivalTime">
                    {serviceDay && scheduledArrival && (
                      <span className="arrivalTime">
                        {timeConverter(serviceDay + scheduledArrival)[1]}
                      </span>
                    )}
                  </span>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ArrivalTimeDisplay

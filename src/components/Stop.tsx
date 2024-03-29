import { Table } from 'react-bootstrap'
import { GetStopByIdQuery } from '../generated/graphql'
import {
  remainingTimeConverter,
  timeConverter,
  stringToIconName,
} from '../util'
import './Stop.css'

type StopProps = {
  stopQuery: GetStopByIdQuery
}

function StopDisplay(props: StopProps) {
  function RouteModeToIconName(mode: string | null | undefined) {
    if (mode) {
      return `/images/${mode.toLowerCase()}Icon.svg`
    }
  }

  const { stopQuery } = props
  const zoneId = stopQuery.stop?.zoneId

  return (
    <div>
      <div className="my-2">
        <h3>{stopQuery.stop?.name}</h3>
        <div className="stopDescription">
          <div>{stopQuery.stop?.desc}</div>
          <div className="chip">{stopQuery.stop?.code}</div>
          {zoneId && zoneId !== 'Ei HSL' && (
            <img
              src={stringToIconName(zoneId.toLowerCase())}
              alt="HSL zone Logo"
              width={20}
              height={20}
            />
          )}
          <img
            src="/images/googlemap.svg"
            className="googleIcon"
            alt="Google map Logo"
            width={23}
            height={23}
            onClick={() =>
              window.open(
                `http://maps.google.com/maps?z=12&t=m&q=loc:${stopQuery.stop?.lat}+${stopQuery.stop?.lon}`,
                '_blank',
                'noreferrer'
              )
            }
          />
        </div>
      </div>
      <Table size="sm">
        <thead className="stopTableHead">
          <tr>
            <th>Destination</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="stopTableBody">
          {stopQuery.stop?.stoptimesWithoutPatterns?.map((stopTime, i) => {
            const serviceDay = stopTime?.serviceDay
            const scheduledArrival = stopTime?.scheduledArrival
            return (
              <tr key={i}>
                <td>
                  <div className="stopRow">
                    <img
                      src={RouteModeToIconName(stopTime?.trip?.route.mode)}
                      alt="HSL transportation Logo"
                      width={20}
                      height={20}
                    />
                    <div
                      className={`shortName ${stopTime?.trip?.route.mode?.toLowerCase()}`}
                    >
                      {stopTime?.trip?.route.shortName}
                    </div>
                    <div
                      className={`longName ${stopTime?.trip?.route.mode?.toLowerCase()}`}
                    >
                      {stopTime?.headsign
                        ? `  (${stopTime?.headsign})`
                        : `  (${stopTime?.trip?.route.longName})`}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="stopRow">
                    {serviceDay && scheduledArrival && (
                      <span className="stopRemainingTime">
                        {remainingTimeConverter(
                          stopTime.serviceDay + stopTime.scheduledArrival
                        )}
                      </span>
                    )}
                    {serviceDay && scheduledArrival && (
                      <span className="stopArrivalTime">
                        {
                          timeConverter(
                            stopTime.serviceDay + stopTime.scheduledArrival
                          )[1]
                        }
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default StopDisplay

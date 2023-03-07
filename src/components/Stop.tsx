import { GetStopByIdQuery } from "../generated/graphql";
import { remainingTimeConverter, timeConverter } from "../util";
import { Table } from "react-bootstrap";
import { stringToIconName } from "../util";
import "./Stop.css";

type StopProps = {
  stopQuery: GetStopByIdQuery;
};

function StopDisplay(props: StopProps) {
  function RouteModeToIconName(mode: string | null | undefined) {
    if (mode!) {
      return `/images/${mode.toLowerCase()}Icon.svg`;
    }
  }

  function RouteZoneToIconName(zone: string | null | undefined) {
    if (zone!) {
      return `/images/${zone.toLowerCase()}Icon.svg`;
    }
  }

  return (
    <div className="m-3">
      <div className="my-2">
        <h3>{props.stopQuery.stop?.name}</h3>
        <div className="stopDeecription">
          <div>{props?.stopQuery.stop?.desc}</div>
          <div className="chip">{props?.stopQuery.stop?.code}</div>
          <img
            src={stringToIconName(props?.stopQuery.stop?.zoneId?.toLowerCase())}
            alt="HSL zone Logo"
            width={20}
            height={20}
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
          {props &&
            props.stopQuery.stop?.stoptimesWithoutPatterns?.map(
              (stopTime, i) => (
                <tr key={i}>
                  <td className="destinationRow">
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
                  </td>
                  <td>
                    <div className="transportationRow">
                      <span className="remainingTime">
                        {remainingTimeConverter(
                          stopTime?.serviceDay + stopTime?.scheduledArrival
                        )}
                      </span>
                      <span className="arrivalTime">
                        {
                          timeConverter(
                            stopTime?.serviceDay + stopTime?.scheduledArrival
                          )[1]
                        }
                      </span>
                    </div>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </Table>
    </div>
  );
}

export default StopDisplay;

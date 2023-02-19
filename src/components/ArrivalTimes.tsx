import { GetStopsByRadiusQuery } from "../generated/graphql";
import { RemainingTimeConverter, timeConverter } from "../util";
import { Table } from "react-bootstrap";

type ArrivalProps = {
  arrivalQuery: GetStopsByRadiusQuery;
};

function ArrivalTimeDisplay(props: ArrivalProps) {
  const arrivals =
    props.arrivalQuery.stopsByRadius?.edges?.flatMap(
      (stopData) => stopData?.node?.stop?.stoptimesWithoutPatterns ?? []
    ) ?? [];
  const sortedArrivals = [...arrivals].sort(
    (a, b) => (a?.scheduledArrival! + a?.serviceDay) >= (b?.scheduledArrival! + b?.serviceDay) ? 1:-1
  );

  function RouteModeToIconName(mode: string|null|undefined) {
    if (mode!) {
      return `/images/${mode.toLowerCase()}Icon.svg`  
    }
  }

  return (
    <Table striped size="sm">
      <thead>
        <tr>
          <th>Transportation</th>
          <th>Stop name</th>
          <th>Scheduled arrival</th>
          <th>Arrives in</th>
        </tr>
      </thead>
      <tbody>
        {sortedArrivals.map((arrivalData, index) => (
          <tr key={`${index}-${arrivalData?.scheduledArrival}`}>
            <td>
              <img src={RouteModeToIconName(arrivalData?.trip?.route.mode)} alt="HSL bus Logo" width={20} height={20} />
              {arrivalData?.trip?.route.shortName}
              {arrivalData?.headsign ? `  (${arrivalData?.headsign})` : `  (${arrivalData?.trip?.route.longName})`}</td>
            <td>{arrivalData?.stop?.name}</td>
            <td>
              {timeConverter(
                arrivalData?.serviceDay + arrivalData?.scheduledArrival
              )}
            </td>
            <td>
              {RemainingTimeConverter(
                arrivalData?.serviceDay + arrivalData?.scheduledArrival
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ArrivalTimeDisplay;

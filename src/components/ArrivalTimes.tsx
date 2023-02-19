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

  return (
    <Table striped size="sm">
      <thead>
        <tr>
          <th>Head sign</th>
          <th>Scheduled arrival</th>
          <th>Arrives in</th>
        </tr>
      </thead>
      <tbody>
        {sortedArrivals.map((arrivalData, index) => (
          <tr key={`${index}-${arrivalData?.scheduledArrival}`}>
            <td><img src="/images/busIcon.svg" alt="React Logo" width={20} height={20} />{arrivalData?.headsign}</td>
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

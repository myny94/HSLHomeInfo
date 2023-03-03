import { GetStopByIdQuery } from "../generated/graphql";
import { remainingTimeConverter, timeConverter } from "../util";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { Table } from "react-bootstrap";

type StopProps = {
  stopQuery: GetStopByIdQuery;
};

function StopDisplay(props: StopProps) {
  function RouteModeToIconName(mode: string | null | undefined) {
    if (mode!) {
      return `/images/${mode.toLowerCase()}Icon.svg`;
    }
  }

  return (
    <div>
      <div>Stop name: {props.stopQuery.stop?.name}</div>
      <div>Stop code: {props?.stopQuery.stop?.gtfsId}</div>
      <Table striped size="sm">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Scheduled arrival</th>
            <th>Arrives in</th>
          </tr>
        </thead>

        <tbody>
          {props &&
            props.stopQuery.stop?.stoptimesWithoutPatterns?.map(
              (stopTime, i) => (
                <tr key={i}>
                  <td>
                    <img
                      src={RouteModeToIconName(stopTime?.trip?.route.mode)}
                      alt="HSL transportation Logo"
                      width={20}
                      height={20}
                    />
                    {stopTime?.trip?.route.shortName}
                    {stopTime?.headsign
                      ? `  (${stopTime?.headsign})`
                      : `  (${stopTime?.trip?.route.longName})`}
                  </td>
                  <td>
                    {timeConverter(
                      stopTime?.serviceDay + stopTime?.scheduledArrival
                    )}
                  </td>
                  <td>
                    {remainingTimeConverter(
                      stopTime?.serviceDay + stopTime?.scheduledArrival
                    )}
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

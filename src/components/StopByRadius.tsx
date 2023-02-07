import { GetStopsByRadiusQuery } from "../generated/graphql";
import ListGroup from "react-bootstrap/ListGroup";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { RemainingTimeConverter, timeConverter } from "../util";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { Table } from "react-bootstrap";

type StopRadiusProps = {
  stopsQuery: GetStopsByRadiusQuery;
};

function StopByRadius(props: StopRadiusProps) {
  return (
    <ListGroup>
      {props.stopsQuery.stopsByRadius?.edges?.map((stopData) => (
        <ListGroup.Item key={stopData?.node?.stop?.gtfsId}>
          <PlaceOutlinedIcon />
          <div>stop name: {stopData?.node?.stop?.name}</div>
          <div>stop ID: {stopData?.node?.stop?.gtfsId}</div>
          <div>
            Distance from current location: {stopData?.node?.distance} meters{" "}
          </div>
          <div>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Scheduled arrival time</th>
                  <th>Arrives in</th>
                </tr>
              </thead>
              <tbody>
                {props &&
                  stopData?.node?.stop?.stoptimesWithoutPatterns?.map(
                    (stopTime, j) => (
                      <tr key={j}>
                        <td><DirectionsBusIcon />{stopTime?.headsign}</td>
                        <td>
                          {timeConverter(
                            stopTime?.serviceDay + stopTime?.scheduledArrival
                          )}
                        </td>
                        <td>
                          {RemainingTimeConverter(
                            stopTime?.serviceDay + stopTime?.scheduledArrival
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </Table>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default StopByRadius;

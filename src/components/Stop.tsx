import { GetStopByIdQuery } from "../generated/graphql";
import { timeConverter } from "../util";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

type StopProps = {
  stopQuery: GetStopByIdQuery;
};

function StopDisplay(props: StopProps) {
  return (
    <div>
      <div>Stop name: {props.stopQuery.stop?.name}</div>
      <div>Stop code: {props?.stopQuery.stop?.gtfsId}</div>
      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Scheduled arrival time</th>
          </tr>
        </thead>
        <tbody>
          {props &&
            props.stopQuery.stop?.stoptimesWithoutPatterns?.map((stopTime, i) => (
              <tr key={i}>
                <DirectionsBusIcon />
                <td>{stopTime?.headsign}</td>
                <td>
                  {timeConverter(stopTime?.serviceDay + stopTime?.scheduledArrival)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default StopDisplay;

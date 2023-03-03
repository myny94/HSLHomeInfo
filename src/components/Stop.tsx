import { GetStopByIdQuery } from "../generated/graphql";
import { remainingTimeConverter, timeConverter } from "../util";
import { Breadcrumb, Table } from "react-bootstrap";
import { stringToIconName } from "../util"
import HomeIcon from "@mui/icons-material/Home";
import "./Stop.css"

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
      <Breadcrumb className="">
        <Breadcrumb.Item href="/schedule">
          <HomeIcon />
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active href="#">
          {props.stopQuery.stop?.name}
        </Breadcrumb.Item>
      </Breadcrumb>
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

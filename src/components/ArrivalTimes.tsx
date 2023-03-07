import { useState } from "react";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import { GetStopsByRadiusQuery } from "../generated/graphql";
import { remainingTimeConverter, timeConverter } from "../util";
import { Dropdown, Table } from "react-bootstrap";
import "./ArrivalTimes.css";

type ArrivalProps = {
  arrivalQuery: GetStopsByRadiusQuery;
};

function ArrivalTimeDisplay(props: ArrivalProps) {
  const [transportationOptions, setTransportationOptions] = useState<string[]>(
    []
  );
  const navigate = useNavigate();

  const arrivals =
    props.arrivalQuery.stopsByRadius?.edges?.flatMap(
      (stopData) => stopData?.node?.stop?.stoptimesWithoutPatterns ?? []
    ) ?? [];
  const sortedArrivals = [...arrivals].sort((a, b) =>
    a?.scheduledArrival! + a?.serviceDay >= b?.scheduledArrival! + b?.serviceDay
      ? 1
      : -1
  );

  function RouteModeToIconName(mode: string | null | undefined) {
    if (mode!) {
      return `/images/${mode.toLowerCase()}Icon.svg`;
    }
  }

  return (
    <Table size="sm">
      <thead className="scheduleTableHead">
        <tr>
          <th>Transportation</th>
          <th>Stop name</th>
          <th>Scheduled arrival</th>
          <th>Arrives in</th>
        </tr>
      </thead>
      <tbody className="scheduleTable">
        {sortedArrivals.map((arrivalData, index) => (
          <tr key={`${index}-${arrivalData?.scheduledArrival}`}>
            <td className="transportationRow">
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
            </td>
            <td>
              <div
                className="stopName"
                onClick={() =>
                  navigate({
                    pathname: "/stop",
                    search: `?${createSearchParams({
                      id: arrivalData?.stop?.gtfsId!,
                    })}`,
                  })
                }
              >
                {arrivalData?.stop?.name}
              </div>
            </td>
            <td>
              {timeConverter(
                arrivalData?.serviceDay + arrivalData?.scheduledArrival
              )}
            </td>
            <td>
              {remainingTimeConverter(
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

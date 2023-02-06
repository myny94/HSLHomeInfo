import React, { useState } from "react";
import "./App.css";
import StopDisplay from "./components/Stop";
import { useGetStopByIdQuery } from "./generated/graphql";
import { timeConverter } from "./util";

function App() {
  const [stopId, setStopId] = useState<string>("HSL:4200210");
  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: { stopId },
  });
  const []

  return (
    <div>
      <h3>HSL real time</h3>
      {stopLoading ? (
        <p>Loading ...</p>
      ) : (
        <div>
          <div>Stop name: {stopData?.stop?.name}</div>
          <div>Stop code: {stopData?.stop?.gtfsId}</div>
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Scheduled arrival time</th>
              </tr>
            </thead>
            <tbody>
              {stopData &&
                stopData.stop?.stoptimesWithoutPatterns?.map((stopTime) => (
                  <tr>
                    <td>{stopTime?.headsign}</td>
                    <td>
                      {timeConverter(
                        stopTime?.serviceDay + stopTime?.scheduledArrival
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

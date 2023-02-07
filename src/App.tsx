import { useState, useEffect } from "react";
import "./App.css";
import StopByRadius from "./components/StopByRadius";
import {
  useGetStopByIdQuery,
  useGetStopsByRadiusQuery,
} from "./generated/graphql";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function App() {
  const [stopId, setStopId] = useState<string>("HSL:4200210");
  const [latitude, setLatitude] = useState<number>(60.1705011);
  const [longitude, setLongitude] = useState<number>(24.9415410);
  const [status, setStatus] = useState<string | null>();
  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: { stopId },
  });
  const { data: stopsData, loading: stopsLoading } = useGetStopsByRadiusQuery({
    variables: {
      lat: latitude,
      lon: longitude,
      radius: 1000,
    },
  });

  // on mount
  useEffect(() => {
    getCurrentUserLocation();
  }, [latitude, longitude]);

  const getCurrentUserLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setStatus(`Current location is set to ${latitude},${longitude}`);
          
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  return (
    <div>
      <h3>HSL real time</h3>
      <h4>{status}</h4>
      <Button variant="secondary sm" onClick={getCurrentUserLocation}>Set location again</Button>
      {stopLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData &&
        stopsData && (
          <div>
            Stops near my location:
            <StopByRadius stopsQuery={stopsData} />
          </div>
        )
      )}
    </div>
  );
}

export default App;

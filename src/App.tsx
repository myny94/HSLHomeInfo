import { useState, useEffect } from "react";
import "./App.css";
import {
  useGetStopByIdQuery,
  useGetStopsByRadiusQuery,
} from "./generated/graphql";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import ArrivalTimeDisplay from "./components/ArrivalTimes";
import LocationAutocomplete from "./components/LocationAutocomplete";
import { Coordinate } from "./types/Coordinate";
import Form from "react-bootstrap/Form";

function App() {
  const [stopId, setStopId] = useState<string>("HSL:4200210");
  const [latitude, setLatitude] = useState<number>(60.1705011);
  const [longitude, setLongitude] = useState<number>(24.941541);
  const [distance, setDistance] = useState<number>(1000);
  const [status, setStatus] = useState<string | null>();
  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: { stopId },
  });
  const { data: stopsData, loading: stopsLoading } = useGetStopsByRadiusQuery({
    variables: {
      lat: latitude,
      lon: longitude,
      radius: distance,
    },
    pollInterval: 60000,
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
          setStatus("Unable to retrieve your location.");
        }
      );
    }
  };

  const UpdateCoordinate = async (coordinate: Coordinate) => {
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);
  };

  return (
    <div className="m-3">
      <h3>HSL real time</h3>
      <div className="rowDisplay">
        <h4>{status}</h4>
        <Button variant="secondary sm" onClick={getCurrentUserLocation}>
          Set location again
        </Button>
      </div>
      <LocationAutocomplete CoordinateCallback={UpdateCoordinate} />
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Distance from the location (in meters)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter distance limit you wish to set"
            defaultValue={1000}
            onBlur={(e) => setDistance(parseInt(e.target.value))}
          />
          <Form.Text className="text-muted">
            Distances from the selected location to the bus stops
          </Form.Text>
        </Form.Group>
      </Form>

      {stopsLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData &&
        stopsData && (
          <div className="m-3">
            <h4>Bus schedule near my location:</h4>
            <ArrivalTimeDisplay arrivalQuery={stopsData} />
          </div>
        )
      )}
    </div>
  );
}

export default App;

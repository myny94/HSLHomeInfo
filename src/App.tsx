import { useState } from "react";
import "./App.css";
import {
  useGetStopByIdQuery,
  useGetStopsByRadiusQuery,
} from "./generated/graphql";
import "bootstrap/dist/css/bootstrap.min.css";
import ArrivalTimeDisplay from "./components/ArrivalTimes";
import LocationAutocomplete, {
  Option,
} from "./components/LocationAutocomplete";
import Form from "react-bootstrap/Form";
import WarningIcon from "@mui/icons-material/Warning";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Dropdown } from "react-bootstrap";

const DEFAULT_LATITUDE = 60.1705011;
const DEFAULT_LONGITUDE = 24.941541;
const DEFAULT_DISTANCE = 500;
const DEFAULT_POLLINTERVAL = 600000;

function App() {
  const [stopId, setStopId] = useState<string>("HSL:4200210");
  const [latitude, setLatitude] = useState<number>(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LONGITUDE);
  const [distance, setDistance] = useState<number>(DEFAULT_DISTANCE);
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
    pollInterval: DEFAULT_POLLINTERVAL,
  });

  const getCurrentUserLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setStatus(null);
        },
        () => {
          setStatus(
            "Unable to retrieve your location. Make sure to allow location in your browser."
          );
        }
      );
    }
  };

  const UpdateCoordinate = async (option: Option) => {
    if (option.type === "address") {
      setLatitude(option.coordinate.latitude);
      setLongitude(option.coordinate.longitude);
      setStatus(null);
    } else if (option.type === "mylocation") {
      getCurrentUserLocation();
    } else {
      const _: never = option;
    }
  };

  return (
    <div className="m-3">
      <h3>HSL real time table</h3>
      <Form className="m-3">
        <Form.Group controlId="formLocation" className="mb-3">
          <Form.Label>
            <LocationOnIcon />
            Location
          </Form.Label>
          <LocationAutocomplete CoordinateCallback={UpdateCoordinate} />
          <Form.Text className="text-muted">{status}</Form.Text>
        </Form.Group>
        <Form.Group controlId="formDistance">
          <Form.Label>
            <DirectionsWalkIcon />
            Distance from the location (in meters)
          </Form.Label>
          <Dropdown onSelect={(e: string | null) => setDistance(Number(e))}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Distance:  {distance} meters
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item key={200} eventKey={"200"}>
                200 meters
              </Dropdown.Item>
              <Dropdown.Item key={500} eventKey={"500"}>
                500 meters
              </Dropdown.Item>
              <Dropdown.Item key={1000} eventKey={"1000"}>
                1 km
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Form>

      {stopsLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData &&
        stopsData && (
          <div className="m-3">
            <h3>Schedule:</h3>
            <ArrivalTimeDisplay arrivalQuery={stopsData} />
          </div>
        )
      )}
    </div>
  );
}

export default App;

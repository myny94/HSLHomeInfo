import { useEffect, useState } from "react";
import {
  useGetStopByIdQuery,
  useGetStopsByRadiusQuery,
} from "../generated/graphql";
import ArrivalTimeDisplay from "../components/ArrivalTimes";
import LocationAutocomplete, {
  Option,
} from "../components/LocationAutocomplete";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { isDefined } from "../util";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeIcon from "@mui/icons-material/Home";
import Form from "react-bootstrap/Form";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

const DEFAULT_DISTANCE = 500;
const DEFAULT_POLLINTERVAL = 60000;

function MainPage() {
  const [stopId, setStopId] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [distance, setDistance] = useState<number>(DEFAULT_DISTANCE);
  const [status, setStatus] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    var latitudeParam = searchParams.get("lat");
    var longitudeParam = searchParams.get("lon");
    if (latitudeParam && longitudeParam) {
      setLatitude(Number(latitudeParam));
      setLongitude(Number(longitudeParam));
    }
  }, [searchParams]);

  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: {
      stopId: stopId!,
    },
    skip: !isDefined(stopId),
  });

  const { data: stopsData, loading: stopsLoading } = useGetStopsByRadiusQuery({
    variables: {
      lat: latitude!,
      lon: longitude!,
      radius: distance,
    },
    pollInterval: DEFAULT_POLLINTERVAL,
    skip: !isDefined(latitude) || !isDefined(longitude),
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
          setStatus(undefined);
          navigate({
            pathname: "/schedule",
            search: `?${createSearchParams({
              lat: position.coords.latitude.toString(),
              lon: position.coords.longitude.toString(),
            })}`,
          });
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
      setStatus(undefined);
      navigate({
        pathname: "/schedule",
        search: `?${createSearchParams({
          lat: option.coordinate.latitude.toString(),
          lon: option.coordinate.longitude.toString(),
        })}`,
      });
    } else if (option.type === "mylocation") {
      getCurrentUserLocation();
    } else {
      const _: never = option;
    }
  };

  return (
    <div>
      <div className="mx-3 p-2">
        <Form>
          <Form.Group controlId="formLocation" className="locationRow mb-2">
            <Form.Label>
              <LocationOnIcon />
              Location
            </Form.Label>
            <LocationAutocomplete CoordinateCallback={UpdateCoordinate} />
            <Form.Text className="text-muted">{status}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formDistance" className="distanceRow">
            <Form.Label>
              <DirectionsWalkIcon />
              Distance from the location (in meters)
            </Form.Label>
            <DropdownButton
              variant="outline-secondary"
              title={`${distance} meters`}
              onSelect={(e: string | null) => setDistance(Number(e))}
            >
              <Dropdown.Item key={200} eventKey={"200"}>
                200 meters
              </Dropdown.Item>
              <Dropdown.Item key={500} eventKey={"500"}>
                500 meters
              </Dropdown.Item>
              <Dropdown.Item key={1000} eventKey={"1000"}>
                1 km
              </Dropdown.Item>
            </DropdownButton>
          </Form.Group>
        </Form>
      </div>
      <div className="content table-responsive m-3">
        {stopsLoading ? (
          <p>Loading ...</p>
        ) : (
          stopsData && (
            <div className="m-3">
              <h3>Schedule:</h3>
              <ArrivalTimeDisplay arrivalQuery={stopsData} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MainPage;

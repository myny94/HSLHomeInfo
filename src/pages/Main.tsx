import { useEffect, useState } from "react";
import { useGetStopsByRadiusQuery } from "../generated/graphql";
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
import { isDefined } from "../util";
import Form from "react-bootstrap/Form";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DEFAULT_DISTANCE = 500;
const DEFAULT_POLLINTERVAL = 60000;

function MainPage() {
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
      <div className="mx-3 pt-2 filterHeader">
        <Form>
          <div className="locationRow">
            <div className="locationTitle">
              <div>
                <img
                  src="/images/search.svg"
                  alt="HSL search Logo"
                  width={20}
                  height={20}
                />
              </div>
              <div>Location</div>
            </div>
            <div className="locationAutocomplete">
              <LocationAutocomplete CoordinateCallback={UpdateCoordinate} />
            </div>
          </div>
          <Form.Text className="text-muted">{status}</Form.Text>

          <div className="distanceRow mt-2">
            <div>
              <img
                src="/images/walker.svg"
                alt="HSL walker Logo"
                width={20}
                height={20}
              />
            </div>
            <div className="ml-2">Distance (in meters)</div>
            <DropdownButton
              size="sm"
              title={`${distance} meters`}
              onSelect={(e: string | null) => setDistance(Number(e))}
              variant="light"
              className="filterHeader"
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
          </div>
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

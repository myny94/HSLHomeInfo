import Select from "react-select";
import { useEffect, useState } from "react";
import { GeoCoding } from "../types/Geocoding";
import Spinner from "react-bootstrap/Spinner";
import { Coordinate } from "../types/Coordinate";

const url = "https://api.digitransit.fi/geocoding/v1/autocomplete";
const MAX_LATITUDE = "60.655922";
const MIN_LATITUDE = "60.160260";
const MAX_LONGITUDE = "26.310512";
const MIN_LONGITUDE = "23.802292";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}

type LocationProps = {
  CoordinateCallback: (coordinate: Coordinate) => void;
};

function LocationAutocomplete(props: LocationProps) {
  const [options, setOptions] = useState<GeoCoding>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedVal = useDebounce(searchTerm, 500);
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    let cancelled = false;
    if (debouncedVal.length != 0) {
      fetch(
        `${url}?` +
          new URLSearchParams({
            text: searchTerm,
            layers: "address",
            "boundary.rect.min_lat": MIN_LATITUDE,
            "boundary.rect.max_lat": MAX_LATITUDE,
            "boundary.rect.min_lon": MIN_LONGITUDE,
            "boundary.rect.max_lon": MAX_LONGITUDE,
          })
      )
        .then((res) => res.json())
        .then((res) => {
          if (!cancelled) setOptions(res);
        })
        .catch(function (err) {
          console.log("request failed", err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [debouncedVal]);

  const LoadingIndicator = () => {
    return (
      <div style={{ marginRight: "10px", marginTop: "5px" }}>
        <Spinner animation="border" />
      </div>
    );
  };

  type SelectOptionType = {
    label: string;
    value: string;
    coordinate: [number, number];
  };

  const handleSelectionChange = (option: SelectOptionType | null) => {
    if (option) {
      setSearchTerm(option.label);
      if (option.coordinate!) {
        props.CoordinateCallback({
        longitude: option.coordinate[0],
        latitude: option.coordinate[1],
      });
      }
    }
  };

  return (
    <div className="my-2">
      <Select
        onChange={(e) => handleSelectionChange(e)}
        onInputChange={(e) => setSearchTerm(e)}
        options={
          options &&
          options.features.map((option) => ({
            label: option.properties.label,
            value: option.properties.id,
            coordinate: option.geometry.coordinates,
          }))
        }
      />
    </div>
  );
}

export default LocationAutocomplete;

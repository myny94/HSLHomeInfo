import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StopDisplay from "../components/Stop";
import {
  useGetStopByIdQuery,
} from "../generated/graphql";
import { isDefined } from "../util";
import "./Main.css";


function StopPage() {
  const [stopId, setStopId] = useState<string | undefined>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    var idParam = searchParams.get("id");
    if (idParam) {
        setStopId(idParam);
    }
  }, [searchParams]);
  
  const { data: stopData, loading: stopLoading } = useGetStopByIdQuery({
    variables: {
      stopId: stopId!,
    },
    skip: !isDefined(stopId),
  });


  return (
    <div className="m-3">
      {stopLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData && (
          <div className="m-3">
            <h3>Stop:</h3>
            <StopDisplay stopQuery={stopData}/>
          </div>
        )
      )}
    </div>
  );
}

export default StopPage;

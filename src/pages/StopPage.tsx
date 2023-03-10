import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StopDisplay from "../components/Stop";
import { useGetStopByIdQuery } from "../generated/graphql";
import { isDefined } from "../util";
import "./StopPage.css";

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
    <div>
      <div className="m-3 navigationRow">
        <div className="backButton">
          <img
            src="/images/backButton.svg"
            alt="HSL walker Logo"
            width={25}
            height={25}
          />
        </div>
        <div>Back to Timetable</div>
      </div>
      {stopLoading ? (
        <p>Loading ...</p>
      ) : (
        stopData && (
          <div>
            <StopDisplay stopQuery={stopData} />
          </div>
        )
      )}
    </div>
  );
}

export default StopPage;

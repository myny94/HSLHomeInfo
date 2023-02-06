import { Stop } from "../generated/graphql";

type StopProps = {
  stop: Stop;
};

function StopDisplay(props: StopProps) {
  return (
    <div className="notification container">
      <div>{props.stop?.name}</div>
      <div>
        {props.stop?.stopTimesForPattern?.map((s) => s?.scheduledArrival)}
      </div>
    </div>
  );
}

export default StopDisplay;

export const timeConverter = (UNIX_timestamp: number) => {
  var a = new Date(UNIX_timestamp * 1000);
  var today = new Date().getDate();
  var date = a.getDate();
  var hour = pad(a.getHours());
  var min = pad(a.getMinutes());
  if (today === date) {
    return ["today", `${hour}:${min}`];
  } else {
    return ["tomorrow", `${hour}:${min}`];
  }
};

export const remainingTimeConverter = (UNIX_timestamp: number) => {
  var currentTime = Math.floor(Date.now() / 1000);
  var TimeDiff = UNIX_timestamp - currentTime;
  TimeDiff = Math.floor(TimeDiff / 60);
  var min = TimeDiff % 60;
  TimeDiff = Math.floor(TimeDiff / 60);
  var hour = TimeDiff % 24;
  var time =
    hour > 0
      ? ""
      : min > 0
      ? min < 50
        ? `${min} min`
        : ""
      : `${Math.abs(min)} min ago`;
  return time;
};

// Type guard
export const isDefined = <T>(variable: T | undefined | null): variable is T => {
  return variable !== null && variable !== undefined;
};

export const stringToIconName = (string: string | null | undefined) => {
  if (isDefined(string)) {
    return `/images/${string.toLowerCase()}Icon.svg`;
  }
};

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

export const timeConverter = (UNIX_timestamp: number) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const remainingTimeConverter = (UNIX_timestamp: number) => {
  var currentTime = Math.floor(Date.now() / 1000);
  var TimeDiff = UNIX_timestamp - currentTime;
  TimeDiff = Math.floor(TimeDiff / 60);
  var min = TimeDiff % 60;
  TimeDiff = Math.floor(TimeDiff / 60);
  var hour = TimeDiff % 24;
  var time = (hour>0)? `${hour} hours ${min} minutes` : (min>0) ?`${min} minutes`: `passed ${Math.abs(min)} minutes ago`;
  return time;
};

// Type guard
export const isDefined = <T>(variable: T | undefined | null): variable is T => {
  return (variable !== null && variable !== undefined);
}

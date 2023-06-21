export function getDatetimeString(timestamp, hour12 = false) {
  const date = new Date(timestamp);
  // get date format: Feb 2, 2:02 PM
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12,
  });
}

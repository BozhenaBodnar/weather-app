export const openWeatherKey = '4456c4a501dce63e96047f5bf8d288a2';

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function convertTo24HourFormat(timeString: string) {
  const hour = timeString.split(' ')[1].slice(0, -3);
  
  return hour;
}
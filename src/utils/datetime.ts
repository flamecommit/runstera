export const formatDate = (dateObj: Date | null, format: string) => {
  if (!dateObj) return '';

  const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const offsettedDate = new Date(date.getTime() - offset * 60 * 1000);
    return offsettedDate.toISOString();
  };

  const dateStr = toLocalISOString(dateObj);
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(5, 7);
  const day = dateStr.slice(8, 10);
  const hours = dateStr.slice(11, 13);
  const minutes = dateStr.slice(14, 16);
  const seconds = dateStr.slice(17, 19);

  // 모든 패턴을 치환
  return format
    .replace(/YYYY/g, year)
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/hh/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
};

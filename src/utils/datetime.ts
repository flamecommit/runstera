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

export function getTimeOfDay(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour >= 3 && hour < 6) return '새벽';
  if (hour >= 6 && hour < 11) return '아침';
  if (hour >= 11 && hour < 17) return '낮';
  if (hour >= 17 && hour < 20) return '저녁';
  return '밤';
}

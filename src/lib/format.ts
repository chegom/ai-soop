export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function formatMonth(iso: string) {
  const [year, month] = iso.split('-');
  return `${year}년 ${Number(month)}월`;
}

export function formatPostDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}년 ${month}월 ${day}일`;
}

export function statusLabel(status: 'upcoming' | 'past') {
  return status === 'upcoming' ? '예정' : '종료';
}

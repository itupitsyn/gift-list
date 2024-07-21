export const convertLocalToUTCDate = (date: Date | null | undefined) => {
  if (!date) {
    return '';
  }
  date = new Date(date);
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return JSON.stringify(date).replaceAll('"', '').split('T')[0];
};

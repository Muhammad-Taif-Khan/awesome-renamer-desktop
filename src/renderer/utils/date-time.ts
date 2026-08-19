export const datetimeEquals = (date1: string | Date, date2: string | Date): boolean => {
  try {
    return new Date(date1).getTime() === new Date(date2).getTime();
  } catch (error) {
    throw new Error(
      `Provided dates are not in the required format, the provided dates must be a Date object , or standard date string: ${(error as Error).message}`
    );
  }
};

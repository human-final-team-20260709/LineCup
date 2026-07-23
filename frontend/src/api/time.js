import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const BUSINESS_ZONE = "Asia/Seoul";

export const toKst = (value, format = "YYYY-MM-DD HH:mm:ss") =>
  value ? dayjs(value).tz(BUSINESS_ZONE).format(format) : "-";

export const toUtcInstant = (value) =>
  value ? dayjs.tz(value, BUSINESS_ZONE).utc().toISOString() : null;

export const kstPeriod = (days, end = dayjs()) => {
  const endKst = end.tz(BUSINESS_ZONE);
  const to = endKst.add(1, "millisecond").utc().toISOString();
  const from = endKst.subtract(Math.max(0, days - 1), "day").startOf("day").utc().toISOString();
  return { from, to };
};

export const dateInputPeriod = (fromDate, toDate) => ({
  from: dayjs.tz(fromDate, BUSINESS_ZONE).startOf("day").utc().toISOString(),
  to: dayjs.tz(toDate, BUSINESS_ZONE).add(1, "day").startOf("day").utc().toISOString(),
});

export const includesNow = ({ from, to }) => {
  const now = dayjs();
  return now.isAfter(dayjs(from)) && now.isBefore(dayjs(to));
};

export const currentKstDate = () => dayjs().tz(BUSINESS_ZONE).format("YYYY-MM-DD");

import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Event = {
  start: moment.Moment;
  end: moment.Moment;
  title: string;
  allDay?: boolean;
};

const DataCalendar = () => {
  const localizer = momentLocalizer(moment);

  // const myEventsList = [
  //   {
  //     start: moment().toDate(),
  //     end: moment().add(1, "days").toDate(),
  //     title: "Some title",
  //   },
  // ];

  const [events, setEvents] = useState<Event[]>();
  const cacheEvents = useMemo(() => events, [events]);

  const key = "AIzaSyAaplojMctB_nWeDafG4Z-uJo-RhW7dPjo";

  useEffect(() => {
    async function fetchData() {
      const resGoogle = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/en.th%23holiday@group.v.calendar.google.com/events?key=${key}`
      );
      const data = await resGoogle.json();
      const items = data.items;

      const events: Event[] = [];

      items.forEach((item: any) => {
        events.push({
          start: moment(item.start.date),
          end: moment(item.end.date),
          title: item.summary,
          allDay: true,
        });
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/holiday`);
      const json = await res.json();

      json.forEach((item: any) => {
        events.push({
          start: moment(item.start_date),
          end: moment(item.end_date),
          title: item.name,
          allDay: true,
        });
      });

      // console.log(events);
      setEvents(events);
    }

    fetchData();
  }, []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={cacheEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default DataCalendar;

import { parseISO, format } from "date-fns";
import React, { useState, useEffect, use } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  filterDates: string[];
  setSelectedDate: (arg0: string) => void;
};

const DateRangePicker: React.FC<Props> = ({ filterDates, setSelectedDate }) => {
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDateState] = useState<Date | null>(null);

  useEffect(() => {

    const dates = filterDates.map((date) => new Date(date));

  }, [filterDates]);
  return (
    <>
      <label className="text-bold text-dark">Select Dates</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDateState(date);
          const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
          if (formattedDate) {
            setSelectedDate(formattedDate);
          }
        }}

        includeDates={filterDates.map((date) => parseISO(date))}
        dateFormat={"yyyy-MM-dd"}
        placeholderText="Select start date"
      />
    </>



  );
};

export default DateRangePicker;

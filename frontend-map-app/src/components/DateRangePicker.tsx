import React, { useState,useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};

const DateRangePicker:React.FC<Props> = ({ startDate, endDate, setStartDate, setEndDate,minDate,maxDate }) => {





  return (
    <div className="d-flex flex-column align-items-start gap-2">
      <label className="text-bold text-dark">Start Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        minDate={minDate}
        maxDate={maxDate}
        endDate={endDate}
        placeholderText="Select start date"
      />
      <label className="text-dark">End Date</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        minDate={minDate}
        maxDate={maxDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="Select end date"
      />
    </div>


  );
};

export default DateRangePicker;

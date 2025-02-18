import React, { Fragment } from "react";
import moment from "moment";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

const DatePicker = React.forwardRef(
  ({ value, onChange, max, min, placeholder, disable, inputClassName }, ref) => {
    return (
      <Fragment>
          <Flatpickr
            ref={ref}
            key={Math.random(6)}
            value={value}
            id="disabled-picker"
            className={classnames(
              "w-full h-auto px-4 py-2 border border-gray-300 rounded-md items-center focus:outline-none focus:ring-2 focus:ring-indigo-500",
              inputClassName
            )}
            readOnly={true}
            onOpen={(selectedDates, dateStr, instance) => {
              if (disable) {
                instance.close();
              }
            }}
            style={{ backgroundColor: disable ? "#f7f7f7" : "" }}
            clickOpens={false}
            placeholder={placeholder}
            onChange={(date) => onChange(date)}
            options={{
              minDate: moment(min ? min : "").subtract(1, "days")._d,
              maxDate: max && moment(max)._d,
              disable: [
                {
                  from: moment(min ? min : "").subtract(1, "year")._d,
                  to: min ? moment(min)._d : "",
                },
              ],
            }}
          />
      </Fragment>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;

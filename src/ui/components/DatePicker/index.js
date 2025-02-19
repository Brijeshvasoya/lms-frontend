import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Label, FormGroup } from 'reactstrap';

const DatePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = 'Select Date', 
  className = '', 
  invalid = false,
  ...rest 
}) => {
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Flatpickr
        value={value}
        onChange={(selectedDates) => {
          if (selectedDates && selectedDates.length > 0) {
            onChange(selectedDates);
          }
        }}
        options={{
          dateFormat: 'Y-m-d',
          maxDate: 'today',
          ...rest
        }}
        placeholder={placeholder}
        className={`form-control ${className} ${invalid ? 'is-invalid' : ''}`}
      />
    </FormGroup>
  );
};

export default DatePicker;

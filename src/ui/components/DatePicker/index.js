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
  ...rest 
}) => {
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Flatpickr
        value={value}
        onChange={(selectedDates) => onChange(selectedDates[0])}
        options={{
          dateFormat: 'Y-m-d',
          maxDate: 'today',
          ...rest
        }}
        placeholder={placeholder}
        className={`form-control ${className}`}
      />
    </FormGroup>
  );
};

export default DatePicker;

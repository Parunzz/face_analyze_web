import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const todayEndOfTheDay = today.endOf('day');

export default function MyDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
        defaultValue={tomorrow}
        name="mydate"
        id="mydate"
        label="DateOfBirth"
        disableFuture
        
        sx={{ width: 400 }}
      />
    </LocalizationProvider>
  );
}
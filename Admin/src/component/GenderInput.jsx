import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function GenderInput({ value, onChange }) {
  const handleChange = (event) => {
    // Call the onChange function passed from the parent component
    onChange(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="gender">Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="gender"
        sx={{ width: 400 }}
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel required value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
  );
}
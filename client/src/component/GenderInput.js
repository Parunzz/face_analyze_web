import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const options = ['Male', 'Female', 'Other'];

export default function GenderInput() {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="gender"
        name="gender"
        required
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Gender" />}
      />
    </div>
  );
}
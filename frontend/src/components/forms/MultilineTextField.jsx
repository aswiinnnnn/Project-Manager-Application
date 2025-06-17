import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MultilineTextField(props) {
  const { label, width, placeholder, name, control } = props;
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
         <TextField
  id="outlined-multiline-static"
  label={label || "Multiline"}
  multiline
  rows={4}
  value={value || ""}
  onChange={onChange}
  placeholder={placeholder}
  sx={width ? { width: width } : {}}
  error={!!error}
  helperText={error ? error.message : ''}
/>
        )}
      />
    </div>
  );
}
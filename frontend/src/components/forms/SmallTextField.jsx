import * as React from 'react';

import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function SmallTextField(props) {
  const { label, width, placeholder, name, control, defaultValue } = props;
  return (
    <div>
      <Controller
      
        name={name}
        control={control}
        defaultValue={defaultValue ?? ""}
        render={({
          field: { onChange, value },
          fieldState: { error },
          formState,
        }) => (
          <TextField
            sx={{width:{width}}}
            required
            id="outlined-required"
            label={label}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </div>
  );
}
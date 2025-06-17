import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';

export default function SelectField(props) {
  const { label, name, width, control, options, helperText, defaultValue } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
            sx={{width:{width}}}
          id={`outlined-select-${name}`}
          select
          label={label}
          required
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : helperText}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        
      )}
    />
  );
}
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useForm, Controller } from "react-hook-form";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultiSelectField({ name, label, control, options, defaultValue, width }) {
  
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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
      <FormControl fullWidth variant="outlined">


        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          
          multiple
          value={value}
          onChange={(e) =>{
            handleChange(e);
            onChange(e.target.value)
          }}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label={label}
              
            />
          }
          
          
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
             {selected.map((value, index) => (
  <Chip
    key={`${value}-${index}`}
    label={options.find(option => option.id === value)?.name}
  />
))}


            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              style={getStyles(option.name, personName, theme)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>  
      )}
    />
  );
}
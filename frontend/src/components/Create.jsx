import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Snackbar, Slide
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import SmallTextField from './forms/SmallTextField';
import MultilineTextField from './forms/MultilineTextField';
import SelectField from './forms/SelectField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AxiosInstance from './Axios';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MultiSelectField from './forms/MultiSelectField';

const projectTypeOptions = [
  { id: 0, name: 'NOT STARTED' },
  { id: 1, name: 'STARTED' },
  { id: 2, name: 'COMPLETED' },
  { id: 3, name: 'OPTED OUT' },
];

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const schema = yup.object({
  name: yup.string().required("Name field is required"),
  status: yup.string().required("Status field is required"),
  project_manager: yup.string().required("Project Manager is required"), 
  description: yup.string(),
  started_at: yup.date().required("Start Date is required"),
  ended_at: yup
    .date()
    .required("End Date is required")
    .min(yup.ref('started_at'), "End date must be after start date"),
    employees: yup.array().of(yup.number()).min(1, "Select at least one employee")
,

});


const Create = () => {
  const { control, handleSubmit, reset } = useForm({ resolver: yupResolver(schema) });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [projectManager, setProjectManager] = useState();
  const [Loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);




   const fetchProjectmanager = () => {
    AxiosInstance.get('projectsmanager/')
      .then((res) => {
        
        setProjectManager(res.data);
        setErrorMsg('');
        setLoading(false);        
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      })
      .catch((err) => {
        let msg = 'Error fetching projects';
        if (err.response) {
          const data = err.response.data;
          if (typeof data === 'object' && data !== null) {
            const field = Object.keys(data)[0];
            const fieldMsg = Array.isArray(data[field]) ? data[field][0] : data[field];
            msg = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${fieldMsg}`;
          } else {
            msg = `Error ${err.response.status}: ${JSON.stringify(data)}`;
          }
        } else if (err.request) {
          msg = 'Server not responding!';
        } else if (err.message) {
          msg = err.message;
        }
        setErrorMsg(msg);
        setSuccessMsg('');
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      });
  };

  const fetchEmployees = () => {
    AxiosInstance.get('employees/')
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error("Error fetching employees:", err);
        setEmployees([]); // fallback empty
      });
  };
  

  useEffect(() => {
    fetchProjectmanager();fetchEmployees();
  }, []);





  const submission = async (data) => {
    console.log(data)
    const StartDate = dayjs(data.started_at).format("YYYY-MM-DD");
    const EndDate = dayjs(data.ended_at).format("YYYY-MM-DD");
    

    try {
      await AxiosInstance.post(`projects/`, {
        name: data.name,
        status: data.status,
        projectManager: data.project_manager,
        description: data.description,
        started_at: StartDate,
        ended_at: EndDate,
        employees:data.employees,

      });
      
      
      setSuccessMsg('Project created successfully!');
      navigate('/', { state: { updated: true } });
      setOpen(true);
      reset({
        name: '',
        status: '',
        description: '',
        started_at: dayjs(),
        ended_at: dayjs(),
      });

      setTimeout(() => setSuccessMsg(''), 3000);
      setTimeout(() => setOpen(false), 3000);
    } catch (err) {
      let msg = 'An error occurred!';
      if (err.response) {
        const data = err.response.data;
        if (typeof data === 'object' && data !== null) {
          const firstKey = Object.keys(data)[0];
          const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          msg = firstMsg.charAt(0).toUpperCase() + firstMsg.slice(1);
        } else {
          msg = `Error ${err.response.status}: ${JSON.stringify(data)}`;
        }
      } else if (err.request) {
        msg = 'Server not responding!';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
      setSuccessMsg('');
      setOpen(true);
      setTimeout(() => setErrorMsg(''), 4000);
      setTimeout(() => setOpen(false), 4000);
    }
  };

 return (
  <div>
    {Loading ? (
      <p>Loading</p>
    ) : (
      <Box sx={{ px: 2, py: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', mb: 3, color: 'black' }}>
          Create Project Records
        </Typography>

        <Snackbar
          open={open && (!!successMsg || !!errorMsg)}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          autoHideDuration={3000}
        >
          {successMsg ? (
            <MuiAlert severity="success" sx={{ width: '100%' }}>
              {successMsg}
            </MuiAlert>
          ) : errorMsg ? (
            <MuiAlert severity="error" sx={{ width: '100%' }}>
              {errorMsg}
            </MuiAlert>
          ) : null}
        </Snackbar>

        <Box
          component="form"
          onSubmit={handleSubmit(submission)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            padding: { xs: 2, md: 4 },
          }}
        >
          {/* Row 1: Name and Status */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <SmallTextField
                name="name"
                label="Project Name"
                placeholder="Enter Project Name"
                control={control}
                defaultValue=""
                width="100%"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SelectField
                name="status"
                label="Project Status"
                control={control}
                options={projectTypeOptions}
                defaultValue=""
                width="100%"
              />
            </Box>
          </Box>

          {/* Row 2: Project Manager */}
          {/* Row 2: Project Manager and Employees */}
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
  <Box sx={{ flex: 1 }}>
    <SelectField
      name="project_manager"
      label="Project Manager"
      control={control}
      options={projectManager?.map(pm => ({ id: pm.id, name: pm.name })) || []}
      defaultValue=""
      width="100%"
    />
  </Box>
  <Box sx={{ flex: 1 }}>
    <MultiSelectField
      name="employees"
      label="Assign Employees"
      control={control}
      options={employees?.map(emp => ({ id: emp.id, name: emp.name })) || []}
      defaultValue={[]}
      width="100%"
    />
  </Box>
</Box>


          {/* Row 3: Start and End Date */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="started_at"
                  control={control}
                  defaultValue={dayjs()}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="ended_at"
                  control={control}
                  defaultValue={dayjs()}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="End Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            
            </Box>

           

          {/* Row 4: Description and Submit */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <MultilineTextField
      name="description"
      label="Project Description"
      placeholder="Enter Project Description"
      width="100%"
      control={control}
      defaultValue=""
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      sx={{
        px: 4,
        py: 1.5,
        fontWeight: 'bold',
        borderRadius: 2,
        width: { xs: '100%', sm: 'auto' },
        alignSelf: { xs: 'center', sm: 'flex-start' }
      }}
    >
      Submit
    </Button>
  
          
          </Box>
        </Box>
      </Box>
    )}
  </div>
);

};

export default Create;


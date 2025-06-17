import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import SmallTextField from './forms/SmallTextField';
import MultilineTextField from './forms/MultilineTextField';
import SelectField from './forms/SelectField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AxiosInstance from './Axios';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import { useParams, useNavigate } from 'react-router-dom';
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

const Edit = () => {
  const { control, handleSubmit, reset } = useForm();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);




  const [projectManager, setProjectManager] = useState();
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`projects/${id}/`)
      .then((res) => {
        reset({
         
            projectName: res.data.name,
            projectDesc: res.data.description,
            projectstatus: res.data.status,
            startdate: dayjs(res.data.started_at),
            enddate: dayjs(res.data.ended_at),
            employees: Array.isArray(res.data.employees)
    ? res.data.employees.filter(e => e !== null)
    : [],
    project_manager: res.data.projectManager ?? "", 
 
          
          
        });
        setErrorMsg('');
        setSuccessMsg('Projects loaded successfully!');
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      })
      .catch(() => {
        setErrorMsg('Error loading project');
        setSuccessMsg('');
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      });



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




      AxiosInstance.get('employees/')
  .then((res) => {
    setEmployees(res.data);
    
  })
  .catch((err) => {
    console.error('Failed to fetch employees', err);
  });



  }, [id, reset]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.projectName,
      description: data.projectDesc,
      status: data.projectstatus,
      started_at: dayjs(data.startdate).format('YYYY-MM-DD'),
      ended_at: dayjs(data.enddate).format('YYYY-MM-DD'),
      projectManager: data.project_manager,
      employees: data.employees,
    };

    try {
      await AxiosInstance.put(`projects/${id}/`, payload);
      navigate('/', { state: { updated: true } }); 
    } catch {
      setErrorMsg('Failed to update project');
      setSuccessMsg('');
      setOpen(true);
    }
  };

  return (
    <div>
      {Loading ? (
        <p>Loading Data...</p>
      ) : (
        <Box sx={{ px: 2, py: 4, maxWidth: '1200px', mx: 'auto' }}>
          <Typography sx={{ fontSize: '28px', fontWeight: 'bold', mb: 3, color: 'black' }}>
            Edit Project Record
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
            onSubmit={handleSubmit(onSubmit)}
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
                  name="projectName"
                  label="Project Name"
                  placeholder="Enter Project Name"
                  control={control}
                  defaultValue=""
                  width="100%"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SelectField
                  name="projectstatus"
                  label="Project Status"
                  control={control}
                  options={projectTypeOptions}
                  defaultValue=""
                  width="100%"
                />
              </Box>
            </Box>
  
            {/* Row 2: Project Manager */}
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
      defaultValue={[]}
      options={employees?.map(emp => ({ id: emp.id, name: emp.name })) || []}
    />
  </Box>


            </Box>
  
            {/* Row 3: Start and End Date */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="startdate"
                    control={control}
                    defaultValue={dayjs()}
                    render={({ field }) => (
                      <DatePicker
                        label="Start Date"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="enddate"
                    control={control}
                    defaultValue={dayjs()}
                    render={({ field }) => (
                      <DatePicker
                        label="End Date"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
  
            {/* Row 4: Description and Submit */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MultilineTextField
                name="projectDesc"
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
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
  
};

export default Edit;

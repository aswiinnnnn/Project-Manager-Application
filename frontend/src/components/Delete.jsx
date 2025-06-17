import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Slide,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import dayjs from 'dayjs';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Delete = () => {
  const { handleSubmit } = useForm();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectData, setprojectData] = useState();
  const [loading, setloading] = useState(true);




  const submission = async () => {
    try {
      await AxiosInstance.delete(`projects/${id}/`);
      setSuccessMsg('Project deleted successfully');
      setOpen(true);
      setTimeout(() => {
        navigate('/', { state: { updated: true } });
      }, 1500);
    } catch {
      setErrorMsg('Failed to delete project');
      setOpen(true);
    }
  };





   useEffect(() => {
  AxiosInstance.get(`projects/${id}/`)
    .then((res) => {
      setprojectData(res.data)
      console.log(projectData);
      setloading(false)

      

      

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
}, [id]);



return (
  <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
    {/* Centered heading */}
    <Typography variant="h5" color="error" fontWeight="bold" align="center" gutterBottom>
      Delete Project
    </Typography>

    {/* Centered info text */}
    <Typography variant="body1" align="center" gutterBottom>
      The following project will be permanently deleted:
    </Typography>

    {/* Left-aligned project details */}
    <Box sx={{ mt: 4, textAlign: 'left' }}>
      <Typography variant="subtitle2" color="text.secondary">Project Name:   {projectData?.name || '-'}</Typography>

      <Typography variant="subtitle2" color="text.secondary">Description:  {projectData?.description || '-'}</Typography>
     

      <Typography variant="subtitle2" color="text.secondary">Status:  {projectData?.status}</Typography>
      

      
    </Box>

    {/* Centered delete button */}
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        onClick={handleSubmit(submission)}
        variant="contained"
        color="error"
        sx={{ px: 4, py: 1.5 }}
      >
        Confirm Delete
      </Button>
    </Box>

    {/* Snackbar */}
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      autoHideDuration={3000}
    >
      {successMsg ? (
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      ) : errorMsg ? (
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      ) : null}
    </Snackbar>
  </Box>
);


};

export default Delete;

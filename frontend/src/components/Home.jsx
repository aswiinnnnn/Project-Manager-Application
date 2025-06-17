import React, { useEffect, useState, useMemo } from 'react';
import AxiosInstance from './Axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import { Box, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);



  const fetchProjects = () => {
    AxiosInstance.get('projects/')
      .then((res) => {
        
        setProjects(res.data);
        setErrorMsg('');
        setLoading(false);
        setSuccessMsg('Projects loaded successfully!');
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


  const fetchManagers = () => {
    AxiosInstance.get('projectsmanager/')
      .then((res) => {
        console.log('Managers fetched:', res.data); // ✅ See data in console
        setManagers(res.data);
      })
      .catch((err) => {
        console.error('Error fetching managers:', err); // ❌ Log error if any
        setManagers([]);
      });
  };



  const fetchEmployees = () => {
    AxiosInstance.get('employees/')
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error('Error fetching employees:', err);
        setEmployees([]);
      });
  };
  
  
  

useEffect(() => {
  fetchProjects();
  fetchManagers();
  fetchEmployees(); // ✅
}, []);



  const projectTypeOptions = [
    { id: 0, name: 'NOT STARTED' },
    { id: 1, name: 'STARTED' },
    { id: 2, name: 'COMPLETED' },
    { id: 3, name: 'OPTED OUT' },
  ];
  

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      enableColumnFilter: false,
      enableSorting: false,
      size: 0,
      enableHiding: false,
      muiTableBodyCellProps: { sx: { display: 'none' } },
      muiTableHeadCellProps: { sx: { display: 'none' } },
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      header: 'Status',
      accessorFn: (row) =>
        projectTypeOptions.find(opt => opt.id === row.status)?.name || 'Unknown',
      id: 'status',
    },
    
    {
      accessorFn: (row) => {
        const manager = managers.find(m => m.id === row.projectManager);
        return manager ? manager.name : 'Not Available';
      },
      header: 'Project Manager',
      id: 'projectManager',
    },
    
    
    {
      accessorFn: (row) => {
        if (!Array.isArray(row.employees)) return 'None';
        const names = row.employees.map(empId => {
          const emp = employees.find(e => e.id === empId);
          return emp ? emp.name : null;
        }).filter(Boolean); // remove nulls
        return names.length > 0 ? names.join(', ') : 'None';
      },
      header: 'Employees',
      id: 'employees',
    },
    

    {
      accessorFn: (row) => dayjs(row.started_at).format('DD-MM-YYYY'),
      header: 'Started At',
      id: 'started_at',
    },
    {
      accessorFn: (row) => dayjs(row.ended_at).format('DD-MM-YYYY'),
      header: 'Ended At',
      id: 'ended_at',
    },
  ],  [managers,employees]);

  const table = useMaterialReactTable({
    columns,
    data: projects,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
    enableRowActions: true,
    positionActionsColumn: 'first',
    renderRowActions: ({ row }) => {
      const rowId = row.original.id || row.original.project?.id || 'unknown';
      return (
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <IconButton
            color="secondary"
            component={Link}
            to={`/edit/${rowId}`}
            disabled={rowId === 'unknown'}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            component={Link}
            to={`/delete/${rowId}`}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    },
    renderTopToolbarCustomActions: () => (
      <span style={{ fontSize: 18 }}>
        View and manage all your ongoing and completed projects.
      </span>
    ),
  });

  return (
    <div className="home">
      <h1 style={{ textAlign: 'center' }}>Project Dashboard</h1>
      {loading ? (
        <h3>Loading Your Data...</h3>
      ) : (
        <MaterialReactTable table={table} />
      )}

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
        autoHideDuration={3000}
      >
        {(successMsg || errorMsg) ? (
          <MuiAlert
            severity={successMsg ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {successMsg || errorMsg}
          </MuiAlert>
        ) : null}
      </Snackbar>
    </div>
  );
};

export default Home;

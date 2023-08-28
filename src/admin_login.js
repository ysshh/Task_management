import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import axios from 'axios';
import classnames from 'classnames';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Admin = () => {
  const [data, setData] = useState([]);
  const [users, setUser] = useState([]);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [Priority, setPriority] = useState('');
  const [auser, setAuser] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/task/get', {
        headers: {
          Authorization: token,
        },
      });
      if (response.data) {

        setData(response.data);
        console.log(response.data[0].res.fullName);

      } else {
        console.error('Error retrieving task:', response.data.error);
      }
    } catch (error) {
      console.error('Error retrieving task:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const createTaskDto = { task_name: task, description: description, priority_level: Priority ,assigned_user: auser, };
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/task/add', createTaskDto, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data) {
        setTask('');
        setDescription('');
        setPriority('');
        setAuser('');
        fetchTask('');
      } else {
        console.error('Error creating task:', response.data.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleChange = (event) => {
    setPriority(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handletaskChange = (event) => {
    setTask(event.target.value);
  };
  
  

  const handleUsers = async (event) => {
   
    try {
      const response = await axios.get('http://localhost:5000/users/get',);
      console.log(response.data);
      if (response.data) {
        
        setUser(response.data);
      } else {
        console.error('Error retrieving user:', response.data.error);
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div>
    <IconButton
        color="inherit"
        aria-label="open sidebar"
        onClick={toggleSidebar}
        edge="start"
      >
        <MenuIcon />
      </IconButton>


    <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="sidebar-users-label">Users</InputLabel>
              <Select
                labelId="sidebar-users-label"
                id="sidebar-users-select"
                value={auser}
                onClick={handleUsers}
                onChange={(event) => setAuser(event.target.value)}
                autoWidth
                label="Users"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Drawer>
    
      <Grid
        container
        justifyContent="center"
        backgroundColor= '#357ABD'
      >
        <Grid item>
          <h1>Task status</h1>
        </Grid>
      </Grid>
      <form >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          component={Link}
          to={`/`}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          {<ExitToAppRoundedIcon />}
          Logout
        </Button>

        <TextField
          label="Task Name"
          onChange={handletaskChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          onChange={handleDescriptionChange}
          fullWidth
          required
          margin="normal"
        />
        

        <div>
          <FormControl sx={{ m: 1, minWidth: 800 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Priority level</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={Priority}
              onChange={handleChange}
              autoWidth
              label="Priority level"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl sx={{ m: 1, minWidth: 800 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Users</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={auser}
              onClick={handleUsers}
              onChange={(event)=> setAuser(event.target.value)}
              autoWidth
              label="Users"
            >
              <MenuItem value="setAuser">
                <em>None</em>
              </MenuItem>
              {users.map((user) => (
               
                 <MenuItem key={user._id} value={user._id}>
               
               <TableCell>{user.email}</TableCell>
                  
                </MenuItem>
               
              
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
         
        >
          Assign
        </Button>

      </form>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Task
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  priority
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Due Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  User
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
         
            {data.map((task) => (

              <TableRow
                key={task._id}
                className={classnames({
                  'priority-high': task.priority_level === 'High',
                  'priority-medium': task.priority_level === 'Medium',
                  'priority-low': task.priority_level === 'Low',
                  overdue: new Date(task.Due_date) < new Date()
                })}
              >
                <TableCell>{task.task_name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell
                  style={{
                    backgroundColor:
                      task.priority_level === 'High'
                        ? 'red'
                        : task.priority_level === 'Medium'
                        ? 'blue'
                        : task.priority_level === 'Low'
                        ? 'green'
                        : 'inherit',
                    color:
                      task.priority_level === 'High'
                        ? 'white'
                        : task.priority_level === 'Medium'
                        ? 'white'
                        : task.priority_level === 'Low'
                        ? 'black'
                        : 'inherit',
                  }}
                >
                  {task.priority_level}
                </TableCell>
                <TableCell>{task.Due_date}</TableCell>
                
                <TableCell>{task.res.fullName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Admin;

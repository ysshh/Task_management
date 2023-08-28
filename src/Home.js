import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  TableRow,
  Paper,
  TableBody,
  Button,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

const Home = () => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:5000/task/assigned-user`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        console.error('Error retrieving tasks:', response.data.error);
      }
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  };

  const handleUpdate = async (taskId) => {
    const token = localStorage.getItem('token');
    const updatedData = editedData[taskId];

    try {
      const formattedDueDate = moment(updatedData.dueDate).toISOString();

      const response = await axios.patch(
        `http://localhost:5000/task/update/${taskId}`,
        {
          Due_date: formattedDueDate,
          comments: updatedData.comments,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data && response.data.success) {

        setData((prevData) =>
          prevData.map((task) =>
            task._id === taskId ? { ...task, Due_date: formattedDueDate, comments: updatedData.comments } : task
          )
        );
      } else {
        console.error('Error updating task:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const handleLogout = () => {
    localStorage.clear();
  };


  return (
    <div>
      <Grid container justifyContent="center" backgroundColor="skyblue">
        <Grid item>
          <h1>TASK</h1>
        </Grid>
      </Grid>
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

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Task Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Priority Level
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Due Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Comments and Notes
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Assigned User
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>

                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Details
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((task) => (
              <TableRow key={task._id}>
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
                >{task.priority_level}</TableCell>
                <TableCell>
                  {!task.Due_date && (
                    <TextField
                      label=""
                      type="datetime-local"
                      value={
                        editedData[task._id]?.dueDate
                          ? moment(editedData[task._id]?.dueDate).format('YYYY-MM-DDTHH:mm')
                          : ''
                      }
                      onChange={(e) =>
                        setEditedData((prevEditedData) => ({
                          ...prevEditedData,
                          [task._id]: {
                            ...prevEditedData[task._id],
                            dueDate: e.target.value,
                            comments: prevEditedData[task._id]?.comments || '',
                          },
                        }))
                      }
                      fullWidth
                      required
                      margin="normal"
                    />
                  )}
                  {task.Due_date}
                </TableCell>
                <TableCell>
                  {!task.comments && (
                    <TextField
                      label="Comments"
                      value={editedData[task._id]?.comments || ''}
                      onChange={(e) =>
                        setEditedData((prevEditedData) => ({
                          ...prevEditedData,
                          [task._id]: {
                            ...prevEditedData[task._id],
                            comments: e.target.value,
                            dueDate: prevEditedData[task._id]?.dueDate || '',
                          },
                        }))
                      }
                      fullWidth
                      required
                    />
                  )}
                  {task.comments}
                </TableCell>


                <TableCell>{task.res.fullName}</TableCell>
                <TableCell>
                  {!task.Due_date || !task.comments ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdate(task._id)}
                    >
                      Update
                    </Button>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/task/new/${task._id}`}
                  >
                    {<InfoIcon />}
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;

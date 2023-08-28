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
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



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
            task._id === taskId
              ? { ...task, Due_date: formattedDueDate, comments: updatedData.comments }
              : task
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

  const calculateDueDateStatus = (task) => {
    if (!task.Due_date) {
      return '';
    }

    const dueDate = moment(task.Due_date);
    const currentDate = moment();
    const daysDifference = dueDate.diff(currentDate, 'days');

    if (daysDifference < 0) {
      return 'overdue';
    } else if (daysDifference <= 3) {
      return 'approaching';
    }

    return '';
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
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Task Name
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Description
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Priority Level
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Due Date
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Comments and Notes
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Assigned User
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}></Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Details
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((task) => {
              const dueDateStatus = calculateDueDateStatus(task);
              const rowStyle =
                dueDateStatus === 'overdue'
                  ? { backgroundColor: '#ffcccc' }
                  : dueDateStatus === 'approaching'
                    ? { backgroundColor: '#fffacd' }
                    : {};

              return (
                <StyledTableRow key={task._id} style={rowStyle}>
                  <StyledTableCell>{task.task_name}</StyledTableCell>
                  <StyledTableCell>{task.description}</StyledTableCell>
                  <StyledTableCell>
                    <Button
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
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    {!task.Due_date && (
                      <TextField
                        label=""
                        type="datetime-local"
                        value={
                          editedData[task._id]?.dueDate
                            ? moment(editedData[task._id]?.dueDate).format('DD-MM-YYYY THH:mm')
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
                  </StyledTableCell>

                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>{task.res.fullName}</StyledTableCell>
                  <StyledTableCell>
                    {!task.Due_date || !task.comments ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleUpdate(task._id)}
                      >
                        Update
                      </Button>
                    ) : null}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to={`/task/new/${task._id}`}
                    >
                      {<InfoIcon />}
                      Details
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Button } from '@mui/material';

const Detail = () => {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskData = async () => {

      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/task/new/${taskId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.data && response.data.success) {
          setTaskData(response.data.data);
          setLoading(false);
        } else {
          console.error('Error retrieving tasks:', response.data.error);
        }
      } catch (error) {
        console.error('Error retrieving tasks:', error);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.patch(`http://localhost:5000/task/update/${taskId}`, {

        task_name: taskData.task_name,
        description: taskData.description,
        priority_level: taskData.priority_level,
        Due_date: taskData.Due_date
      }, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data && response.data.success) {
        setTaskData((prevData) =>
          prevData.map((task) =>
            task._id === taskId ? { ...task, } : task

          )
        );
        navigate('/Home');
      } else {
        console.error('Error updating task:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <div className='Detail'>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          taskData ? (

            <Paper elevation={3} style={{ padding: '20px' }}>
              {editMode ? (

                <form >
                  <div style={{ marginBottom: '10px' }}>
                    <label>Task Name:</label>
                    <input
                      type="text"
                      value={taskData.task_name}
                      onChange={(e) => handleInputChange('task_name', e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label>Description:</label>
                    <textarea
                      value={taskData.description}
                      onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Priority Level:</label>
                    <input
                      type="text"
                      value={taskData.priority_level}
                      onChange={(e) => setTaskData({ ...taskData, priority_level: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Due Date:</label>
                    <input
                      type="date"
                      value={taskData.due_date}
                      onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>

                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                      Save
                    </Button><br></br>
                  <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>go back</Button>

                  </div>

                </form>

              ) : (
                <div>
                  <Typography variant="h5">Task: {taskData.task_name}</Typography>
                  <Typography variant="body1">Description: {taskData.description}</Typography>
                  <Typography variant="body2">Priority: {taskData.priority_level}</Typography>
                  <Typography variant="body2">Due Date: {taskData.Due_date}</Typography>

                  <Button variant="outlined" color="primary" onClick={handleEditClick}>Edit</Button><br></br>
                  <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>go back</Button>
                </div>
              )}
            </Paper>
          ) : (
            <Typography variant="body1">Task data not available.</Typography>
          )
        )}
      </div>
    </div>
  );
};

export default Detail;

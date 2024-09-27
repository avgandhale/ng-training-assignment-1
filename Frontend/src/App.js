import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import Modal from './Modal';
import TaskForm from './TaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks/all');
        setTasks(response.data);
        setFilteredTasks(response.data); 
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const results = tasks.filter(task =>
      task.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.AssignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.Status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(results);
    setCurrentPage(1); 
  }, [searchTerm, tasks]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setCurrentTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTask = async (newTask) => {
    if (currentTask) {
      try {
        const response = await axios.put(`http://localhost:8000/tasks/update/${currentTask._id}`, newTask);
        setTasks(tasks.map(task => (task._id === currentTask._id ? response.data : task)));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/tasks/add', newTask);
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/tasks/delete/${currentTask._id}`);
      setTasks(tasks.filter(task => task._id !== currentTask._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <TaskList
        tasks={currentTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <button onClick={handleAddTask}>Add New Task</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm task={currentTask} onSave={handleSaveTask} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="modal-header">
          <h2>Delete</h2>
        </div>
        <div className="modal-body">
          <p>Do you want to delete {currentTask?.Description}?</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setIsDeleteModalOpen(false)} className="cancel">No</button>
          <button onClick={handleConfirmDelete}>Yes</button>
        </div>
      </Modal>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

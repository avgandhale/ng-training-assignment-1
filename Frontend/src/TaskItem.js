import React from 'react';
import "./App.css"
const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-details">
        <p><strong>Assigned To:</strong> {task.assignedTo}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
      </div>
      <div className="task-actions">
        <button className="edit-button" onClick={() => onEdit(task)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;

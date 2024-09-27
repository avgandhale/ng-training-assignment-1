import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSave }) => {
  const [formData, setFormData] = useState({
    AssignedTo: '',
    Status: '',
    DueDate: '',
    Priority: '',
    Comments: '',
    Description: ''
  });

  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        DueDate: task.DueDate ? new Date(task.DueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.AssignedTo) newErrors.AssignedTo = 'AssignedTo is required';
    if (!formData.Status) newErrors.Status = 'Status is required';
    if (!formData.DueDate) newErrors.DueDate = 'Due Date is required';
    if (!formData.Priority) newErrors.Priority = 'Priority is required';
    if (!formData.Description) newErrors.Description = 'Description is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formattedData = {
        ...formData,
        DueDate: new Date(formData.DueDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      onSave(formattedData);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="form-label">
        Assigned To:
        <input
          type="text"
          name="AssignedTo"
          className={`form-input ${errors.AssignedTo ? 'error-input' : ''}`}
          value={formData.AssignedTo}
          onChange={handleChange}
        />
        {errors.AssignedTo && <span className="error-text">{errors.AssignedTo}</span>}
      </label>

      <label className="form-label">
        Status:
        <input
          type="text"
          name="Status"
          className={`form-input ${errors.Status ? 'error-input' : ''}`}
          value={formData.Status}
          onChange={handleChange}
        />
        {errors.Status && <span className="error-text">{errors.Status}</span>}
      </label>

      <label className="form-label">
        Due Date:
        <input
          type="date"
          name="DueDate"
          className={`form-input ${errors.DueDate ? 'error-input' : ''}`}
          value={formData.DueDate}
          onChange={handleChange}
        />
        {errors.DueDate && <span className="error-text">{errors.DueDate}</span>}
      </label>

      <label className="form-label">
        Priority:
        <input
          type="text"
          name="Priority"
          className={`form-input ${errors.Priority ? 'error-input' : ''}`}
          value={formData.Priority}
          onChange={handleChange}
        />
        {errors.Priority && <span className="error-text">{errors.Priority}</span>}
      </label>

      <label className="form-label">
        Comments:
        <input
          type="text"
          name="Comments"
          className="form-input"
          value={formData.Comments}
          onChange={handleChange}
        />
      </label>

      <label className="form-label">
        Description:
        <input
          type="text"
          name="Description"
          className={`form-input ${errors.Description ? 'error-input' : ''}`}
          value={formData.Description}
          onChange={handleChange}
        />
        {errors.Description && <span className="error-text">{errors.Description}</span>}
      </label>

      <button type="submit" className="form-button">Save Task</button>
    </form>
  );
};

export default TaskForm

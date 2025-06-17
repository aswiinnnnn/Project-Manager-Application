import React from 'react';

const About = () => {
  return (
    <div className="about" style={{ padding: '20px' }}>
      <h1>About This Application</h1>
      <p>
        This app helps you manage and track projects easily. You can create, update,
        and delete projects, assign managers and employees, and view their status.
      </p>

      <h2>🛠️ Features</h2>
      <ul>
        <li>📋 View a list of all projects</li>
        <li>➕ Add new projects</li>
        <li>✏️ Edit existing projects</li>
        <li>🗑️ Delete projects</li>
        <li>👨‍💼 Assign project managers and employees</li>
        <li>📅 Track start and end dates</li>
      </ul>

      <h2>❓How to Use</h2>
      <ol>
      
        <li>Go to the Home page to view all projects.</li>
        <li>Use the "Create" button to create mew project and provide details.</li>
        <li>Use the “Edit” button to update project details.</li>
        <li>Use the “Delete” button to remove a project.</li>
        <li>Each project shows its status and assigned manager/employee names.</li>
      </ol>

      <p>If you face any issues, please contact support.</p>
    </div>
  );
};

export default About;

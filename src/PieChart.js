import React from 'react';
import { Pie } from 'react-chartjs-2';

const data = {
  labels: ['Red', 'Green', 'Yellow'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: ['#750000', '#36A2EB', '#FFCE56'],
    hoverBackgroundColor: ['#750000', '#36A2EB', '#FFCE56']
  }]
};

const PieChart = () => (
  <div className="graph-container">
    <h2>Pie Chart</h2>
    <Pie data={data} />
  </div>
);

export default PieChart;

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const LineGraph = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Dataset from DBpedia',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Dummy data for the sake of example
      const labels = ['2010', '2011', '2012', '2013', '2014', '2015'];
      const data = [8175133, 8272948, 8346693, 8396091, 8433806, 8463049];
  
      setGraphData(prevGraphData => ({
        ...prevGraphData,
        labels: labels,
        datasets: [{
          ...prevGraphData.datasets[0],
          data: data
        }]
      }));
    };
  
    fetchData();
  
    // Remove graphData from the dependencies array to prevent re-fetching on every render
  }, []);
  

  return (
    <div className="graph-container">
      <h3>Line Graph</h3>
      <Line data={graphData} />
    </div>
  );
};

export default LineGraph;

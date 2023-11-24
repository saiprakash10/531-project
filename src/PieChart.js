import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const PieChart = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>

        SELECT ?city ?population WHERE {
          VALUES ?city { dbr:New_York_City dbr:Los_Angeles dbr:Chicago }
          ?city dbo:populationTotal ?population .
        }
      `;
      const url = `http://dbpedia.org/sparql?query=${encodeURIComponent(query)}&format=json`;

      try {
        const response = await axios.get(url);
        const fetchedData = response.data.results.bindings;

        const labels = fetchedData.map(item => item.city.value.split('/').pop());
        const data = fetchedData.map(item => Number(item.population.value));

        setGraphData({
          labels: labels,
          datasets: [{
            ...graphData.datasets[0],
            data: data
          }]
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="graph-container">
      <h3>Pie Chart - City Populations</h3>
      <Pie data={graphData} />
    </div>
  );
};

export default PieChart;

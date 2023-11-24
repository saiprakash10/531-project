import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const BarGraph = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Population',
      backgroundColor: 'rgba(0,123,255,0.5)',
      borderColor: 'rgba(0,123,255,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(0,123,255,0.7)',
      hoverBorderColor: 'rgba(0,123,255,1)',
      data: []
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Here we would fetch the populations for multiple cities
      const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        SELECT ?city ?population WHERE {
          ?city a dbo:City ;
                dbo:populationTotal ?population .
          FILTER (?city IN (dbr:New_York_City, dbr:Los_Angeles, dbr:Chicago))
        }
        ORDER BY ?population
      `;
      const url = `http://dbpedia.org/sparql?query=${encodeURIComponent(query)}&format=json`;

      try {
        const response = await axios.get(url);
        const fetchedData = response.data.results.bindings;

        // Process fetchedData to populate labels and data for the graph
        const labels = fetchedData.map(item => item.city.value.split('/').pop()); // Extract city name
        const data = fetchedData.map(item => parseInt(item.population.value, 10));

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
  }, []); // Empty array means this effect will only run once

  return (
    <div className="graph-container">
      <h3>Bar Graph</h3>
      <Bar data={graphData} />
    </div>
  );
};

export default BarGraph;

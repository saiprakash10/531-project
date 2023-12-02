import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const LineGraph = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Victims',
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

  const endpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const auth = {
    username: process.env.REACT_APP_STARDOG_USERNAME,
    password: process.env.REACT_APP_STARDOG_PASSWORD
  };

  const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
    SELECT ?year (COUNT(DISTINCT ?victim) AS ?numberOfVictims)
    WHERE {
      ?victim rdf:type project-2:victim .
      ?victim project-2:hasYear ?year .
    }
    GROUP BY ?year
    ORDER BY DESC(?numberOfVictims)
  `;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: `${endpoint}/${dbName}/query`,
          auth: auth,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/sparql-results+json'
          },
          data: `query=${encodeURIComponent(sparqlQuery)}`
        });

        const results = response.data.results.bindings;
        const labels = results.map(result => result.year.value);
        const data = results.map(result => parseInt(result.numberOfVictims.value));

        setGraphData(prevGraphData => ({
          ...prevGraphData,
          labels: labels,
          datasets: [{
            ...prevGraphData.datasets[0],
            data: data
          }]
        }));
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="graph-container my-4 p-4">
      <h3 className="text-xl font-semibold text-center">Victims by year</h3>
      <Line data={graphData} />
    </div>
  );
};

export default LineGraph;

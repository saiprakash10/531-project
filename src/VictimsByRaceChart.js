import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const VictimsByRaceChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Victims',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const endpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;

  const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
        SELECT ?raceLabel (COUNT(DISTINCT ?victim) AS ?numberOfVictims)
        WHERE {
          ?victim rdf:type project-2:victim .
          ?victim project-2:hasRace ?race .
          BIND(
            IF(?race = project-2:B, "Black",
              IF(?race = project-2:H, "Hispanic",
                IF(?race = project-2:A, "Asian",
                  IF(?race = project-2:N, "Native",
                    IF(?race = project-2:O, "Other", "Unknown")
                  )
                )
              )
            ) AS ?raceLabel
          )
        }
        GROUP BY ?raceLabel
        ORDER BY DESC(?numberOfVictims)
      `;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: `${endpoint}/${dbName}/query`,
          auth: {
            username: username,
            password: password,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/sparql-results+json'
          },
          data: `query=${encodeURIComponent(sparqlQuery)}`
        });
        
        
        const results = response.data.results.bindings;
    
        const labels = results.map(result => result.raceLabel.value);
        const data = results.map(result => parseInt(result.numberOfVictims.value, 10));
    
        setChartData(prevChartData => ({
          labels: labels,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: data,
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    
    

    fetchChartData();
  }, []);

  return (
    <div className='graph-container my-4 p-4'>
      <h2 className="text-xl font-semibold text-center"> Number of Victims by Race</h2>
      <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
    </div>
  );
};

export default VictimsByRaceChart;

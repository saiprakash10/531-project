import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

const ScatterPlot = () => {
  const [graphData, setGraphData] = useState({
    datasets: [{
      label: 'Victims by Age',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });

  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;

  const sparqlQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
      
      SELECT ?age (COUNT(?victim) AS ?totalVictims)
      WHERE {
        ?victim rdf:type project-2:victim .
        ?victim project-2:hasDiedLike "shot" .
        ?victim project-2:hasAge ?age .
      }
      GROUP BY ?age
      ORDER BY DESC(?totalVictims)
      LIMIT 20
    `;
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: `${stardogEndpoint}/${dbName}/query`,
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

        if (response.status === 200) {
          const scatterData = response.data.results.bindings.map(binding => ({
            x: parseFloat(binding.age.value),
            y: parseFloat(binding.totalVictims.value)
          }));

          setGraphData(prevData => ({
            ...prevData,
            datasets: [{ ...prevData.datasets[0], data: scatterData }]
          }));
        } else {
          console.error('SPARQL query did not return a 200 status:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [stardogEndpoint, dbName, username, password]);

  return (
    <div className="graph-container my-4 p-4">
      <h3 className="text-xl font-semibold text-center">Scatter Plot of Victims by Age</h3>
      <Scatter data={graphData} />
    </div>
  );
};

export default ScatterPlot;

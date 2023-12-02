import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = () => {
  const [graphData, setGraphData] = useState({
    labels: ['Below 18', 'Between 18 and 60', 'Above 60'],
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

  const endpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const auth = {
    username: process.env.REACT_APP_STARDOG_USERNAME,
    password: process.env.REACT_APP_STARDOG_PASSWORD
  };
  
 

  const sparqlQuery = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

  SELECT 
    (ROUND((xsd:decimal(?countUnder18) / xsd:decimal(?total) * 100)*100)/100 AS ?percentUnder18)
    (ROUND((xsd:decimal(?countBetween) / xsd:decimal(?total) * 100)*100)/100 AS ?percentBetween18And60)
    (ROUND((xsd:decimal(?countAbove60) / xsd:decimal(?total) * 100)*100)/100 AS ?percentAbove60)
  WHERE {
    {
      SELECT (COUNT(DISTINCT ?individual) AS ?total) WHERE {
        ?individual rdf:type project-2:victim .
      }
    }
    {
      SELECT (COUNT(DISTINCT ?individualUnder18) AS ?countUnder18) WHERE {
        ?individualUnder18 rdf:type project-2:victim ;
                           project-2:hasAge ?ageString .
        BIND(xsd:integer(?ageString) AS ?age)
        FILTER(?age < 18)
      }
    }
    {
      SELECT (COUNT(DISTINCT ?individualBetween) AS ?countBetween) WHERE {
        ?individualBetween rdf:type project-2:victim ;
                           project-2:hasAge ?ageString .
        BIND(xsd:integer(?ageString) AS ?age)
        FILTER(?age >= 18 && ?age <= 60)
      }
    }
    {
      SELECT (COUNT(DISTINCT ?individualAbove60) AS ?countAbove60) WHERE {
        ?individualAbove60 rdf:type project-2:victim ;
                           project-2:hasAge ?ageString .
        BIND(xsd:integer(?ageString) AS ?age)
        FILTER(?age > 60)
      }
    }
  }
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: `${endpoint}/${dbName}/query`,
          auth: auth,
          data: `query=${encodeURIComponent(sparqlQuery)}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/sparql-results+json'
          }
        });

        if (response.status === 200) {
          const { results } = response.data;
          const data = results.bindings.map(binding => ({
            under18: parseFloat(binding.percentUnder18.value),
            between18And60: parseFloat(binding.percentBetween18And60.value),
            above60: parseFloat(binding.percentAbove60.value)
          }));

          setGraphData(prevData => ({
            ...prevData,
            datasets: [{
              ...prevData.datasets[0],
              data: [data[0].under18, data[0].between18And60, data[0].above60]
            }]
          }));
        } else {
          console.error('SPARQL query did not return a 200 status:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="graph-container my-4 p-4">
      <h3 className="text-xl font-semibold text-center">Age Distribution Pie Chart</h3>
      <Pie data={graphData} />
    </div>
  );
};

export default PieChart;

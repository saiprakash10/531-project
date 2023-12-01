import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

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

  useEffect(() => {
    const fetchData = async () => {
      // Use the proxy route for the SPARQL endpoint
      const endpointUrl = `/sparql`;

      // Your SPARQL query should be a complete and correct query string
      const query = `
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
      }`;

      try {
        const response = await axios.get(endpointUrl, {
          params: {
            query: query,
            format: 'json'
          },
          headers: {
            'Cache-Control': 'no-store'
          }
        });        console.log('Raw response:', response); // Log the raw response
  
        const results = response.data.results.bindings;
        console.log('SPARQL results:', results); // Log the results from SPARQL query
  
        const percentages = results.map(result => ({
          percentUnder18: parseFloat(result.percentUnder18.value),
          percentBetween18And60: parseFloat(result.percentBetween18And60.value),
          percentAbove60: parseFloat(result.percentAbove60.value)
        }));
        console.log('Percentages:', percentages); // Log the mapped percentages
  
        // Assuming the first result contains the data we want
        if (percentages.length > 0) {
          setGraphData(prevData => {
            const newData = {
              ...prevData,
              datasets: [{
                ...prevData.datasets[0],
                data: [
                  percentages[0].percentUnder18,
                  percentages[0].percentBetween18And60,
                  percentages[0].percentAbove60
                ]
              }]
            };
            console.log('New graph data:', newData); // Log the new state just before setting it
            return newData;
          });
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="graph-container">
      <h3>Age Distribution Pie Chart</h3>
      <Pie data={graphData} />
    </div>
  );
};

export default PieChart;

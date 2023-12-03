import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#780505',   
        '#03520c',   

      ],
      hoverBackgroundColor: [
        '#780505',  
        '#03520c', 
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
(strafter(str(?gender), '#') AS ?genders)
(COUNT(?victim) AS ?countVictims)
(ROUND((COUNT(?victim) / ?totalVictims * 100), 2) AS ?percentage)
WHERE {
?victim rdf:type project-2:victim .
?victim project-2:hasCityName ?city .
?victim project-2:hasGender ?gender .

{
  SELECT (COUNT(?individual) AS ?totalVictims) WHERE {
    ?individual rdf:type project-2:victim .
  }
}
}
GROUP BY ?gender ?totalVictims
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
            gender: binding.genders.value,
            percentage: parseFloat(binding.percentage.value)
          }));

      

          setGraphData(prevData => ({
            ...prevData,
            labels: data.map(item => item.gender),
            datasets: [{
              ...prevData.datasets[0],
              data: data.map(item => item.percentage)
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
  }, [endpoint, dbName, auth]);

  return (
    <div className="graph-container my-4 p-4">
      <h3 className="text-xl font-semibold text-center">Gender Distribution Pie Chart</h3>
      <Pie data={graphData} />
    </div>
  );
};

export default PieChart;

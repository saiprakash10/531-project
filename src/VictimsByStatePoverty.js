import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VictimsByStatePovertyChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [povertyLevel, setPovertyLevel] = useState('below-30');
  const povertyLevels = ['below-30', '30-70', 'above-70'];

  
  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;


  const buildSparqlQuery = (level) => {
    switch(level) {
      case 'below-30':
        return `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

          SELECT ?state (COUNT(?victim) AS ?countVictims)
          WHERE {
            ?victim rdf:type project-2:victim .
            ?victim project-2:hasGeographicArea ?state .
            ?victim project-2:hasPovertyRateBelow30 "true" .
          }
          GROUP BY ?state ORDER BY ?state
        `;
      case '30-70':
        return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

        SELECT ?state (COUNT(?victim) AS ?countVictims)
        WHERE {
          ?victim rdf:type project-2:victim .
          ?victim project-2:hasGeographicArea ?state .
          ?victim project-2:hasPovertyRateBetween30to70 "true" .
        }
        GROUP BY ?state ORDER BY ?state
        `;
      case 'above-70':
        return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

        SELECT ?state (COUNT(?victim) AS ?countVictims)
        WHERE {
          ?victim rdf:type project-2:victim .
          ?victim project-2:hasGeographicArea ?state .
          ?victim project-2:hasPovertyRateAbove70 "true" .
        }
        GROUP BY ?state ORDER BY ?state`;
      default:
        return 'Loading Data';
    }
  };

  const fetchData = async () => {
    const sparqlQuery = buildSparqlQuery(povertyLevel);

    try {
      const response = await axios({
        method: 'post',
        url: `${stardogEndpoint}/${dbName}/query`,
        auth: {
          username: username,
          password: password,
        },
        headers: {
          'Content-Type': 'application/sparql-query',
          'Accept': 'application/sparql-results+json',
        },
        data: sparqlQuery,
      });


      const data = response.data.results.bindings.map(binding => ({
        state: binding.state.value,
        count: parseInt(binding.countVictims.value, 10)
      }));

      setChartData({
        labels: data.map(item => item.state),
        datasets: [{
          label: 'Count of Victims with Poverty Rate {$povertyLevel}',
          data: data.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [povertyLevel]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: { 
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      }
    },
   
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Victim Count by State (Poverty Rate $(poverty.Level))'
      }
    }
  };

  return (
    <div className=' my-4 p-4'>
      <h2 className="text-xl font-semibold text-center">Victim Count by State</h2>
      <div className="my-4 ">
        <label htmlFor="povertyLevelSelect">Select Poverty Level: </label>
        <select id="povertyLevelSelect" value={povertyLevel} onChange={e => setPovertyLevel(e.target.value)}>
          {povertyLevels.map(level => (
            <option key={level} value={level}>{level.replace('-', ' to ')}</option>
          ))}
        </select>
      </div>
      <div style={{ height: '600px', width: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VictimsByStatePovertyChart;

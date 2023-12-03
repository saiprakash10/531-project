import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VictimsByStateIncomeChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [incomeLevel, setIncomeLevel] = useState('below-25');
  const incomeLevels = ['below-25', '25-50', 'above-50'];

  
  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;


  const buildSparqlQuery = (level) => {
    switch(level) {
      case 'below-25':
        return `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

          SELECT ?state (COUNT(?victim) AS ?countVictims)
          WHERE {
            ?victim rdf:type project-2:victim .
            ?victim project-2:hasGeographicArea ?state .
            ?victim project-2:hasMedianIncomeBelow25K "true" .
          }
          GROUP BY ?state ORDER BY ?state
        `;
      case '25-50':
        return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

        SELECT ?state (COUNT(?victim) AS ?countVictims)
        WHERE {
          ?victim rdf:type project-2:victim .
          ?victim project-2:hasGeographicArea ?state .
          ?victim project-2:hasMedianIncomeBetween25to50K "true" .
        }
        GROUP BY ?state ORDER BY ?state
        `;
      case 'above-50':
        return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

        SELECT ?state (COUNT(?victim) AS ?countVictims)
        WHERE {
          ?victim rdf:type project-2:victim .
          ?victim project-2:hasGeographicArea ?state .
          ?victim project-2:hasMedianIncomeAbove50K "true" .
        }
        GROUP BY ?state ORDER BY ?state`;
      default:
        return 'Loading Data';
    }
  };

  const fetchData = async () => {
    const sparqlQuery = buildSparqlQuery(incomeLevel);

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
          label: `Count of Victims with Median Income ${incomeLevel.replace('-', ' to ')}`,
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
  }, [incomeLevel]);

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
        text: `Victim Count by State (Median Income ${incomeLevel.replace('-', ' to ')})`,
      }
    }
  };

  return (
    <div className="mx-auto my-4 p-4">
    <h2 className="text-xl font-semibold text-center">Victim Count by State </h2>
      <div className="my-4">
        <label htmlFor="incomeLevelSelect">Select Income Level: </label>
        <select id="incomeLevelSelect" value={incomeLevel} onChange={e => setIncomeLevel(e.target.value)}>
          {incomeLevels.map(level => (
            <option key={level} value={level}>{level.replace('-', ' to ')}</option>
          ))}
        </select>
      </div>
      <div className='overflow-hidden my-4' style={{ height: '600px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VictimsByStateIncomeChart;

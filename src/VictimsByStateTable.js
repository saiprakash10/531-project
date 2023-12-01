import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VictimsByStateTable = () => {
  const [statesData, setStatesData] = useState([]);

  useEffect(() => {
    const fetchStatesData = async () => {
      const endpointUrl = `/sparql`;
      const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

        SELECT ?state (COUNT(DISTINCT ?victim) AS ?numberOfVictims)
        WHERE {
          ?victim project-2:hasGeographicArea ?state .
        }
        GROUP BY ?state
        ORDER BY DESC(?numberOfVictims)
      `;

      try {
        const response = await axios.get(`${endpointUrl}?query=${encodeURIComponent(query)}&format=json`);
        const results = response.data.results.bindings;

        const formattedData = results.map(result => ({
          state: result.state.value,
          numberOfVictims: parseInt(result.numberOfVictims.value.split('^^')[0], 10) // Parse the integer value
        }));

        setStatesData(formattedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
        // Optionally, handle the error state here
      }
    };

    fetchStatesData();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-center text-2xl font-semibold text-blue-600 mb-4">Number of Victims by State</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">State</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Number of Victims</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {statesData.length > 0 ? (
            statesData.map((stateData, index) => (
              <tr className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={index}>
                <td className="text-left py-3 px-4">{stateData.state}</td>
                <td className="text-left py-3 px-4">{stateData.numberOfVictims}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-3 px-4">Loading data...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VictimsByStateTable;

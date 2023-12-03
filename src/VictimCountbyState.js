import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VictimCountbyState = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [victimCount, setVictimCount] = useState(0);

  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
      SELECT ?geographicArea (COUNT(?victim) AS ?totalVictims)
      WHERE {
        ?victim rdf:type project-2:victim .
        ?victim project-2:hasDiedLike "shot" .
        ?victim project-2:hasGeographicArea ?geographicArea .
      }
      GROUP BY ?geographicArea
      ORDER BY DESC(?totalVictims)
    `;

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
        data: query,
      });

      const transformedData = response.data.results.bindings.map((binding) => ({
        geographicArea: binding.geographicArea.value,
        totalVictims: binding.totalVictims.value,
      }));
      setStates(transformedData);
    } catch (error) {
      console.error('Error fetching data from Stardog:', error);
    }
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    const stateData = states.find(s => s.geographicArea === state);
    setVictimCount(stateData ? stateData.totalVictims : 0);
  };

  return (
    <div className="my-4 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center">Explore Victim Counts by State</h2>
        <p className="text-gray-600 text-center">
          Use the dropdown below to select a state and see the number of victims in that specific area.
        </p>
      </div>
      <div className="flex items-center justify-center"> 
        <select 
          className="border border-gray-300 rounded py-2 px-4"
          onChange={handleStateChange} 
          value={selectedState}
        >
          <option value="">Select a State</option>
          {states.map((state, index) => (
            <option key={index} value={state.geographicArea}>
              {state.geographicArea}
            </option>
          ))}
        </select>
        {selectedState && (
          <div className="ml-4"> 
            <h3 className="text-lg font-bold">{`Victims in ${selectedState}:`}</h3>
            <p className="text-gray-800">{victimCount}</p>
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default VictimCountbyState;
  
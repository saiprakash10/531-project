import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RacePercentByCity = () => {
    const [cities, setCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [raceData, setRaceData] = useState(null);

  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;

  const raceLabels = {
    A: 'Asian',
    B: 'Black',
    W: 'White',
    H: 'Hispanic',
    N: 'Native',
    O: 'Others'
  };
  

  useEffect(() => {
    fetchCitiesForAutocomplete();
  }, []);

  const fetchCitiesForAutocomplete = async () => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
      SELECT DISTINCT ?city WHERE {
        ?victim rdf:type project-2:victim .
        ?victim project-2:hasCityName ?city .
      }
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

      const cityList = response.data.results.bindings.map(binding => binding.city.value);
      setSuggestions(cityList);
    } catch (error) {
      console.error('Error fetching city list for autocomplete:', error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedCity(''); 
    setRaceData(null); 
  
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, "i");
      const matches = suggestions.filter(city => city.match(regex));
      setCities(matches);
    } else {
      setCities([]);
    }
  };
  

  const onSuggestionClick = (cityName) => {
    setSearchTerm(cityName);
    setCities([]);
    setSelectedCity(cityName);
    fetchRaceData(cityName);
  };


  const fetchRaceData = async (cityName) => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
      SELECT ?race (COUNT(?victim) AS ?countVictims) WHERE {
        ?victim rdf:type project-2:victim .
        ?victim project-2:hasCityName "${cityName}" .
        ?victim project-2:hasRace ?race .
      }
      GROUP BY ?race
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

      const results = response.data.results.bindings;
      const totalVictims = results.reduce((acc, curr) => acc + parseInt(curr.countVictims.value, 10), 0);
      const racePercentages = results.reduce((acc, curr) => {
      const raceIdentifier = curr.race.value.split('#')[1]; 
      const race = raceLabels[raceIdentifier] || raceIdentifier; 
      const count = parseInt(curr.countVictims.value, 10);
      acc[race] = ((count / totalVictims) * 100).toFixed(2); 
      return acc;
    }, {});

      setRaceData(racePercentages);
    } catch (error) {
      console.error('Error fetching race data:', error);
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen my-4 p-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-center">Race Percentage by City</h2>
        <p className="mb-4">
          Use this tool to search for any U.S. city and discover the race percentage of victims. 
          Start typing the city name in the input field below, select a city from the suggestions, and view the results.
        </p>
      </div>
      <div className="w-full max-w-md mx-auto">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Enter city name"
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        {cities.length > 0 && (
          <ul className="mt-2">
            {cities.map((city, index) => (
              <li key={index} className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => onSuggestionClick(city)}>
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedCity && raceData && (
        <div className="mt-4 p-4 border rounded shadow-lg">
            <h3 className="text-lg font-bold">{selectedCity}</h3>
            <ul className="list-none mt-2">
                {Object.entries(raceData).map(([race, percentage]) => (
                    <li key={race} className="text-md mt-1">
                    {race}: {percentage}%
                    </li>
                ))}
            </ul>
        </div>
            )}
    </div>
  );
  
  
  
};  

export default RacePercentByCity;

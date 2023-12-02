import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CitySearchComponent = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCityData, setSelectedCityData] = useState(null);

  const stardogEndpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;

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
    fetchData(cityName); 
  };

  const fetchData = async (cityName) => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>
      SELECT (ROUND((COUNT(DISTINCT ?hispanicVictim) / COUNT(DISTINCT ?victim)) * 100, 2) AS ?percentageHispanic)
      WHERE {
        ?victim rdf:type project-2:victim .
        ?victim project-2:hasCityName "${cityName}" .
        BIND(IF(EXISTS { ?victim project-2:hasHispanicRacePercentageForCity ?hispanicValue }, true, false) AS ?hispanicVictim)
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

      const cityData = response.data.results.bindings.map(binding => ({
        city: cityName,
        percentageHispanic: binding.percentageHispanic.value,
      }));

      setSelectedCityData(cityData[0]);
    } catch (error) {
      console.error('Error fetching data for city:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen my-4 p-4">
      <div className="text-center">
        <h2  className="text-xl font-semibold text-center">Discover Hispanic Victim Percentage in U.S. Cities</h2>
        <p className="mb-4">
          Use this tool to search for any U.S. city and discover the percentage of Hispanic victims. 
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
      {selectedCityData && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold">{selectedCityData.city}</h3>
          <p className="text-lg">{`${selectedCityData.percentageHispanic}% of the victims in ${selectedCityData.city} are Hispanic.`}</p>
        </div>
      )}
    </div>
  );
  
  
};  

export default CitySearchComponent;
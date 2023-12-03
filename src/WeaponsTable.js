import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeaponsTable = () => {
  const [weaponsData, setWeaponsData] = useState([]);

  const endpoint = process.env.REACT_APP_STARDOG_ENDPOINT;
  const dbName = process.env.REACT_APP_STARDOG_DBNAME;
  const username = process.env.REACT_APP_STARDOG_USERNAME;
  const password = process.env.REACT_APP_STARDOG_PASSWORD;
  const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX project-2: <http://www.semanticweb.org/vchavhan/ontologies/2023/10/project-2#>

    SELECT (strafter(str(?weapon), '#') AS ?weapons) (COUNT(?victim) AS ?countVictims)
    WHERE {
      ?victim rdf:type project-2:victim .
      ?victim project-2:hasWeapon ?weapon .
    }
    GROUP BY ?weapon
    ORDER BY DESC(?countVictims)
    LIMIT 15
  `;

  useEffect(() => {
    const fetchWeaponsData = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: `${endpoint}/${dbName}/query`,
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
          const formattedData = response.data.results.bindings.map(item => ({
            weapon: item.weapons.value,
            countVictims: item.countVictims.value
          }));
          setWeaponsData(formattedData);
        } else {
          console.error('API response not successful:', response);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchWeaponsData();
  }, [endpoint, dbName, username, password, sparqlQuery]);

  return (
    <div className="cont mx-auto my-4 p-4">
      <h2 className="text-xl font-semibold text-center">Count of Victims by Weapon Held</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden my-4">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Weapon</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Number of Victims</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {weaponsData.length > 0 ? (
            weaponsData.map((weaponData, index) => (
              <tr className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={index}>
                <td className="text-left py-3 px-4">{weaponData.weapon}</td>
                <td className="text-left py-3 px-4">{weaponData.countVictims}</td>
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

export default WeaponsTable;

import React, { useState } from 'react';
import LineGraph from './LineGraph';
import BarGraph from './VictimsByRaceChart';
import PieChart from './PieChart';
import WeaponsTable from './WeaponsTable';
import VictimCountbyState from './VictimCountbyState';
import CitySearchComponent from './CitySearchComponent';
import DoughnutChart from './DoughnutChart';
import ScatterPlot from './ScatterPlot'; 
import BlackVictimDataComponent from './BlackVictimDataComponent'
import VictimsByStatePoverty from './VictimsByStatePoverty'

const Graphs = () => {
  const [currentGraph, setCurrentGraph] = useState('line');

  return (
<div className="fixed top-20 w-full z-10">
  <div className="flex justify-center gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('line')}>Victim Count by year</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('bar')}>Victim Count by Race</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('pie')}>Gender Distribution</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('doughnut')}>Age Distribution</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('scatter')}>Victims by Age</button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('table')}>Victims by State Table</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('victimData')}>Victim Count by State</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('citySearch')}>Hispanic Victims % by State</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('BlackVictim')}>Black Victims % by State</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('VictimPoverty')}>Victims By State Poverty %</button>


      </div>

      <div className="flex justify-center w-full">
        <div className="graph-container">
          {currentGraph === 'line' && <LineGraph />}
          {currentGraph === 'bar' && <BarGraph />}
          {currentGraph === 'pie' && <PieChart />}
          {currentGraph === 'doughnut' && <DoughnutChart />}
          {currentGraph === 'scatter' && <ScatterPlot />} 
          {currentGraph === 'table' && <WeaponsTable />}
          {currentGraph === 'victimData' && <VictimCountbyState />}
          {currentGraph === 'citySearch' && <CitySearchComponent />} 
          {currentGraph === 'BlackVictim' && <BlackVictimDataComponent />} 
          {currentGraph === 'VictimPoverty' && <VictimsByStatePoverty />} 

        </div>
      </div>
    </div>
  );
}

export default Graphs;

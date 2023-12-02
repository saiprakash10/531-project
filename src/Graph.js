import React, { useState } from 'react';
import LineGraph from './LineGraph';
import BarGraph from './VictimsByRaceChart';
import PieChart from './PieChart';
import VictimsByStateTable from './VictimsByStateTable';
import VictimDataComponent from './VictimDataComponent';
import CitySearchComponent from './CitySearchComponent';
import DoughnutChart from './DoughnutChart';
import ScatterPlot from './ScatterPlot'; 

const Graphs = () => {
  const [currentGraph, setCurrentGraph] = useState('line');

  return (
<div className="fixed top-20 w-full z-10">
  <div className="flex justify-center gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('line')}>Line Graph</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('bar')}>Bar Graph</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('pie')}>Pie Chart</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('doughnut')}>Doughnut Chart</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('scatter')}>Scatter Plot</button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('table')}>Victims by State Table</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('victimData')}>Victim by State Dropdown</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('citySearch')}>City Search</button>
      </div>

      <div className="flex justify-center w-full">
        <div className="graph-container">
          {currentGraph === 'line' && <LineGraph />}
          {currentGraph === 'bar' && <BarGraph />}
          {currentGraph === 'pie' && <PieChart />}
          {currentGraph === 'doughnut' && <DoughnutChart />}
          {currentGraph === 'scatter' && <ScatterPlot />} 
          {currentGraph === 'table' && <VictimsByStateTable />}
          {currentGraph === 'victimData' && <VictimDataComponent />}
          {currentGraph === 'citySearch' && <CitySearchComponent />} 
        </div>
      </div>
    </div>
  );
}

export default Graphs;

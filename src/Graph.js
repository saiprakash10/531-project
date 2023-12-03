import React, { useState } from 'react';
import LineGraph from './LineGraph';
import BarGraph from './VictimsByRaceChart';
import PieChart from './PieChart';
import WeaponsTable from './WeaponsTable';
import VictimCountbyState from './VictimCountbyState';
import DoughnutChart from './DoughnutChart';
import ScatterPlot from './ScatterPlot'; 
import VictimsByStatePoverty from './VictimsByStatePoverty'
import VictimsByMedianIncome from './VictimsByMedianIncome'
import RacePercentByCity from './RacePercentByCity'


const Graphs = () => {
  const [currentGraph, setCurrentGraph] = useState('line');

  

  return (
<div className="fixed top-20 w-full">
  <div className="flex justify-center gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('line')}>Victim Count by year</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('bar')}>Victim Count by Race</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('pie')}>Gender Distribution</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('doughnut')}>Age Distribution</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('scatter')}>Victims by Age</button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('table')}>Weapon Table</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('victimData')}>Victim Count by State</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('VictimPoverty')}>Victims By State Poverty %</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('income')}>Victims By State Median Income Level</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('RacePercentByCity')}>Victim's Race Percentage by City</button>
      </div>

      <div className="max-h-[600px] w-full  z-10 overflow-y-auto">
        <div className="flex justify-center gap-2">
          {currentGraph === 'line' && <LineGraph />}
          {currentGraph === 'bar' && <BarGraph />}
          {currentGraph === 'pie' && <PieChart />}
          {currentGraph === 'doughnut' && <DoughnutChart />}
          {currentGraph === 'scatter' && <ScatterPlot />} 
          {currentGraph === 'table' && <WeaponsTable />}
          {currentGraph === 'victimData' && <VictimCountbyState />}
          {currentGraph === 'VictimPoverty' && <VictimsByStatePoverty />} 
          {currentGraph === 'income' && <VictimsByMedianIncome />} 
          {currentGraph === 'RacePercentByCity' && <RacePercentByCity />} 
        </div>
      </div>

    </div>
  );
}

export default Graphs;

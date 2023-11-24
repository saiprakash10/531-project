import React, { useState } from 'react';
import LineGraph from './LineGraph';
import BarGraph from './BarGraph';
import PieChart from './PieChart';


const Graphs = () => {
  const [currentGraph, setCurrentGraph] = useState('line');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCurrentGraph('line')}>Line Graph</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('bar')}>Bar Graph</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setCurrentGraph('pie')}>Pie Chart</button>
      </div>

      <div className="flex justify-center w-full">
        <div className="graph-container">
        {currentGraph === 'line' && <LineGraph />}
        {currentGraph === 'bar' && <BarGraph />}
        {currentGraph === 'pie' && <PieChart />}
        </div>
      </div>
    </div>
  );
}

export default Graphs;

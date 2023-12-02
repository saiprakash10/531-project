import React from 'react';

const HomePage = () => {
  return (
    <main className="max-w-6xl mx-auto my-5 p-5">
      <header className="text-center my-10">
        <h1 className="text-4xl font-bold mb-6">Police Killings Visualization</h1>
        
      </header>

      <p className="text-xl text-gray-700 my-5">
          Explore data-driven insights into police killings across the United States.
          Understand the patterns and examine the circumstances of these incidents through interactive visualizations.
        </p>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">Historical Context</h2>
        <p className="text-gray-700 mb-6">
          The United States has a complex history with law enforcement-related fatalities, with communities of color being disproportionately affected. 
          This platform seeks to shed light on these incidents, providing a historical perspective that contextualizes contemporary data.
        </p>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">Statistical Overview</h2>
        <p className="text-gray-700">
          Analyses of fatal police shooting rates in the United States indicate persistent high levels of fatalities, year over year.
          Compilations from various databases reveal stark disparities when dissected by race and ethnicity, hinting at systemic issues within law enforcement practices.
        </p>
      </section>

  

      <footer className="my-10">
      </footer>
    </main>
  );
}

export default HomePage;

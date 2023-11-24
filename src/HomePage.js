import React from 'react';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Police Killings Visualization</h1>
      <p className="text-lg text-gray-700 mb-4">
        This site is dedicated to providing visual insights into police killings across the country.
        Here, you can explore various data-driven graphics and charts that help to understand the patterns and circumstances of these incidents.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">Historical Context</h2>
      <p className="text-gray-700 mb-4">
        The United States has a long history of law enforcement-related deaths. This issue is particularly pronounced in communities of color. African Americans, for example, have been disproportionately affected by police violence compared to their white counterparts.
      </p>
      
      {/* ... Additional sections ... */}
      
      <h2 className="text-2xl font-semibold mb-3">Statistical Overview</h2>
      <p className="text-gray-700 mb-4">
        The rate of fatal police shootings in the United States shows significant numbers. According to various databases tracking police shootings, there are consistently high numbers of fatalities each year. These databases also highlight disparities based on race and ethnicity.
      </p>
      
      {/* ... Additional sections ... */}
      
      {/* Consider breaking down the content into components like StatisticalOverview, RacialDisparities, etc. */}

      {/* Visualization Components Placeholder */}
      <div className="my-10">
        {/* Insert your data visualization components here */}
      </div>
    </div>
  );
}

export default HomePage;

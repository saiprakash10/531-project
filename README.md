# 531-Project

This React.js app visualizes data using react-chartjs-2, querying RDF data hosted on Stardog cloud with SPARQL for data representation.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have `node` and `npm` installed.
- You have a Stardog cloud instance accessible.
- You have set up your `.env` file based on the `.env.example` provided.

## Setting Up

To set up the project, follow these steps:

1. Clone the repository:
 ```shell
 git clone https://your-repository-url-here
  ```
2. Navigate to the project directory:
 ```shell
 cd 531-project
 ```
3. Install dependencies:
  ```shell
   npm install
   ```
4. Set up your .env file with the correct Stardog cloud details:
  ```shell
  REACT_APP_STARDOG_ENDPOINT=<Your Stardog Endpoint>
  REACT_APP_STARDOG_DBNAME=<Your Database Name>
  REACT_APP_STARDOG_USERNAME=<Your Stardog Username>
  REACT_APP_STARDOG_PASSWORD=<Your Stardog Password>
   ```
  Make sure to replace the placeholder values with your actual Stardog cloud instance details.

5. Running the Application
   To run the application, execute:
  ```shell
   npm start
   ```

This will start the development server and open the application in your default web browser. If it doesn't open automatically, you can visit http://localhost:3000 to view it.

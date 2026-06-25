import { useState } from "react";

import "./styles.css";

import EnergyMap from "./components/EnergyMap";
import FilterPanel from "./components/FilterPanel";
import StoryCard from "./components/StoryCard";

function App() {

  // memory
  const [selectedCountry, setSelectedCountry] = useState(null); // keep track of what coutnry been clicked
  const [searchCountry, setSearchCountry] =  useState(""); // not working
  const [resetCounter, setResetCounter] = useState(0); //

  return (
    <div className="app">

      <header className="header">
        <h1>Europe</h1>
        <p> Map </p>
      </header>

      <main className="dashboard">

        <FilterPanel
          searchCountry={searchCountry}
          setSearchCountry={setSearchCountry}
        />

        <div className="map-container">

          <div className="map-toolbar">

            <button
              className="reset-btn"
              onClick={() => {

                setSelectedCountry(null);

                setResetCounter(
                  prev => prev + 1
                );

              }}
            >
              Reset View
            </button>

          </div>

          <EnergyMap
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            searchCountry={searchCountry}
            resetCounter={resetCounter}
          />

          <div className="legend">

            <div className="legend-item">

              <span className="legend-blue"></span>

              <span>
                Available Countries
              </span>

            </div>

            <div className="legend-item">

              <span className="legend-yellow"></span>

              <span>
                Selected Country
              </span>

            </div>

          </div>

        </div>

        <StoryCard
          country={selectedCountry}
        />

      </main>

    </div>
  );
}

export default App;
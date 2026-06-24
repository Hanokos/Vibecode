export default function FilterPanel({
  searchCountry,
  setSearchCountry
}) {

  return (

    <div className="panel">

      <h2>Filters</h2>

      <input
        type="text"
        placeholder="Search country..."
        value={searchCountry}
        onChange={(e) =>
          setSearchCountry(e.target.value)
        }
      />

      <select>
        <option>All Countries</option>
      </select>

      <select>
        <option>All Energy Types</option>
      </select>

      <input
        type="range"
        min="2000"
        max="2025"
      />

    </div>

  );
}
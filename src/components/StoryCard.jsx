export default function StoryCard({
  country
}) {

  return (

    <div
      key={country || "default"}
      className="panel story-card"
    >

      <div className="story-header">

        <div className="story-badge">

          {country
            ? "SELECTED COUNTRY"
            : "EXPLORE EUROPE"}

        </div>

        <h2>

          {country
            ? country.toUpperCase()
            : "EUROPE"}

        </h2>

      </div>

      <div className="story-content">

        <p>

          {country
            ? "Energy profile coming next. Future energy production, sustainability indicators and renewable infrastructure can be explored here."
            : "Click a country on the map to begin exploring Europe's energy landscape."}

        </p>

      </div>

      <div className="story-footer">

        <div>

          <span>
            Status
          </span>

          <strong>
            Active
          </strong>

        </div>

        <div>

          <span>
            Updated
          </span>

          <strong>
            2025
          </strong>

        </div>

      </div>

    </div>

  );
}
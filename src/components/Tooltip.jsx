export default function Tooltip({ country }) {

  return (
    <div className="panel">

      <h2>{country || "Hover Country"}</h2>

      <p>
         Data
      </p>

    </div>
  );
}
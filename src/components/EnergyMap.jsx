import { useEffect, useRef } from "react"; // Get React tools
import * as d3 from "d3"; // Import the D3 library

export default function EnergyMap({ // React map component
  selectedCountry,
  setSelectedCountry,
  resetCounter
}) {

  const svgRef = useRef(); // Connect React SVG to D3

  useEffect(() => {

    async function drawMap() {

      // Load the europe geojson file
      const europeData = await d3.json("/custom.geojson");

      // Select the SVG and clear any old map
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Get current SVG size for responsive scaling
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;

      // Set the SVG camera/view area
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      // Remove old tooltip before creating a new one
      d3.select(".tooltip").remove();

      // Create a floating tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip");

      // Convert latitude/longitude into coordinates for screen
      const projection = d3
        .geoMercator()
        .fitExtent(
          [
            [50, 50],
            [width - 50, height - 50]
          ],
          europeData
        );

      // Convert geojson coordinates into SVG paths
      const pathGenerator = d3.geoPath(projection);

      // Create one SVG path for every country
      svg
        .selectAll("path")
        .data(europeData.features)
        .join("path")

        // Draw the country shape
        .attr("d", pathGenerator)

        // Selected country becomes yellow
        .attr("fill", d =>
          selectedCountry === d.properties.name
            ? "#ffb703"
            : "#8ecae6"
        )

        // White borders between countries
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)

        // Show pointer cursor on hover
        .style("cursor", "pointer")

        // Mouse enters a country
        .on("mouseover", function (event, d) {

          // Highlight country if not already selected
          if (
            selectedCountry !==
            d.properties.name
          ) {

            d3.select(this)
              .transition()
              .duration(150)
              .attr("fill", "#ffd166");
          }

          // Show tooltip with country name
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.properties.name}</strong>`
            );

        })

        // Move tooltip with mouse
        .on("mousemove", function (event) {

          tooltip
            .style(
              "left",
              event.pageX + 15 + "px"
            )
            .style(
              "top",
              event.pageY - 20 + "px"
            );

        })

        // Mouse leaves the country
        .on("mouseout", function (event, d) {

          // Change colour back if not selected
          if (
            selectedCountry !==
            d.properties.name
          ) {

            d3.select(this)
              .transition()
              .duration(150)
              .attr("fill", "#8ecae6");
          }

          // Hide tooltip
          tooltip.style("opacity", 0);

        })

        // User clicks a country
        .on("click", function (event, d) {

          // Save selected country in React state
          setSelectedCountry(
            d.properties.name
          );

          // Get country size and position
          const bounds = pathGenerator.bounds(d);

          const dx = bounds[1][0] - bounds[0][0];
          const dy = bounds[1][1] - bounds[0][1];

          const x = (bounds[0][0] + bounds[1][0]) / 2;
          const y = (bounds[0][1] + bounds[1][1]) / 2;

          // Calculate zoom level
          const scale =
            Math.max(
              1,
              Math.min(
                8,
                0.8 /
                Math.max(
                  dx / width,
                  dy / height
                )
              )
            );

          // Animate zoom into selected country
          svg
            .transition()
            .duration(1000)
            .attr(
              "viewBox",
              `${x - width / (2 * scale)}
               ${y - height / (2 * scale)}
               ${width / scale}
               ${height / scale}`
            );

        });

    }

    // Draw the map when component loads
    drawMap();

    // Redraw map if browser window changes size
    window.addEventListener(
      "resize",
      drawMap
    );

    // Remove resize listener when component is destroyed
    return () => {

      window.removeEventListener(
        "resize",
        drawMap
      );

    };

  }, [
    selectedCountry,
    setSelectedCountry,
    resetCounter
  ]); // Redraw map when these values change

  // React creates the SVG that D3 draws inside
  return (
    <svg
      ref={svgRef}
      style={{
        width: "100%",
        height: "100%"
      }}
    />
  );
}
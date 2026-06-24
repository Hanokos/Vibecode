import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function EnergyMap({
  selectedCountry,
  setSelectedCountry,
  resetCounter
}) {

  const svgRef = useRef();

  useEffect(() => {

    async function drawMap() {

      const europeData =
        await d3.json("/custom.geojson");

      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();

      const width =
        svgRef.current.clientWidth;

      const height =
        svgRef.current.clientHeight;

      svg.attr(
        "viewBox",
        `0 0 ${width} ${height}`
      );

      d3.select(".tooltip").remove();

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip");

      const projection = d3
        .geoMercator()
        .fitExtent(
          [
            [50, 50],
            [width - 50, height - 50]
          ],
          europeData
        );

      const pathGenerator =
        d3.geoPath(projection);

      svg
        .selectAll("path")
        .data(europeData.features)
        .join("path")

        .attr("d", pathGenerator)

        .attr("fill", d =>
          selectedCountry === d.properties.name
            ? "#ffb703"
            : "#8ecae6"
        )

        .attr("stroke", "white")

        .attr("stroke-width", 1.5)

        .style("cursor", "pointer")

        .on("mouseover", function (event, d) {

          if (
            selectedCountry !==
            d.properties.name
          ) {

            d3.select(this)
              .transition()
              .duration(150)
              .attr("fill", "#ffd166");
          }

          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.properties.name}</strong>`
            );

        })

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

        .on("mouseout", function (event, d) {

          if (
            selectedCountry !==
            d.properties.name
          ) {

            d3.select(this)
              .transition()
              .duration(150)
              .attr("fill", "#8ecae6");
          }

          tooltip.style("opacity", 0);

        })

        .on("click", function (event, d) {

          setSelectedCountry(
            d.properties.name
          );

          const bounds =
            pathGenerator.bounds(d);

          const dx =
            bounds[1][0] - bounds[0][0];

          const dy =
            bounds[1][1] - bounds[0][1];

          const x =
            (bounds[0][0] + bounds[1][0]) / 2;

          const y =
            (bounds[0][1] + bounds[1][1]) / 2;

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

    drawMap();

    window.addEventListener(
      "resize",
      drawMap
    );

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
  ]);

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
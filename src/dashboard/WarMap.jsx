import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function WarMap({ attackNodes, beams }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* ================= WORLD MAP ================= */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#0f172a"
                stroke="#1f2937"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#111827", outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>

        {/* ================= CORE NODE ================= */}
        <Marker coordinates={[0, 0]}>
          <circle
            r={8}
            fill="#00F5FF"
            style={{
              animation: "pulse 2s infinite"
            }}
          />
        </Marker>

        {/* ================= ATTACK NODES ================= */}
        {attackNodes.map((node) => (
          <Marker key={node.id} coordinates={node.coordinates}>
            <circle
              r={6}
              fill="#FF3B3B"
              style={{
                animation: "pulse 1.5s infinite"
              }}
            />
          </Marker>
        ))}

        {/* ================= ATTACK BEAMS ================= */}
        {beams.map((beam) => (
          <Line
            key={beam.id}
            from={beam.from}
            to={beam.to}
            stroke="#FF3B3B"
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              animation: "beamFlash 1s ease-out"
            }}
          />
        ))}
      </ComposableMap>
    </div>
  );
}
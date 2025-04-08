import React from "react";

type ColorBarProps = {
  min: number;
  max: number;
  width?: string;
  height?: string;
  gradient?: string; // e.g. "linear-gradient(to right, blue, red)"
};

const ColorBar: React.FC<ColorBarProps> = ({
  min,
  max,
  width = "50%",
  height = "20px",
  ticks = 20,
  gradient = "linear-gradient(to right, rgb(0,0,255), rgb(255,0,0))"

}) => {
    const step = (max - min) / (ticks - 1);
      const tickValues = Array.from({ length: ticks }, (_, i) => min + i * step);
  return (
    <div style={{ width }}>
          {/* Color bar */}
          <div
            style={{
              height,
              background: gradient,
              border: "1px solid #ccc",
              borderRadius: "4px",
              position: "relative"
            }}
          />

          {/* Ticks */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              marginTop: "4px"
            }}
          >
            {tickValues.map((val, i) => (
              <span key={i} className="h6 text-dark">
                {Math.round(val)}
              </span>
            ))}
          </div>
        </div>
  );
};

export default ColorBar;
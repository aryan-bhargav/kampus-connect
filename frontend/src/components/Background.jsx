import React from "react";

const Background = () => {
  return (
    <div className="absolute inset-0 bg-black">
      {/* Grid using CSS Gradients */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Optional Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)
          `,
        }}
      ></div>
    </div>
  );
};

export default Background;

import React from "react";

const Colors = ({ colors, updateSelectedColor }) => {
  const colorButtons = colors.map((color) => (
    <button
      key={color}
      value={color}
      className={"colorpicker btn-peg btn-" + color}
      onClick={() => updateSelectedColor(color)}
    />
  ));

  return <div className="colorpicker">{colorButtons}</div>;
};

export default Colors;

import React from "react";

const Pegs = (keys) => {
  let pegs = keys.keyPegs.map((peg, index) => (
    <span key={index} className={"key-peg key-" + peg} />
  ));

  for (let i = pegs.length; i < 4; i++) {
    pegs.push(<span key={i} className={"key-peg"} />);
  }

  return <div className="key-pegs">{pegs}</div>;
};

export default Pegs;

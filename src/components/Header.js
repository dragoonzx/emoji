import React from "react";

import Emoji from "./Emoji";

const Header = ({ children, requireEmotion }) => (
  <header className="my2">
    <h2
      style={{
        position: "absolute",
        left: "10vw",
        top: "45vh",
        margin: "auto",
        transform: "scale(5)"
      }}
    >
      <Emoji label="grin" value={requireEmotion} />
    </h2>
  </header>
);

export default Header;


import React from "react";

function NavBar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>💸 Expense Splitter</h2>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "0 0 10px 10px"
  },
  logo: {
    margin: 0
  }
};

export default NavBar;

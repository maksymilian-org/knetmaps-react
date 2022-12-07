import React, { FC } from "react";
import Graph from "./components/graph";
import styles from "./App.module.scss";

const App: FC<{ config: any }> = ({ config }) => {
  return (
    <div className={ styles.root }>
      <header className={ styles.header }>Header</header>
      <Graph />
    </div>
  );
};

export default App;

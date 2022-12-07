import React, { FC } from "react";
import { useGraph } from "./useGraph";
import styles from './Graph.module.scss';

const Graph: FC = () => {
  const { containerRef } = useGraph();

  return <div className={styles.root} ref={containerRef}></div>;
};

export default Graph;

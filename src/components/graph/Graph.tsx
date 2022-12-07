import React, { FC } from "react";
import { useGraph } from "./useGraph";
import styles from './Graph.module.scss';

const Graph: FC = (props) => {
  const { text, containerRef } = useGraph();

  return <div className={styles.root} ref={containerRef}>{text}</div>;
};

export default Graph;

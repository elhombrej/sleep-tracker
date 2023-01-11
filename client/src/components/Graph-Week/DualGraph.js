import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  ResponsiveContainer,
} from "recharts";

export default function DualGraph() {
  const ranges = useSelector((state) => state.session);
  console.log("ranges", ranges);
  const [opacity, setOpacity] = useState({
    summary_light_min: 1,
    summary_deep_min: 1,
    summary_rem_min: 1,
    summary_awake_min: 1,
    efficiency: 1,
  });

  const handleClick = useCallback(
    (event) => {
      const { dataKey } = event;
      const updated = opacity[dataKey] === 0 ? 1 : 0;
      setOpacity({ ...opacity, [dataKey]: updated });
    },
    [opacity, setOpacity]
  );

  const handleReset = useCallback(() => {
    setOpacity((opacity) => {
      let updated = {};
      Object.keys(opacity).forEach((o) => {
        updated[o] = 1;
      });
      return { ...opacity, ...updated };
    });
  }, [setOpacity]);

  const getColor = (k) => {
    const green = "#58C0A1";
    const teal = "#53C2E2";
    const blue = "#5597DE";
    const orange = "#F2B35B";
    const red = "#F16D64";
    if (k === "efficiency") {
      return green;
    }
    if (k === "summary_deep_min") {
      return teal;
    }
    if (k === "summary_light_min") {
      return blue;
    }
    if (k === "summary_rem_min") {
      return orange;
    }
    if (k === "summary_awake_min") {
      return red;
    }
  };

  const lines = () => {
    const uniqueKeys = Object.keys(ranges[0]).filter((item) =>
      [
        "summary_light_min",
        "summary_deep_min",
        "summary_rem_min",
        "summary_awake_min",
        "efficiency",
      ].includes(item)
    );

    return uniqueKeys.map((k) => {
      return (
        <Line
          connectNulls
          type="monotone"
          stroke={getColor(k)}
          strokeWidth={1.5}
          strokeOpacity={opacity[k]}
          name={k.replace(/_/g, " ")}
          dataKey={k}
          activeDot={{ r: 5 }}
        />
      );
    });
  };

  return (
    <div>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          width={500}
          height={400}
          data={ranges}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            itemStyle={{ textTransform: "capitalize", textAlign: "left" }}
            content={"efficiency"}
          />
          <Legend onClick={handleClick} />
          {ranges?.length && lines()}
        </LineChart>
      </ResponsiveContainer>
      <button onClick={handleReset}>Reset graph</button>
    </div>
  );
}

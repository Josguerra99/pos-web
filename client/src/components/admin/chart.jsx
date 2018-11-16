import React from "react";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import LineChart from "recharts/lib/chart/LineChart";
import Line from "recharts/lib/cartesian/Line";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import Legend from "recharts/lib/component/Legend";

const data = [
  { name: "6", Visits: 2200, Orders: 3400 },
  { name: "7", Visits: 1280, Orders: 2398 },
  { name: "8", Visits: 5000, Orders: 4300 },
  { name: "9", Visits: 4780, Orders: 2908 },
  { name: "10", Visits: 5890, Orders: 4800 },
  { name: "11", Visits: 4390, Orders: 3800 },
  { name: "12", Visits: 4490, Orders: 4300 }
];

function SimpleLineChart() {
  return (
    // 99% per https://github.com/recharts/recharts/issues/172
    <ResponsiveContainer width="99%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Visits" stroke="#82ca9d" />
        <Line
          type="monotone"
          dataKey="Orders"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SimpleLineChart;

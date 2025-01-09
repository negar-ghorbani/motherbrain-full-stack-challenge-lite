import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { fetchFundingRounds } from "./api";

const App = () => {
  const [fundingData, setFundingData] = useState<
    { name: string; amount: number }[]
  >([]);

  useEffect(() => {
    const loadFundingData = async () => {
      try {
        const data = await fetchFundingRounds();
        setFundingData(data);
      } catch (error) {
        console.error("Error fetching funding rounds:", error);
      }
    };

    loadFundingData();
  }, []);

  const chartData = {
    labels: fundingData.map(item => item.name),
    datasets: [
      {
        label: "Funding Amounts",
        data: fundingData.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <h1>Funding Rounds Chart</h1>
      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default App;

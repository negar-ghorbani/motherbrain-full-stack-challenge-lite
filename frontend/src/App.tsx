import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { fetchTop15FundingRounds, fetchFundingRoundsTimeline } from "./api";
import 'chartjs-adapter-moment';


const App = () => {
  const [top15FundingData, setTop15FundingData] = useState<
    { name: string, date: string; amount: number }[]
  >([]);

  const [fundingDataTimeline, setFundingDataTimeline] = useState<
    { date: string; amount: number }[]
  >([]);

  useEffect(() => {
    const loadFundingData = async () => {
      try {
        const top15Data = await fetchTop15FundingRounds();
        setTop15FundingData(top15Data);

        const fundingRoundsTimeline = await fetchFundingRoundsTimeline();
        setFundingDataTimeline(fundingRoundsTimeline);
      } catch (error) {
        console.error("Error fetching funding rounds:", error);
      }
    };

    loadFundingData();
  }, []);

  const top15ChartData = {
    labels: top15FundingData.map(item => `${item.name} (${item.date})`),
    datasets: [
      {
        label: "Top 15 Funding Amounts",
        data: top15FundingData.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const timelineChartData = {
    labels: fundingDataTimeline.map(item => item.date),
    datasets: [
      {
        label: "Funding Amounts",
        data: fundingDataTimeline.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const formatAmount = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)} B`; // Format billions
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} M`; // Format millions
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)} K`; // Format thousands
    }
    return value; // Default format
  };

  const top15ChartOptions = {
    scales: {
      y: {
        min: Math.min(...top15ChartData.datasets[0].data) * 0.99,
        max: Math.max(...top15ChartData.datasets[0].data) * 1.01,
        ticks: {
          callback: formatAmount,
        },
      },
    },
  };

  const timelineOptions = {
    scales: {
      y: {
        min: Math.min(...timelineChartData.datasets[0].data) * 0.99,
        max: Math.max(...timelineChartData.datasets[0].data) * 1.01,
        ticks: {
          callback: formatAmount,
        },
      },
      x: {
        type: 'time',
        ticks: {
          maxTicksLimit: 20,
          autoSkip: true,
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "start" }}>
      <h1>Assignment</h1>
      <p>Your task is to show two charts on this page:</p>
      <p>
        The first chart should show the biggest 15 funding rounds from the DB
        sorted by amount, showing the round name and date (hint: date
        information exists in the DB but you may need to adjust prisma schema to
        use it).
      </p>
      <p>
        The second chart should show the timeline of all funding rounds from the
        DB using the date for x-axis and the amount for y-axis.
      </p>
      <p>
        The database for this assignment is an SQLite db that you can find in:
        <pre>backend/prisma/dev.db</pre>
      </p>

      <h1>Charts</h1>
      {/* <p>This is a scaffold to get you started.</p> */}
      {/* <Chart type="bar" data={chartData} /> */}

      <div>
        <h2>Top 15 Funding rounds chart</h2>
        <Chart type="bar" data={top15ChartData} options={top15ChartOptions} />
      </div>
      <div>
        <h2>Timeline chart</h2>
        <Chart type="line" data={timelineChartData} options={timelineOptions} />
      </div>
    </div>
  );
};

export default App;

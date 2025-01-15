import axios from "axios";

const API_URL = "http://localhost:3000";

export const fetchTop15FundingRounds = async () => {
  const response = await axios.get(`${API_URL}/funding-rounds/top15`);
  return response.data;
};

export const fetchFundingRoundsTimeline = async () => {
  const response = await axios.get(`${API_URL}/funding-rounds/timeline`);
  return response.data;
};

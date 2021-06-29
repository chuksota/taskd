const getScore = async () => {
  const res = await fetch("/productivity-score");
  return await res.json();
};

const updateScore = async (productivityScore) => {
  const res = await fetch("/productivity-score", {
    method: "PUT",
    body: JSON.stringify({ productivityScore }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const getLeaderboard = async () => {
  const res = await fetch("/leaderboard")

  return await res.json()
}

export { getScore, updateScore, getLeaderboard };

// scripts/race.js
const TOKEN = 'YOUR_USER_JWT_TOKEN';
const SKILL_ID = 'react';

async function runRaceTest() {
  console.log('Firing 10 concurrent endorsement requests...');

  // Create 10 simultaneous fetch promises
  const requests = Array.from({ length: 10 }).map(() =>
    fetch(`http://localhost:5000/api/skills/${SKILL_ID}/endorse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    })
  );

  // Wait for all requests to finish in parallel
  const responses = await Promise.all(requests);

  // Count response status codes
  const statusCounts = responses.reduce((acc, res) => {
    acc[res.status] = (acc[res.status] || 0) + 1;
    return acc;
  }, {});

  console.log('Results:', statusCounts);
  // Expected Output: { '200': 1, '400': 9 }
}

runRaceTest();
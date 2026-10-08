// scripts/race.js
// Usage (from the server folder, with the API running locally): node scripts/race.js
// Sends 10 endorse requests at the same time from ONE user.
// Correct result: one 200, nine 409s, and the count goes up by exactly 1.
import 'dotenv/config';
 
const API = process.env.API_URL || 'http://localhost:5000';
const EMAIL = process.env.RACE_EMAIL || 'user1@example.com'; // seeded visitor
const PASSWORD = process.env.RACE_PASSWORD || 'UserPassword123!'; // seeded visitor password
const SKILL_ID = process.env.RACE_SKILL_ID || 'SKL-0006'; // must be a skill this user has NOT endorsed
const REQUESTS = 10;
 
async function login() {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  const { token } = await res.json();
  return token;
}
 
async function getEndorsements() {
  const res = await fetch(`${API}/api/skills/${SKILL_ID}`);
  if (!res.ok) throw new Error(`Could not load ${SKILL_ID} (${res.status})`);
  const body = await res.json();
  return (body.data ?? body).endorsements;
}
 
async function runRaceTest() {
  const token = await login();
  const before = await getEndorsements();
  console.log(`Skill ${SKILL_ID} has ${before} endorsements before the test.`);
  console.log(`Firing ${REQUESTS} concurrent endorse requests as ${EMAIL}...`);
 
  // Start all requests at once, then wait for every one to finish
  const responses = await Promise.all(
    Array.from({ length: REQUESTS }, () =>
      fetch(`${API}/api/skills/${SKILL_ID}/endorse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
    )
  );
 
  const statusCounts = {};
  for (const res of responses) {
    statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;
  }
 
  const after = await getEndorsements();
  console.log('Status codes:', statusCounts);
  console.log(`Endorsements after: ${after} (change: ${after - before})`);
 
  const passed = statusCounts[200] === 1 && statusCounts[409] === REQUESTS - 1 && after - before === 1;
  console.log(passed ? 'PASS: exactly one 200, nine 409s, count +1' : 'FAIL: the counter is not race-proof');
}
 
runRaceTest().catch((err) => {
  console.error('Race test could not run:', err.message);
  process.exit(1);
});
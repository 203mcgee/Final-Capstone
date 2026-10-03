const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


// To 
async function handleResponse(res) {
  if (!res.ok) {
    // Read the { message: "..." } our backend promises on every error.
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data.message) message = data.message;
    } catch {
      // Response wasn't JSON. Keep the generic message.
    }
    throw new Error(message);
  }

  // 204 No Content (our DELETE) has an empty body.
  // Calling res.json() on it would throw "Unexpected end of JSON input".
  if (res.status === 204) return null;

  return res.json();
}

// To get the skills
export async function getSkills(search) {
  // encodeURIComponent matters: without it, searching "AC/DC" puts a
  // slash in the URL and the server sees a path it doesn't recognise.
  const url = search
    ? `${BASE_URL}/api/skills?category=${encodeURIComponent(search)}`
    : `${BASE_URL}/api/skills`;

  
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createSkill(skill) {
  // TODO (LAB 3): a POST needs THREE things a GET doesn't:
  //   1. method: 'POST'
  //   2. headers: { 'Content-Type': 'application/json' }
  //   3. body: JSON.stringify(album)
  //
  // These are exactly what you set in Postman: the method dropdown,
  // the Body → raw → JSON dropdown, and the text you typed.
  //
  const res = await fetch(`${BASE_URL}/api/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill),
  });
  return handleResponse(res);
}

export async function updateSkill(id, changes) {
  
  
  const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  return handleResponse(res);
}

// ---------------------------------------------------------------
// DELETE an album
// ---------------------------------------------------------------
export async function deleteSkill(id) {
 
  const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}




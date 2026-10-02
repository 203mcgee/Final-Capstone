const BASE_URL = import.meta.env.VITE_API_URL || '';


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


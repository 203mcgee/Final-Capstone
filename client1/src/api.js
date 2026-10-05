// const BASE_URL = import.meta.env.VITE_API_URL || '';


// // To 
// async function handleResponse(res) {
//   if (!res.ok) {
//     // Read the { message: "..." } our backend promises on every error.
//     let message = `Request failed (${res.status})`;
//     try {
//       const data = await res.json();
//       if (data.message) message = data.message;
//     } catch {
//       // Response wasn't JSON. Keep the generic message.
//     }
//     throw new Error(message);
//   }

//   // 204 No Content (our DELETE) has an empty body.
//   // Calling res.json() on it would throw "Unexpected end of JSON input".
//   if (res.status === 204) return null;

//   return res.json();
// }

// // To get the skills
// export async function getSkills(search) {
//   // encodeURIComponent matters: without it, searching "AC/DC" puts a
//   // slash in the URL and the server sees a path it doesn't recognise.
//   const url = search
//     ? `${BASE_URL}/api/skills?category=${encodeURIComponent(search)}`
//     : `${BASE_URL}/api/skills`;

  
//   const res = await fetch(url);
//   return handleResponse(res);
// }

// export async function createSkill(skill) {
//   // TODO (LAB 3): a POST needs THREE things a GET doesn't:
//   //   1. method: 'POST'
//   //   2. headers: { 'Content-Type': 'application/json' }
//   //   3. body: JSON.stringify(album)
//   //
//   // These are exactly what you set in Postman: the method dropdown,
//   // the Body → raw → JSON dropdown, and the text you typed.
//   //
//   const res = await fetch(`${BASE_URL}/api/skills`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(skill),
//   });
//   return handleResponse(res);
// }

// export async function updateSkill(id, changes) {
  
  
//   const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(changes),
//   });
//   return handleResponse(res);
// }

// // ---------------------------------------------------------------
// // DELETE an album
// // ---------------------------------------------------------------
// export async function deleteSkill(id) {
 
//   const res = await fetch(`${BASE_URL}/api/skills/${id}`, {
//     method: 'DELETE',
//   });
//   return handleResponse(res);
// }

// export async function fetchWithAuth(endpoint, options = {}) {
//     const token = localStorage.getItem('token');

//     const headers = {
//         'Content-Type': 'application/json',
//         ...options.headers,
//     };

//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//     });

//     if (response.status === 401) {
//         // Token expired or invalid: clear storage
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         throw new Error('Session expired. Please log in again.');
//     }

//     return response.json();
// }
// api/skills.js
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Handle responses for authenticated requests
async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data.message) message = data.message;
    } catch {
      // Non-JSON error response
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function endorseSkill(skillId) {
  const response = await fetch(`/api/skills/${skillId}/endorse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to endorse skill');
  return response.json();
}

// Authenticated fetch wrapper for Admin routes
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  return handleResponse(response);
}

// Public API call
export async function getSkills(search) {
  const url = search
    ? `${BASE_URL}/api/skills?category=${encodeURIComponent(search)}`
    : `${BASE_URL}/api/skills`;

  const res = await fetch(url);
  return handleResponse(res);
}

// Admin API calls (Requires JWT Header)
export async function createSkill(skill) {
  return fetchWithAuth('/api/skills', {
    method: 'POST',
    body: JSON.stringify(skill),
  });
}

export async function updateSkill(id, changes) {
  return fetchWithAuth(`/api/skills/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export async function deleteSkill(id) {
  return fetchWithAuth(`/api/skills/${id}`, {
    method: 'DELETE',
  });
}



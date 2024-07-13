export function generateToken(username, password) {
  // Concatenate username and password with a colon
  const credentials = `${username}:${password}`;
  // Encode the credentials using base64
  const encodedCredentials = btoa(credentials);
  return encodedCredentials;
}

export function generateHeaders(token) {
  // Construct the Authorization header value
  const authHeader = `Basic ${token}`;
  // Construct headers object
  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };
  return headers;
}

export async function makePostRequest(url, payload, headers) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function makeGetRequest(url, headers) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

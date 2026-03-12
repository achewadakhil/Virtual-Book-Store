import { API_BASE_URL } from "./endpoints";
import { normalizeApiError } from "./response";

class ApiClientError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

function buildHeaders({ token, headers, hasBody }) {
  const baseHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (hasBody) {
    baseHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  return baseHeaders;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

async function request(path, options = {}) {
  const { method = "GET", data, token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders({
      token,
      headers,
      hasBody: data !== undefined,
    }),
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...rest,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiClientError(
      normalizeApiError(payload),
      response.status,
      payload
    );
  }

  return payload;
}

export const apiClient = {
  request,
  get(path, options = {}) {
    return request(path, { ...options, method: "GET" });
  },
  post(path, data, options = {}) {
    return request(path, { ...options, method: "POST", data });
  },
  put(path, data, options = {}) {
    return request(path, { ...options, method: "PUT", data });
  },
  patch(path, data, options = {}) {
    return request(path, { ...options, method: "PATCH", data });
  },
  delete(path, options = {}) {
    return request(path, { ...options, method: "DELETE" });
  },
};

export { ApiClientError };

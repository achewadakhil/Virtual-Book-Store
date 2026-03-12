export function unwrapApiResponse(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid API response.");
  }

  if (!("success" in payload)) {
    return payload;
  }

  if (!payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data;
}

export function getApiMessage(payload, fallback = "") {
  if (payload && typeof payload === "object" && typeof payload.message === "string") {
    return payload.message;
  }
  return fallback;
}

export function normalizeApiError(error) {
  if (error && typeof error === "object") {
    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }

    if (typeof error.error === "string" && error.error.trim()) {
      return error.error;
    }
  }

  return "Something went wrong. Please try again.";
}

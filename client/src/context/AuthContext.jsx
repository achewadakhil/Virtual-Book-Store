import { useEffect, useState } from "react";
import { apiClient, ApiClientError } from "../api/client";
import { endpoints } from "../api/endpoints";
import { AuthContext } from "./auth-context";
import {
  getApiMessage,
  normalizeApiError,
  unwrapApiResponse,
} from "../api/response";

const SESSION_STORAGE_KEY = "virtual-book-store-auth";

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (!session?.accessToken) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function invokeClientMethod(method, path, options = {}) {
  if (method === "get" || method === "delete") {
    return apiClient[method](path, options);
  }

  return apiClient[method](path, options.data, options);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("bootstrapping");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchCurrentUser(accessToken) {
    const response = await apiClient.get(endpoints.users.me, {
      token: accessToken,
    });
    return unwrapApiResponse(response);
  }

  function saveSession(nextSession) {
    setSession(nextSession);
    writeStoredSession(nextSession);
  }

  function clearSession() {
    setSession(null);
    setUser(null);
    setStatus("anonymous");
    setAuthMessage("");
    writeStoredSession(null);
  }

  async function refreshAccessToken(refreshToken) {
    const response = await apiClient.post(endpoints.auth.refresh, {
      refreshToken,
    });

    const authPayload = unwrapApiResponse(response);
    const nextSession = {
      accessToken: authPayload.accessToken,
      refreshToken: authPayload.refreshToken,
      tokenType: authPayload.tokenType,
      accessTokenExpiresInMs: authPayload.accessTokenExpiresInMs,
      refreshTokenExpiresInMs: authPayload.refreshTokenExpiresInMs,
    };

    saveSession(nextSession);
    return nextSession;
  }

  useEffect(() => {
    async function runBootstrap() {
      const currentSession = readStoredSession();

      if (!currentSession?.accessToken) {
        setStatus("anonymous");
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(currentSession.accessToken);
        setUser(currentUser);
        setStatus("authenticated");
      } catch (error) {
        const canRefresh =
          error instanceof ApiClientError &&
          error.status === 401 &&
          currentSession?.refreshToken;

        if (!canRefresh) {
          clearSession();
          return;
        }

        try {
          const refreshResponse = await apiClient.post(endpoints.auth.refresh, {
            refreshToken: currentSession.refreshToken,
          });
          const authPayload = unwrapApiResponse(refreshResponse);
          const nextSession = {
            accessToken: authPayload.accessToken,
            refreshToken: authPayload.refreshToken,
            tokenType: authPayload.tokenType,
            accessTokenExpiresInMs: authPayload.accessTokenExpiresInMs,
            refreshTokenExpiresInMs: authPayload.refreshTokenExpiresInMs,
          };
          saveSession(nextSession);
          const currentUser = await fetchCurrentUser(nextSession.accessToken);
          setUser(currentUser);
          setStatus("authenticated");
        } catch {
          clearSession();
        }
      }
    }

    runBootstrap();
  }, []);

  async function login(credentials) {
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      const response = await apiClient.post(endpoints.auth.login, credentials);
      const authPayload = unwrapApiResponse(response);
      const nextSession = {
        accessToken: authPayload.accessToken,
        refreshToken: authPayload.refreshToken,
        tokenType: authPayload.tokenType,
        accessTokenExpiresInMs: authPayload.accessTokenExpiresInMs,
        refreshTokenExpiresInMs: authPayload.refreshTokenExpiresInMs,
      };

      saveSession(nextSession);
      const currentUser = await fetchCurrentUser(nextSession.accessToken);
      setUser(currentUser);
      setStatus("authenticated");
      setAuthMessage(getApiMessage(response, "Login successful."));
      return { ok: true };
    } catch (error) {
      setStatus("anonymous");
      setAuthMessage(normalizeApiError(error));
      return { ok: false, message: normalizeApiError(error) };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(formData) {
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      const response = await apiClient.post(endpoints.auth.register, formData);
      setAuthMessage(getApiMessage(response, "Registration successful."));
      return { ok: true, message: getApiMessage(response, "Registration successful.") };
    } catch (error) {
      const message = normalizeApiError(error);
      setAuthMessage(message);
      return { ok: false, message };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function requestWithAuth(method, path, options = {}) {
    if (!session?.accessToken) {
      throw new Error("Please login to continue.");
    }

    try {
      return await invokeClientMethod(method, path, {
        ...options,
        token: session.accessToken,
      });
    } catch (error) {
      const canRefresh =
        error instanceof ApiClientError &&
        error.status === 401 &&
        session?.refreshToken;

      if (!canRefresh) {
        throw error;
      }

      const nextSession = await refreshAccessToken(session.refreshToken);
      return invokeClientMethod(method, path, {
        ...options,
        token: nextSession.accessToken,
      });
    }
  }

  function logout() {
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        status,
        authMessage,
        isSubmitting,
        isAuthenticated: status === "authenticated",
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
        requestWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import Card from "../ui/Card";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute() {
  const location = useLocation();
  const { status } = useAuth();

  if (status === "bootstrapping") {
    return (
      <Card className="space-y-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Loading session</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Verifying your current login state.
        </p>
      </Card>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

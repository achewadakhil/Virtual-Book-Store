import { Navigate, Outlet } from "react-router-dom";
import Card from "../ui/Card";
import { useAuth } from "../../context/useAuth";

export default function AdminRoute() {
  const { status, isAdmin } = useAuth();

  if (status === "bootstrapping") {
    return (
      <Card className="space-y-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Loading session</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Verifying access for this page.
        </p>
      </Card>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

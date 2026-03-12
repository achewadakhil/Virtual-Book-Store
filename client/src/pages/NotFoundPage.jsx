import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function NotFoundPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">404</h1>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        The page you requested was not found.
      </p>
      <Link to="/">
        <Button>Back Home</Button>
      </Link>
    </Card>
  );
}

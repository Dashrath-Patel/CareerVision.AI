import Navigation from "@/components/navigation";
import ResultsDashboard from "@/components/results-dashboard";

export default function ResultsPage() {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main className="pt-20 relative">
        <ResultsDashboard />
      </main>
    </div>
  );
}
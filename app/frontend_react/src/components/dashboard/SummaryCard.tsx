import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryCardProps {
  destination: string;
}

export const SummaryCard = ({ destination }: SummaryCardProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/summary?destination=${destination}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.summary) {
          setSummary(data.summary);
          setError(null);
        } else {
          setError("No summary available at the moment.");
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("Unable to fetch itinerary summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [destination]);

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Itinerary Summary</h3>
      </div>

      <div className="bg-travel-secondary/20 rounded-lg p-4 max-h-[300px] overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-400 text-center">Generating your personalized plan...</p>
        ) : error ? (
          <p className="text-sm text-red-500 text-center">{error}</p>
        ) : (
          <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">{summary}</p>
        )}
      </div>
    </div>
  );
};

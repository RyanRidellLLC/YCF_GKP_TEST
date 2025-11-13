import { useState, useEffect } from 'react';
import { ChevronLeft, ExternalLink, Building, User, AlertTriangle, Loader } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  url: string;
  hasKnowledgePanel: boolean;
}

interface ResultsStepProps {
  searchQuery: string;
  onSelectEntity: (entity: Entity) => void;
  onBack: () => void;
}

export default function ResultsStep({ searchQuery, onSelectEntity, onBack }: ResultsStepProps) {
  const [results, setResults] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
          console.error('Google API Key not configured');
          setResults([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(searchQuery)}&key=${apiKey}&limit=20&indent=True`
        );

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        const formattedResults: Entity[] = data.itemListElement?.map((item: any, index: number) => {
          const result = item.result;
          return {
            id: result['@id'] || `result-${index}`,
            name: result.name || searchQuery,
            type: result['@type']?.[0] || 'Unknown',
            description: result.description || result.detailedDescription?.articleBody || 'No description available',
            image: result.image?.contentUrl || result.image?.url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
            url: result.detailedDescription?.url || result.url || `https://www.google.com/search?q=${encodeURIComponent(result.name)}`,
            hasKnowledgePanel: !!result.detailedDescription
          };
        }) || [];

        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching Knowledge Graph results:', error);
        setResults([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-lg text-slate-600">Searching Knowledge Graph...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Results Found</h3>
        <p className="text-slate-600 mb-6">
          We couldn't find "{searchQuery}" in Google's Knowledge Graph
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Another Search
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Search
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Step 2: Select Your Entity
        </h2>
        <p className="text-lg text-slate-600">
          Click on the result that matches you or your brand
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <button
            key={result.id}
            onClick={() => onSelectEntity(result)}
            className="w-full text-left bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <div className="flex gap-6">
              <img
                src={result.image}
                alt={result.name}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {result.name}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {result.type === 'Person' ? (
                    <User className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Building className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-sm text-slate-500">{result.type}</span>
                </div>

                <p className="text-slate-600 mb-3">{result.description}</p>

                {result.hasKnowledgePanel ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Has Knowledge Panel
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    No Knowledge Panel Yet
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <p className="text-sm text-slate-700">
          <strong>Don't see your result?</strong> Try searching with a different name variation,
          or you may not have a Knowledge Graph presence yet.
        </p>
      </div>
    </div>
  );
}

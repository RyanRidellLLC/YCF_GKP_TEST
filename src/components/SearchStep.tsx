import { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';

interface SearchStepProps {
  onSearch: (query: string) => void;
}

export default function SearchStep({ onSearch }: SearchStepProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const exampleSearches = [
    'Donald Trump',
    'Taylor Swift',
    'Apple Inc',
    'Your Name Here'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Step 1: Search Your Name
        </h2>
        <p className="text-lg text-slate-600">
          Type your name, brand, or company exactly as it appears on Google
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your name or brand..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            Search
          </button>
        </div>
      </form>

      <div className="bg-slate-50 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Quick Tips:</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Use your full name as it appears publicly</li>
              <li>• For businesses, include "Inc" or "LLC" if applicable</li>
              <li>• Try different variations if you don't find results</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleSearches.map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

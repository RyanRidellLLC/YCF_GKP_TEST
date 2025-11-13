import { useState } from 'react';
import { CheckCircle, ExternalLink, Copy, Check, Search } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  url: string;
  hasKnowledgePanel: boolean;
}

interface TrackingStepProps {
  entity: Entity;
  onStartOver: () => void;
}

export default function TrackingStep({ entity, onStartOver }: TrackingStepProps) {
  const [copied, setCopied] = useState(false);

  const copyClaimUrl = () => {
    navigator.clipboard.writeText('https://support.google.com/knowledgepanel/answer/7534842');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Step 3: Claim Your Knowledge Panel
        </h2>
        <p className="text-lg text-slate-600">
          Follow these simple steps to claim your panel on Google
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 mb-8">
        <div className="flex gap-6">
          <img
            src={entity.image}
            alt={entity.name}
            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{entity.name}</h3>
            <p className="text-slate-600 mb-3">{entity.description}</p>
            {entity.hasKnowledgePanel ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Knowledge Panel Found
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                <Search className="w-4 h-4" />
                No Panel Yet
              </div>
            )}
          </div>
        </div>
      </div>

      {entity.hasKnowledgePanel && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            How to Claim Your Knowledge Panel
          </h3>
          <p className="text-slate-700 mb-8 text-center text-lg">
            Click the button below to go to Google and claim your panel
          </p>

          <ol className="space-y-4 mb-8">
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">1</span>
              <div>
                <strong className="text-slate-800 block mb-1">Click the big button below</strong>
                <p className="text-slate-600">This will open Google and search for "{entity.name}"</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">2</span>
              <div>
                <strong className="text-slate-800 block mb-1">Look for the Knowledge Panel box</strong>
                <p className="text-slate-600">It appears on the right side of the Google search results</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">3</span>
              <div>
                <strong className="text-slate-800 block mb-1">Click "Claim this knowledge panel"</strong>
                <p className="text-slate-600">Google will ask you to verify your identity</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">4</span>
              <div>
                <strong className="text-slate-800 block mb-1">Complete Google's verification</strong>
                <p className="text-slate-600">This usually takes a few days for Google to review</p>
              </div>
            </li>
          </ol>

          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(entity.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl text-xl mb-6"
          >
            <Search className="w-7 h-7" />
            Search "{entity.name}" on Google
            <ExternalLink className="w-6 h-6" />
          </a>

          <div className="flex gap-3 justify-center">
            <a
              href="https://support.google.com/knowledgepanel/answer/7534842"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              View Google's Help Guide
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={copyClaimUrl}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Help Link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!entity.hasKnowledgePanel && (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 mb-8 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            No Knowledge Panel Found Yet
          </h3>
          <p className="text-slate-600 mb-4">
            "{entity.name}" doesn't appear to have a Knowledge Panel on Google yet.
          </p>
          <p className="text-sm text-slate-500">
            Knowledge Panels are created automatically by Google. Keep building your online presence and check back later.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
        >
          Search Another Name
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, BookOpen, TrendingUp } from 'lucide-react';
import SearchStep from './components/SearchStep';
import ResultsStep from './components/ResultsStep';
import TrackingStep from './components/TrackingStep';

type Step = 'search' | 'results' | 'tracking';

interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  url: string;
  hasKnowledgePanel: boolean;
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentStep('results');
  };

  const handleSelectEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    setCurrentStep('tracking');
  };

  const handleStartOver = () => {
    setCurrentStep('search');
    setSearchQuery('');
    setSelectedEntity(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              Knowledge Panel Claim Tool
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find and claim your Google Knowledge Panel in 3 simple steps
          </p>
        </header>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator
              label="Search"
              active={currentStep === 'search'}
              completed={currentStep !== 'search'}
              icon={<Search className="w-5 h-5" />}
            />
            <div className={`h-1 w-24 ${currentStep !== 'search' ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <StepIndicator
              label="Select"
              active={currentStep === 'results'}
              completed={currentStep === 'tracking'}
              icon={<CheckCircle className="w-5 h-5" />}
            />
            <div className={`h-1 w-24 ${currentStep === 'tracking' ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <StepIndicator
              label="Claim"
              active={currentStep === 'tracking'}
              completed={false}
              icon={<CheckCircle className="w-5 h-5" />}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 'search' && (
            <SearchStep onSearch={handleSearch} />
          )}

          {currentStep === 'results' && (
            <ResultsStep
              searchQuery={searchQuery}
              onSelectEntity={handleSelectEntity}
              onBack={handleStartOver}
            />
          )}

          {currentStep === 'tracking' && selectedEntity && (
            <TrackingStep
              entity={selectedEntity}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        <footer className="mt-12 text-center">
          <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-slate-800 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600">
                  Learn more about{' '}
                  <a
                    href="https://support.google.com/knowledgepanel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Google Knowledge Panels
                  </a>
                  {' '}and how to claim yours.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StepIndicator({
  label,
  active,
  completed,
  icon
}: {
  label: string;
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg
          transition-all duration-300
          ${active ? 'bg-blue-600 text-white scale-110 shadow-lg' : ''}
          ${completed ? 'bg-green-500 text-white' : ''}
          ${!active && !completed ? 'bg-slate-300 text-slate-500' : ''}
        `}
      >
        {completed ? <CheckCircle className="w-6 h-6" /> : icon}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}

export default App;

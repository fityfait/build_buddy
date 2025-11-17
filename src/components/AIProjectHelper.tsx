import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateProjectDescription } from '../lib/ai-helpers';

interface AIProjectHelperProps {
  onGenerated: (description: string) => void;
}

export default function AIProjectHelper({ onGenerated }: AIProjectHelperProps) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const result = await generateProjectDescription(idea);
      const fullDescription = `${result.overview}\n\nKey Features:\n${result.features.map(f => `• ${f}`).join('\n')}\n\nGoals:\n${result.goals.map(g => `• ${g}`).join('\n')}\n\nExpected Outcomes:\n${result.outcomes}`;
      onGenerated(fullDescription);
      setShowHelper(false);
      setIdea('');
    } catch (error) {
      alert('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showHelper) {
    return (
      <button
        type="button"
        onClick={() => setShowHelper(true)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
      >
        <Sparkles className="w-4 h-4" />
        AI Project Description Generator
      </button>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-medium">AI Project Description Generator</h3>
      </div>

      <input
        type="text"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Enter a simple project idea (e.g., 'a social media app for students')"
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-3"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowHelper(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

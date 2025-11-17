import { X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AIProjectHelper from './AIProjectHelper';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const domains = [
  'Web Development',
  'AI/ML',
  'App Development',
  'Blockchain',
  'IoT',
  'Game Development',
  'Data Science',
  'Cybersecurity',
];

const commonSkills = [
  'React',
  'Node.js',
  'Python',
  'TypeScript',
  'MongoDB',
  'PostgreSQL',
  'TensorFlow',
  'PyTorch',
  'Docker',
  'Kubernetes',
  'AWS',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Solidity',
  'Web3',
  'Arduino',
  'Raspberry Pi',
  'Unity',
  'Unreal Engine',
  'Pandas',
  'NumPy',
  'Machine Learning',
  'Deep Learning',
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState(domains[0]);
  const [duration, setDuration] = useState('');
  const [slotsTotal, setSlotsTotal] = useState(5);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addNewSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title,
          description,
          domain,
          duration,
          slots_total: slotsTotal,
          slots_filled: 0,
          status: 'open',
          progress: 0,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      for (const skillName of selectedSkills) {
        let skillId: number;

        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .maybeSingle();

        if (existingSkill) {
          skillId = existingSkill.id;
        } else {
          const { data: newSkillData, error: skillError } = await supabase
            .from('skills')
            .insert({ name: skillName })
            .select()
            .single();

          if (skillError) throw skillError;
          skillId = newSkillData.id;
        }

        await supabase.from('project_skills').insert({
          project_id: project.id,
          skill_id: skillId,
        });
      }

      await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: user.id,
        role: 'owner',
        status: 'accepted',
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDomain(domains[0]);
    setDuration('');
    setSlotsTotal(5);
    setSelectedSkills([]);
    setNewSkill('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg max-w-3xl w-full p-8 relative border border-gray-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <AIProjectHelper onGenerated={setDescription} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 4-5 months"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Slots: {slotsTotal}
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={slotsTotal}
              onChange={(e) => setSlotsTotal(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewSkill())}
                placeholder="Add custom skill"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addNewSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {commonSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {selectedSkills.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-900 text-blue-300 px-3 py-1 rounded flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="text-blue-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || selectedSkills.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}

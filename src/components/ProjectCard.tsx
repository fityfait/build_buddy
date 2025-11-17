import { Users, Clock } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: 'open' | 'in_progress' | 'near_completion' | 'completed';
  duration: string;
  progress: number;
  slots_total: number;
  slots_filled: number;
  skills: Array<{ id: number; name: string }>;
  owner: {
    name: string;
  };
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusColors = {
  open: 'bg-green-500',
  in_progress: 'bg-blue-500',
  near_completion: 'bg-yellow-500',
  completed: 'bg-gray-500',
};

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  near_completion: 'Near Completion',
  completed: 'Completed',
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
        </div>
        <span
          className={`${
            statusColors[project.status]
          } text-white text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        <span className="bg-gray-800 px-3 py-1 rounded">{project.domain}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {project.duration}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills.slice(0, 4).map((skill) => (
          <span
            key={skill.id}
            className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded"
          >
            {skill.name}
          </span>
        ))}
        {project.skills.length > 4 && (
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">
            +{project.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Progress</span>
          <span className="text-white text-sm font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            {project.slots_filled} / {project.slots_total} members
          </span>
          <span className="text-sm text-gray-400">by {project.owner.name}</span>
        </div>
      </div>
    </div>
  );
}

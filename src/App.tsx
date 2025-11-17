import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ProjectCard, { Project } from './components/ProjectCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import CreateProjectModal from './components/CreateProjectModal';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      loadProjects();
    }
  }, [authLoading]);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchQuery, selectedDomain, selectedStatus, sortBy]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(
          `
          *,
          owner:profiles!projects_owner_id_fkey(name),
          skills:project_skills(
            skill:skills(id, name)
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects = projectsData.map((project: any) => ({
        ...project,
        skills: project.skills.map((s: any) => s.skill),
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.domain.toLowerCase().includes(query) ||
          project.skills.some((skill) => skill.name.toLowerCase().includes(query))
      );
    }

    if (selectedDomain !== 'All') {
      filtered = filtered.filter((project) => project.domain === selectedDomain);
    }

    if (selectedStatus !== 'All') {
      const statusMap: { [key: string]: string } = {
        Open: 'open',
        'In Progress': 'in_progress',
        'Near Completion': 'near_completion',
        Completed: 'completed',
      };
      filtered = filtered.filter((project) => project.status === statusMap[selectedStatus]);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'popularity':
          return b.slots_filled - a.slots_filled;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onCreateProject={() => setShowCreateModal(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Projects</h1>
          <p className="text-gray-400">
            Connect with active projects and collaborate with talented teams
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Filters
            selectedDomain={selectedDomain}
            onDomainChange={setSelectedDomain}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdate={loadProjects}
      />

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadProjects}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

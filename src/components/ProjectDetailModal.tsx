import { X, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Project } from './ProjectCard';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onUpdate: () => void;
}

interface ProjectMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  user: {
    name: string;
    experience: string;
  };
}

export default function ProjectDetailModal({
  project,
  onClose,
  onUpdate,
}: ProjectDetailModalProps) {
  const { user, profile } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('');

  useEffect(() => {
    if (project) {
      loadMembers();
      checkApplicationStatus();
    }
  }, [project, user]);

  const loadMembers = async () => {
    if (!project) return;

    const { data } = await supabase
      .from('project_members')
      .select(
        `
        id,
        user_id,
        role,
        status,
        user:profiles(name, experience)
      `
      )
      .eq('project_id', project.id);

    if (data) {
      const accepted = data.filter((m: any) => m.status === 'accepted');
      const pending = data.filter((m: any) => m.status === 'pending');
      setMembers(accepted);
      setPendingRequests(pending);
    }
  };

  const checkApplicationStatus = async () => {
    if (!project || !user) return;

    const { data } = await supabase
      .from('project_members')
      .select('status')
      .eq('project_id', project.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setHasApplied(true);
      setApplicationStatus(data.status);
    }
  };

  const handleApply = async () => {
    if (!project || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: user.id,
        role: 'member',
        status: 'pending',
      });

      if (error) throw error;

      setHasApplied(true);
      setApplicationStatus('pending');
      alert('Application submitted successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (memberId: string, userId: string) => {
    if (!project) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('project_members')
        .update({ status: 'accepted' })
        .eq('id', memberId);

      if (updateError) throw updateError;

      const currentFilled = project.slots_filled;
      const { error: projectError } = await supabase
        .from('projects')
        .update({ slots_filled: currentFilled + 1 })
        .eq('id', project.id);

      if (projectError) throw projectError;

      loadMembers();
      onUpdate();
      alert('Member accepted successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (memberId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_members')
        .update({ status: 'rejected' })
        .eq('id', memberId);

      if (error) throw error;

      loadMembers();
      alert('Member rejected');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  const isOwner = user && project && user.id === project.owner_id;
  const canApply =
    user &&
    profile?.role === 'student' &&
    !hasApplied &&
    project.status === 'open' &&
    project.slots_filled < project.slots_total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full p-8 relative border border-gray-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">{project.title}</h2>
            <span className="bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm">
              {project.domain}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {project.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {project.slots_filled} / {project.slots_total} members
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-blue-900 text-blue-300 px-3 py-1 rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-800 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-white font-medium">{project.progress}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Team Members</h3>
            <div className="space-y-2">
              {members.length > 0 ? (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                  >
                    <div>
                      <span className="text-white font-medium">{member.user.name}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({member.user.experience})
                      </span>
                      {member.role === 'owner' && (
                        <span className="ml-2 text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No members yet</p>
              )}
            </div>
          </div>

          {isOwner && pendingRequests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                  >
                    <div>
                      <span className="text-white font-medium">{request.user.name}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({request.user.experience})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request.id, request.user_id)}
                        disabled={loading}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={loading}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canApply && (
            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Applying...' : 'Apply to Join'}
            </button>
          )}

          {hasApplied && applicationStatus === 'pending' && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
              Your application is pending review
            </div>
          )}

          {hasApplied && applicationStatus === 'accepted' && (
            <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-lg">
              You are a member of this project
            </div>
          )}

          {hasApplied && applicationStatus === 'rejected' && (
            <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
              Your application was rejected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { LogOut, User, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  onCreateProject?: () => void;
}

export default function Navbar({ onCreateProject }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Build Buddy</h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {profile?.role === 'project_owner' && onCreateProject && (
                    <button
                      onClick={onCreateProject}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Create Project
                    </button>
                  )}

                  <div className="flex items-center gap-3 text-white">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{profile?.name}</span>
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
                      {profile?.role}
                    </span>
                  </div>

                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

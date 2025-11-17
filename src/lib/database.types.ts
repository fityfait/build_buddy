export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          bio: string | null
          role: 'student' | 'project_owner' | 'admin'
          experience: 'beginner' | 'intermediate' | 'advanced'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          bio?: string | null
          role?: 'student' | 'project_owner' | 'admin'
          experience?: 'beginner' | 'intermediate' | 'advanced'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          role?: 'student' | 'project_owner' | 'admin'
          experience?: 'beginner' | 'intermediate' | 'advanced'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          user_id: string
          skill_id: number
        }
        Insert: {
          user_id: string
          skill_id: number
        }
        Update: {
          user_id?: string
          skill_id?: number
        }
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          domain: string
          status: 'open' | 'in_progress' | 'near_completion' | 'completed'
          duration: string
          progress: number
          slots_total: number
          slots_filled: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          domain: string
          status?: 'open' | 'in_progress' | 'near_completion' | 'completed'
          duration: string
          progress?: number
          slots_total: number
          slots_filled?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          domain?: string
          status?: 'open' | 'in_progress' | 'near_completion' | 'completed'
          duration?: string
          progress?: number
          slots_total?: number
          slots_filled?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_skills: {
        Row: {
          project_id: string
          skill_id: number
        }
        Insert: {
          project_id: string
          skill_id: number
        }
        Update: {
          project_id?: string
          skill_id?: number
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'member'
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'member'
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'member'
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

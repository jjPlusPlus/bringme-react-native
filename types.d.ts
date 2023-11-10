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
      matches: {
        Row: {
          active: boolean | null
          created_at: string
          game: Json | null
          host: string | null
          id: string
          room_code: string
          status: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          game?: Json | null
          host?: string | null
          id?: string
          room_code: string
          status?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          game?: Json | null
          host?: string | null
          id?: string
          room_code?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_host_fkey"
            columns: ["host"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          created_at: string
          id: number
          match_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          match_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          match_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          auth_uuid: string | null
          created_at: string
          email: string | null
          id: string
          username: string | null
        }
        Insert: {
          auth_uuid?: string | null
          created_at?: string
          email?: string | null
          id?: string
          username?: string | null
        }
        Update: {
          auth_uuid?: string | null
          created_at?: string
          email?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/// <reference types="nativewind/types" />

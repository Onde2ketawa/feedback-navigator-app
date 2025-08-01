export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      channel: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          app_version: string
          category: string | null
          channel_id: string
          created_at: string
          custom_sub_category: string | null
          device: string
          feedback: string
          id: string
          language: string
          last_analyzed_at: string | null
          rating: number
          sentiment: string | null
          sentiment_score: number | null
          status: string
          sub_category: string | null
          submit_date: string | null
          submit_time: string | null
          user_id: string
        }
        Insert: {
          app_version?: string
          category?: string | null
          channel_id: string
          created_at?: string
          custom_sub_category?: string | null
          device?: string
          feedback: string
          id?: string
          language?: string
          last_analyzed_at?: string | null
          rating: number
          sentiment?: string | null
          sentiment_score?: number | null
          status?: string
          sub_category?: string | null
          submit_date?: string | null
          submit_time?: string | null
          user_id: string
        }
        Update: {
          app_version?: string
          category?: string | null
          channel_id?: string
          created_at?: string
          custom_sub_category?: string | null
          device?: string
          feedback?: string
          id?: string
          language?: string
          last_analyzed_at?: string | null
          rating?: number
          sentiment?: string | null
          sentiment_score?: number | null
          status?: string
          sub_category?: string | null
          submit_date?: string | null
          submit_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channel"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_category: {
        Args: { name_value: string }
        Returns: string
      }
      add_subcategory: {
        Args: { category_id_value: string; name_value: string }
        Returns: string
      }
      delete_category: {
        Args: { category_id: string }
        Returns: undefined
      }
      delete_subcategory: {
        Args: { subcategory_id: string }
        Returns: undefined
      }
      edit_category: {
        Args: { category_id: string; name_value: string }
        Returns: undefined
      }
      edit_subcategory: {
        Args: { subcategory_id: string; name_value: string }
        Returns: undefined
      }
      get_all_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          role: string
          status: string
          created_at: string
          updated_at: string
        }[]
      }
      get_annual_channel_ratings: {
        Args: Record<PropertyKey, never> | { year_filters?: string[] }
        Returns: {
          channel_id: number
          rating: number
        }[]
      }
      get_auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_average_rating: {
        Args: Record<PropertyKey, never> | { channel_id_param: string }
        Returns: number
      }
      get_category_distribution: {
        Args: {
          channel_id_param?: string
          year_param?: string
          month_param?: string
        }
        Returns: {
          name: string
          value: number
          color: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_myhana_rating_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_rating: number
          rating_count: number
        }[]
      }
      get_sentiment_trend_by_month: {
        Args: Record<PropertyKey, never> | { channel_name?: string }
        Returns: {
          month: string
          sentiment_score: number
        }[]
      }
      get_subcategory_distribution: {
        Args: {
          category_param: string
          channel_id_param?: string
          year_param?: string
          month_param?: string
        }
        Returns: {
          name: string
          value: number
          color: string
        }[]
      }
      get_user_role_from_metadata: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_yoy_rating_comparison: {
        Args: Record<PropertyKey, never> | { channel_name?: string }
        Returns: undefined
      }
      recalculate_sentiment_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_feedback_categories: {
        Args: {
          feedback_id: string
          category_value: string
          subcategory_value: string
        }
        Returns: undefined
      }
      update_feedback_sentiment: {
        Args: {
          feedback_id: string
          sentiment_value: string
          sentiment_score_value?: number
        }
        Returns: undefined
      }
      update_user_role: {
        Args: { user_id: string; new_role: string }
        Returns: undefined
      }
      update_user_status: {
        Args: { user_id: string; new_status: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

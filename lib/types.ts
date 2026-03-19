export interface Idea {
  id: number
  created_at: string
  idea_name_ko: string
  idea_name_en: string | null
  one_liner: string | null
  content_md: string
  cadence_hours: number | null
  model_used: string | null
  notes: IdeaNotes | null
  implementation_difficulty_score: number | null
  business_feasibility_score: number | null
  archived: boolean
  bookmarked: boolean
}

export interface IdeaNotes {
  tags?: string[]
  origin?: string
  created_by?: string
  assumptions?: Record<string, unknown>
  positioning?: string
  privacy_default?: string
  [key: string]: unknown
}

export interface IdeasResponse {
  ideas: Idea[]
  total: number
}

export interface GameIdea {
  id: number
  created_at: string
  idea_name_ko: string
  idea_name_en: string | null
  one_liner: string
  content_md: string
  cadence_hours: number | null
  model_used: string | null
  gameplay_novelty_score: number | null
  production_scope_score: number | null
  marketability_score: number | null
  notes: GameIdeaNotes | null
  engine_tools: string | null
}

export interface GameIdeaNotes {
  genre?: string
  steam?: {
    tags?: string[]
    capsule_short?: string
    capsule_long?: string
  }
  origin?: string
  platform?: string
  core_mechanic?: string
  [key: string]: unknown
}

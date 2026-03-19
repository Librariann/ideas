'use client'

import { useState } from 'react'
import IdeasClient from './IdeasClient'
import GameIdeasClient from './GameIdeasClient'
import type { Idea, GameIdea } from '@/lib/types'

type Section = 'business' | 'game'

interface BusinessData {
  ideas: Idea[]
  total: number
  tags: string[]
}

interface GameData {
  ideas: GameIdea[]
  total: number
  tags: string[]
}

interface HomeContentProps {
  businessData: BusinessData
  gameData: GameData
}

export default function HomeContent({ businessData, gameData }: HomeContentProps) {
  const [section, setSection] = useState<Section>('business')
  const isGame = section === 'game'

  const totalCount = isGame ? gameData.total : businessData.total
  const accentColor = isGame ? 'rgb(20 184 166)' : 'rgb(139 92 246)'
  const accentLight = isGame ? 'rgb(94 234 212)' : 'rgb(167 139 250)'

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <header className="mb-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4 transition-all duration-300"
              style={{
                background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accentColor} 22%, transparent)`,
                color: accentLight,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: accentLight }}
              />
              {totalCount}개 {isGame ? '게임 아이디어' : '아이디어'} 수집됨
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                color: 'rgb(240 238 255)',
                letterSpacing: '-0.02em',
              }}
            >
              아이디어 보관함
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: 'rgb(100 100 140)' }}
            >
              축적된 생각들, 언젠가 현실이 될 씨앗들
            </p>
          </div>
        </div>
      </header>

      <div
        className="mb-7 flex items-center gap-1 p-1 rounded-xl"
        style={{ background: 'rgb(12 12 22)', border: '1px solid rgb(26 26 44)' }}
      >
        <button
          onClick={() => setSection('business')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all"
          style={{
            background: !isGame ? 'rgb(139 92 246 / 0.15)' : 'transparent',
            color: !isGame ? 'rgb(167 139 250)' : 'rgb(80 80 120)',
            border: !isGame ? '1px solid rgb(139 92 246 / 0.25)' : '1px solid transparent',
          }}
        >
          <span>💼</span>
          사업 아이디어
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-full tabular-nums"
            style={{
              background: !isGame ? 'rgb(139 92 246 / 0.18)' : 'rgb(35 35 55)',
              color: !isGame ? 'rgb(167 139 250)' : 'rgb(65 65 100)',
            }}
          >
            {businessData.total}
          </span>
        </button>

        <button
          onClick={() => setSection('game')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all"
          style={{
            background: isGame ? 'rgb(20 184 166 / 0.15)' : 'transparent',
            color: isGame ? 'rgb(94 234 212)' : 'rgb(80 80 120)',
            border: isGame ? '1px solid rgb(20 184 166 / 0.25)' : '1px solid transparent',
          }}
        >
          <span>🎮</span>
          인디 게임
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-full tabular-nums"
            style={{
              background: isGame ? 'rgb(20 184 166 / 0.18)' : 'rgb(35 35 55)',
              color: isGame ? 'rgb(94 234 212)' : 'rgb(65 65 100)',
            }}
          >
            {gameData.total}
          </span>
        </button>
      </div>

      {!isGame && (
        <IdeasClient
          initialIdeas={businessData.ideas}
          initialTotal={businessData.total}
          tags={businessData.tags}
        />
      )}
      {isGame && (
        <GameIdeasClient
          initialIdeas={gameData.ideas}
          initialTotal={gameData.total}
          tags={gameData.tags}
        />
      )}
    </div>
  )
}

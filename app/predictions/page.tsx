'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Prediction {
  driver: string
  grid_position: number
  win_pct: number
  podium_pct: number
  avg_finish: number
}

interface Race {
  id: number
  season: number
  round: number
  event_name: string
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [race, setRace] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestPredictions() {
      try {
        // Get latest race that has predictions
        const { data: predData, error: predError } = await supabase
          .from('predictions')
          .select(`
            driver,
            grid_position,
            win_pct,
            podium_pct,
            avg_finish,
            predicted_at,
            races (id, season, round, event_name)
          `)
          .order('predicted_at', { ascending: false })
          .limit(20)

        if (predError) throw predError

        if (!predData || predData.length === 0) {
          setError('No predictions found. Run predict.py first.')
          return
        }

        // Extract race info from first result
        const raceInfo = (predData[0] as any).races
        setRace(raceInfo)

        const sorted = [...predData].sort((a, b) => b.win_pct - a.win_pct)
        setPredictions(sorted)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPredictions()
  }, [])

  const getMedalColour = (index: number) => {
    if (index === 0) return 'text-yellow-400'
    if (index === 1) return 'text-gray-400'
    if (index === 2) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getWinBarWidth = (pct: number) => {
    const max = predictions[0]?.win_pct || 1
    return `${(pct / max) * 100}%`
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">← Back</Link>
          <div>
            <h1 className="text-3xl font-bold text-red-500">Race Predictions</h1>
            {race && (
              <p className="text-gray-400 mt-1">
                {race.event_name} — Season {race.season} Round {race.round}
              </p>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-500">Loading predictions...</div>
        )}

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && predictions.length > 0 && (
          <>
            {/* Podium Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {predictions.slice(0, 3).map((p, i) => (
                <div
                  key={p.driver}
                  className={`p-5 bg-gray-900 rounded-xl border ${
                    i === 0 ? 'border-yellow-500/50' :
                    i === 1 ? 'border-gray-500/50' :
                    'border-amber-700/50'
                  }`}
                >
                  <div className={`text-3xl font-black mb-1 ${getMedalColour(i)}`}>
                    P{i + 1}
                  </div>
                  <div className="text-2xl font-bold mb-3">{p.driver}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Win chance</span>
                      <span className="font-semibold text-white">{p.win_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Podium chance</span>
                      <span className="font-semibold text-white">{p.podium_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg finish</span>
                      <span className="font-semibold text-white">P{p.avg_finish}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Grid Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Full Grid</h2>
                <p className="text-gray-500 text-sm mt-1">Based on 1,000 Monte Carlo simulations</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500">
                      <th className="text-left p-4 font-medium">Rank</th>
                      <th className="text-left p-4 font-medium">Driver</th>
                      <th className="text-left p-4 font-medium">Grid</th>
                      <th className="text-left p-4 font-medium w-48">Win %</th>
                      <th className="text-left p-4 font-medium">Podium %</th>
                      <th className="text-left p-4 font-medium">Avg Finish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p, i) => (
                      <tr
                        key={p.driver}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className={`p-4 font-bold ${getMedalColour(i)}`}>
                          {i + 1}
                        </td>
                        <td className="p-4 font-semibold">{p.driver}</td>
                        <td className="p-4 text-gray-400">
                          {p.grid_position ?? '—'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all"
                                style={{ width: getWinBarWidth(p.win_pct) }}
                              />
                            </div>
                            <span className="w-10 text-right text-gray-300">
                              {p.win_pct}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{p.podium_pct}%</td>
                        <td className="p-4 text-gray-300">P{p.avg_finish}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!loading && !error && predictions.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No predictions yet. Run <code className="text-red-400">predict.py</code> to generate predictions.
          </div>
        )}

      </div>
    </main>
  )
}
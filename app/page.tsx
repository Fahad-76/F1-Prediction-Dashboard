import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-red-500 mb-2">F1 Predictor</h1>
          <p className="text-gray-400">ML-powered race predictions using Random Forest + Monte Carlo simulation</p>
        </div>

      <div className="grid grid-cols-1 gap-6">
  <Link href="/predictions" className="group block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-red-500 transition-all">
    <div className="text-2xl mb-3">🏁</div>
    <h2 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">Race Predictions</h2>
    <p className="text-gray-400 text-sm">Driver win & podium probabilities for the latest race prediction</p>
  </Link>
</div>

        <div className="mt-10 p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Model Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400">0.974</div>
              <div className="text-xs text-gray-500 mt-1">ROC-AUC Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">1,000</div>
              <div className="text-xs text-gray-500 mt-1">Simulations/Race</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">6</div>
              <div className="text-xs text-gray-500 mt-1">Seasons Trained</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">2</div>
              <div className="text-xs text-gray-500 mt-1">RF Models</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
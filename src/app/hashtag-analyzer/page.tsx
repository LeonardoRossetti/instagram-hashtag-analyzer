'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AnalysisResult {
  [hashtag: string]: {
    [country: string]: number
  }
}

export default function HashtagAnalyzer() {
  const [hashtags, setHashtags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hashtags.trim()) {
      setError('Please enter at least one hashtag')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashtags: hashtags.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze hashtags')
      }

      const data = await response.json()
      setResult(data.analysis)
    } catch (err) {
      setError('Failed to analyze hashtags. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-gray-600 hover:text-black mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-black mb-4">
            Hashtag Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter Instagram hashtags separated by commas to analyze their popularity across different countries
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="hashtags" className="block text-lg font-semibold text-black mb-2">
                Enter Hashtags
              </label>
              <textarea
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="e.g., #travel, #food, #photography, #fitness"
                className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none text-lg resize-none"
                rows={4}
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Separate multiple hashtags with commas
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-6 text-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Hashtags'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Analysis Results
            </h2>
            
            <div className="space-y-8">
              {Object.entries(result).map(([hashtag, countries]) => (
                <div key={hashtag} className="bg-gray-50 p-6 border border-gray-200">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    {hashtag}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(countries)
                      .sort(([,a], [,b]) => b - a)
                      .map(([country, count]) => (
                        <div key={country} className="bg-white p-4 border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-black">{country}</span>
                            <span className="text-lg font-bold text-gray-700">
                              {count.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-2 bg-gray-200 h-2">
                            <div 
                              className="bg-black h-2" 
                              style={{ 
                                width: `${(count / Math.max(...Object.values(countries))) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-6">
            Instagram Hashtag Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover which hashtags are trending in different countries using AI-powered analysis
          </p>
          <Link 
            href="/hashtag-analyzer"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Analyzing
          </Link>
        </div>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black mb-4">AI-Powered</h3>
            <p className="text-gray-600">
              Advanced AI analyzes hashtag popularity across different regions
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Country Insights</h3>
            <p className="text-gray-600">
              Get detailed breakdown of hashtag usage by country
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Real-time Analysis</h3>
            <p className="text-gray-600">
              Instant results for your hashtag research needs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hashtags } = body

    if (!hashtags || typeof hashtags !== 'string' || !hashtags.trim()) {
      return NextResponse.json(
        { error: 'Hashtags are required' },
        { status: 400 }
      )
    }

    // Clean and parse hashtags
    const hashtagList = hashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)

    if (hashtagList.length === 0) {
      return NextResponse.json(
        { error: 'Please provide valid hashtags' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Create fallback data in case API fails
    const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Brazil", "India"];
    const fallbackData: Record<string, Record<string, number>> = {};
    
    hashtagList.forEach(tag => {
      fallbackData[tag] = {};
      countries.forEach(country => {
        fallbackData[tag][country] = Math.floor(Math.random() * 2000) + 500;
      });
    });

    // Try to call OpenRouter API, but use fallback if it fails
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'user',
              content: `Analyze these Instagram hashtags: ${hashtagList.join(', ')}. Return JSON with country usage data for USA, UK, Canada, Australia, Germany, France, Brazil, India. Use realistic numbers between 500-5000.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        console.warn('API call failed, using fallback data')
        return NextResponse.json({
          analysis: fallbackData,
          hashtags: hashtagList,
          source: 'fallback'
        })
      }

      const data = await response.json()
      const aiResponse = data.choices?.[0]?.message?.content

      if (!aiResponse) {
        return NextResponse.json({
          analysis: fallbackData,
          hashtags: hashtagList,
          source: 'fallback'
        })
      }

      // Parse the AI response as JSON
      let analysis
      try {
        let cleanResponse = aiResponse.trim()
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        analysis = JSON.parse(cleanResponse.trim())
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback')
        return NextResponse.json({
          analysis: fallbackData,
          hashtags: hashtagList,
          source: 'fallback'
        })
      }

      return NextResponse.json({
        analysis,
        hashtags: hashtagList,
        source: 'api'
      })

    } catch (apiError) {
      console.warn('API unavailable, using fallback data')
      return NextResponse.json({
        analysis: fallbackData,
        hashtags: hashtagList,
        source: 'fallback'
      })
    }

    return NextResponse.json({
      analysis: fallbackData,
      hashtags: hashtagList,
      source: 'fallback'
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

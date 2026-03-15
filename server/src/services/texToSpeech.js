import axios from 'axios'

/**
 * Get available voices from ElevenLabs account
 */
async function getAvailableVoices() {
  try {
    console.log('📤 Fetching available voices from ElevenLabs...')
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    })

    const voices = response.data.voices || []
    console.log(`✓ Found ${voices.length} available voices`)

    if (voices.length > 0) {
      console.log('Available voice IDs:', voices.map((v) => v.voice_id).join(', '))
      return voices[0].voice_id // Return first available voice
    }

    // Fallback to provided voice if none found
    console.warn('⚠️ No voices found, using fallback voice ID')
    return process.env.ELEVENLABS_VOICE_ID || 'wBXNqKUATyqu0RtYt25i'
  } catch (err) {
    console.error('❌ Error fetching voices:', {
      status: err.response?.status,
      message: err.message,
    })
    // Return configured voice ID as fallback
    return process.env.ELEVENLABS_VOICE_ID || 'wBXNqKUATyqu0RtYt25i'
  }
}

/**
 * Convert narrative text to speech using ElevenLabs API
 * Returns audio as base64 encoded data URL
 */
export async function generateAudioNarrative(text) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured in environment variables')
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Narrative text is required')
    }

    console.log('🎤 Converting narrative to speech with ElevenLabs...')
    console.log('API Key length:', process.env.ELEVENLABS_API_KEY.length)

    // Get available voice from user's account
    const voiceId = await getAvailableVoices()
    console.log('Selected voice ID:', voiceId)

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

    console.log('📤 Posting to:', url)
    console.log('Request body:', {
      text_length: text.length,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    })

    const response = await axios.post(
      url,
      {
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000, // 60 second timeout for audio generation
      }
    )

    console.log('✓ ElevenLabs response received:', response.status, response.statusText)
    console.log('Audio buffer size:', response.data.length, 'bytes')

    // Convert audio buffer to base64 data URL
    const audioBuffer = Buffer.from(response.data)
    const base64Audio = audioBuffer.toString('base64')
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`

    console.log('✓ Audio converted to base64 (length:', base64Audio.length, ')')
    console.log('✓ Audio generation successful')

    return {
      success: true,
      audioDataUrl,
      duration: null, // ElevenLabs doesn't return duration in response headers easily
      format: 'audio/mpeg',
    }
  } catch (err) {
    console.error('❌ ElevenLabs API error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      endpoint: err.config?.url,
      method: err.config?.method,
    })

    if (err.response?.status === 401) {
      throw new Error('Invalid ElevenLabs API key - check ELEVENLABS_API_KEY environment variable')
    }
    if (err.response?.status === 404) {
      throw new Error('Voice not found - this voice ID may not be available in your account')
    }
    if (err.response?.status === 429) {
      throw new Error('ElevenLabs rate limit exceeded. Please try again later.')
    }
    throw new Error(`Failed to generate audio: ${err.message}`)
  }
}

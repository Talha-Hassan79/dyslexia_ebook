import textToSpeech from '@google-cloud/text-to-speech';

export async function POST(req) {
  try {
    const { text, lang } = await req.json();
    const client = new textToSpeech.TextToSpeechClient();

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: lang === 'ur' ? 'ur-PK' : 'en-US', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    return new Response(
      JSON.stringify({ audio: response.audioContent.toString('base64') }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

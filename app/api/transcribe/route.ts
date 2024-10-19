import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export async function POST(req: NextRequest) {
    console.log('Transcribe API called');
    let deepgram;

    try {
        const apiKey = process.env.DEEPGRAM_API_KEY;
        if (!apiKey) {
            throw new Error('DEEPGRAM_API_KEY is not set');
        }
        deepgram = createClient(apiKey);

        const buffer = await req.arrayBuffer();
        console.log('Received buffer length:', buffer.byteLength, 'bytes');

        if (buffer.byteLength === 0) {
            return NextResponse.json({ error: 'Empty audio buffer received' }, { status: 400 });
        }

        console.log('Sending request to Deepgram...');
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(Buffer.from(buffer), {
            punctuate: true,
            language: 'en-US',
            model: 'general',
        });

        if (error) {
            console.error('Deepgram API error:', error);
            return NextResponse.json({ error: 'Deepgram API error', details: error }, { status: 500 });
        }

        // console.log('Deepgram response:', JSON.stringify(result, null, 2));

        if (!result || !result.results) {
            console.error('Unexpected Deepgram response structure:', result);
            return NextResponse.json({ error: 'Unexpected Deepgram response structure' }, { status: 500 });
        }

        const transcript = result.results.channels[0]?.alternatives[0]?.transcript || '';

        if (transcript.trim() === '') {
            console.log('No speech detected in the audio. Full Deepgram response:', JSON.stringify(result, null, 2));
            return NextResponse.json({ message: 'No speech detected in the audio', transcript: '' }, { status: 200 });
        }

        // console.log('Transcription successful:', transcript);
        return NextResponse.json({ transcript });
    } catch (error) {
        console.error('Transcription error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
        return NextResponse.json({ error: 'Transcription failed', details: errorMessage }, { status: 500 });
    }
}

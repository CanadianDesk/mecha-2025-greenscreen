import { NextResponse } from 'next/server';

export async function GET() {
  global.eventClients?.forEach(client => {
    client.write('data: play-blue-2\n\n');
  });

  return NextResponse.json({ message: 'Video trigger sent for blue-2' });
}
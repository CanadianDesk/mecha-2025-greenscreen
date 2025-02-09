import { NextResponse } from 'next/server';

declare global {
  var eventClients: WritableStreamDefaultWriter[] | undefined;
}

export async function GET(request: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  if (!global.eventClients) {
    global.eventClients = [];
  }

  global.eventClients.push(writer);

  request.signal.addEventListener('abort', () => {
    global.eventClients = global.eventClients?.filter(client => client !== writer);
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

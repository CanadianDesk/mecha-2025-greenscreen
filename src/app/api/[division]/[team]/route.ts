import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ division: string; team: string }> }
) {
  const params = await context.params; // Await params
  const { division, team } = params;

  // Ensure global.eventClients is properly typed
  (global as any).eventClients?.forEach((client: any) => {
    client.write(`data: ${division}-${team}\n\n`);
  });

  return NextResponse.json({
    message: `Video trigger sent for ${division}-${team}`,
    division,
    team
  });
}

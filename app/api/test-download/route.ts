export async function GET() {
  const bytes = new Uint8Array([1, 2, 3, 4, 5]);

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="test.bin"',
    },
  });
}
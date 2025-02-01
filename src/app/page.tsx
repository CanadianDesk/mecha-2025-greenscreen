export default function Home() {
  return (
    <main>
      <div className="flex flex-col flex-1 text-center justify-center items-center min-h-screen">
        <h1 className='font-bold text-2xl mb-8'>Mecha 2025 Livestream Overlays</h1>
        <ul className='list-disc list-inside text-lg space-y-4'>
          <li>navigate to <code className='bg-gray-700 p-1 rounded-md'>/[division]/walkout</code> for the walkout overlay</li>
          <li>navigate to <code className='bg-gray-700 p-1 rounded-md'>/[division]/pre-match</code> for the pre-match overlay (4 spinning robots)</li>
          <li>navigate to <code className='bg-gray-700 p-1 rounded-md'>/[division]/in-match</code> for the in match overlay</li>
        </ul>
      </div>
    </main>
  );
}
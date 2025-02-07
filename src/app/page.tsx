export default function Home() {
  return (
    <main>
      <div className="flex flex-col flex-1 text-center justify-center items-center min-h-screen font-sans">
        <h1 className='font-bold text-2xl mb-8'>Mecha 2025 Livestream Overlays</h1>
        <p className='text-3xl font-bold mb-8'>
          Sources:
        </p>
        <ul className='list-disc list-inside text-lg space-y-4 text-left max-w-[66%]'>
          <li className="line-through">navigate to <code className='bg-gray-200 text-black p-1 rounded-md'>/[division]/walkout-full</code> for the robot + team walkout</li>
          <li>navigate to <code className='bg-gray-200 text-black p-1 rounded-md'>/[division]/walkout-team</code> for a full screen team walkout (no robot)</li>
          <li>navigate to <code className='bg-gray-200 text-black p-1 rounded-md'>/[division]/walkout-fixed</code> for the robot + team walkout fixed at the final frame</li>
          <li>navigate to <code className='bg-gray-200 text-black p-1 rounded-md'>/[division]/custom-walkout-fixed</code> for on-demand robot + team walkout</li>
          <li>navigate to <code className='bg-gray-200 text-black p-1 rounded-md'>/[division]/pre-match</code> for the pre-match overlay (4 spinning robots)</li>
          <li>division can be one of: <code className='bg-gray-200 text-black p-1 rounded-md'>dome</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>rockies</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>prairies</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>foothills</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>badlands</code></li>
          <li>for the large in-venue dome screen, use <code className='bg-gray-200 text-black p-1 rounded-md'>dome-venue</code> for division</li>
        </ul>
        <p className='text-3xl font-bold mt-12 mb-8'>
          API:
        </p>
        <ul className='list-disc list-inside text-lg space-y-4 text-left max-w-[66%]'>
          <li>GET request to <code className='bg-gray-200 text-black p-1 rounded-md'>/api/[division]/[team]</code> to trigger a video for a team</li>
          <li>If the team is one of <code className='bg-gray-200 text-black p-1 rounded-md'>red-1</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>red-2</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>blue-1</code>, <code className='bg-gray-200 text-black p-1 rounded-md'>blue-2</code>, then the video will be triggered for that team for all of the sources EXCEPT the custom</li>
          <li>If the team is anything else, e.g. <code className='bg-gray-200 text-black p-1 rounded-md'>210Y</code>, then the custom-walkout-fixed route will be set with the custom team</li>
        </ul>
      </div>
    </main>
  );
}
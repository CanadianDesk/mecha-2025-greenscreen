import React from 'react';

const Home = () => {
  return (
    <main>

      {/* FIRST SCENE: 5X1 + BOT */}
      <div className="relative w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        <div className='absolute top-0 left-0 w-[1920px] h-[400px] bg-green-400 overflow-hidden z-10'>
        </div>
        {/* 5 X 1 INDIVUDAL VIDEOS */}
        <div className="w-[300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden">
          <div className="w-[600px] overflow-hidden">
            <video
              className="w-[450px] h-[1000px] object-cover scale-[1] translate-x-[-20px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/single.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="w-[300px] h-[1000px] absolute bottom-0 right-[300px] bg-green-500 overflow-hidden">
          <div className="w-[600px] overflow-hidden">
            <video
              className="w-[450px] h-[1000px] object-cover scale-[1] translate-x-[-20px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/single.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="w-[300px] h-[1000px] absolute bottom-0 right-[600px] bg-green-500 overflow-hidden">
          <div className="w-[600px] overflow-hidden">
            <video
              className="w-[450px] h-[1000px] object-cover scale-[1] translate-x-[-20px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/single.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="w-[300px] h-[1000px] absolute bottom-0 right-[900px] bg-green-500 overflow-hidden">
          <div className="w-[600px] overflow-hidden">
            <video
              className="w-[450px] h-[1000px] object-cover scale-[1] translate-x-[-20px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/single.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="w-[300px] h-[1000px] absolute bottom-0 right-[1200px] bg-green-500 overflow-hidden">
          <div className="w-[600px] overflow-hidden">
            <video
              className="w-[450px] h-[1000px] object-cover scale-[1] translate-x-[-20px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/single.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        {/* BOT VIDEO */}
        <div className='absolute top-[400px] left-0 z-20 w-[420px] overflow-hidden'>
          <video 
            className='w-[450px] h-[300px] object-cover'
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      

      {/* SECOND SCENE: 1X3 + BOT */}
      <div className="relative w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">

        {/* 1 X 3 INDIVUDAL VIDEO */}
        <div className="w-[1300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden">
          <div className="w-[1300px] overflow-hidden">
            <video
              className="w-[1300px] h-[1000px] object-cover scale-[1]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/triple.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className='absolute top-[400px] left-[0] z-20 w-[640px] overflow-hidden'>
          <video 
            className='w-[640px] h-[600px] object-cover'
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>
      </div>


      {/* THIRD SCENE: 1X6 + BOT */}
      <div className="relative w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">

        {/* 1 X 6 INDIVUDAL VIDEO */}
        <div className="w-[1300px] absolute bottom-0 right-0 bg-green-500 overflow-hidden">
          <div className="w-[1300px] overflow-hidden">
            <video
              className="w-[1300px] object-cover scale-[1]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/six.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        
        {/* BOT VIDEO */}
        <div className='absolute top-[400px] left-[0] z-20 w-[640px] overflow-hidden'>
          <video 
            className='w-[640px] h-[600px] object-cover'
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
};

export default Home;
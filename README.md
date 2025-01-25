# Setup:
1. Run `yarn`
2. Run `yarn dev`. Its open on localhost on port 3003.


# Calls:
Send a GET request to `/api/red-1` to trigger the red-1 video.
Send a GET request to `/api/red-2` to trigger the red-2 video.
Send a GET request to `/api/blue-1` to trigger the blue-1 video.
Send a GET request to `/api/blue-2` to trigger the blue-2 video.


It's a 2-step trigger. Sending the first request will set up the correct video. Sending the second request will trigger the video.

git
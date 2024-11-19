const socket = io();
const htmlVideoPlayer = document.getElementById('videoPlayer');
let isSyncNeeded = true;

/** Load the video from chosen file */
document.getElementById('videoFile').addEventListener('change', (event) => {
    const videoFile = event.target.files[0];
    if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);
        console.log('Video url = ', videoURL);
        htmlVideoPlayer.src = videoURL;
        htmlVideoPlayer.load();
    } else {
        console.log('No video file provided');
    }
});

/** Emit sync events on play, pause, and seek */
htmlVideoPlayer.addEventListener('play', () => {
    if (isSyncNeeded) {
        console.log('Emitting the play signal');
        socket.emit('sync', {
            action: 'play',
            currentTime: htmlVideoPlayer.currentTime
        });
    }
});

htmlVideoPlayer.addEventListener('pause', () => {
    if (isSyncNeeded) {
        console.log('Emitting the pause signal');
        socket.emit('sync', {
            action: 'pause',
            currentTime: htmlVideoPlayer.currentTime
        });
    }
});

htmlVideoPlayer.addEventListener('seeked', () => {
    if (isSyncNeeded) {
        console.log('Emitting the seek signal');
        socket.emit('sync', { action: 'seek', currentTime: htmlVideoPlayer.currentTime });
    }
});

/** Listen for "sync" events emitted by other connected users */
socket.on('sync', (data) => {

    isSyncNeeded = false; // disable "sync" emission on socket operations

    if (data.action === 'play') {
        htmlVideoPlayer.currentTime = data.currentTime;
        htmlVideoPlayer.play();
    } else if (data.action === 'pause') {
        htmlVideoPlayer.currentTime = data.currentTime;
        htmlVideoPlayer.pause();
    } else if (data.action === 'seek') {
        htmlVideoPlayer.currentTime = data.currentTime;
    }

    // Re-enable event emission after the action is applied
    setTimeout(() => {
        isSyncNeeded = true;
    }, 50); // Small delay to avoid overlap
});

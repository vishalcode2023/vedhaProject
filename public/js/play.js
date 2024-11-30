function playVideo(videoSrc, title) {
    const mainVideo = document.getElementById('main-video');
    const mainTitle = document.getElementById('main-title');

    // Update video source and title
    mainVideo.src = videoSrc;
    mainVideo.play();
    mainTitle.textContent = title;

    // Update active class
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

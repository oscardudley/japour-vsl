// Video player integration for Japour Gym VSL

export function initVideoPlayer() {
  console.log('🎥 Initializing video player...')
  
  const videoId = import.meta.env.VITE_VIMEO_VIDEO_ID
  const container = document.getElementById('video-container')
  
  if (!container) {
    console.error('🎥 Video container not found')
    return
  }
  
  if (!videoId || videoId === 'placeholder') {
    console.log('🎥 Video ID not set - showing placeholder')
    showVideoPlaceholder(container)
    return
  }
  
  console.log('🎥 Loading Vimeo video:', videoId)
  createVimeoEmbed(container, videoId)
}

function createVimeoEmbed(container, videoId) {
  // Clear container
  container.innerHTML = ''
  
  // Create iframe
  const iframe = document.createElement('iframe')
  iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=0&loop=0&title=0&byline=0&portrait=0&responsive=1&dnt=1`
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.allow = 'autoplay; fullscreen; picture-in-picture'
  iframe.allowFullscreen = true
  iframe.loading = 'lazy'
  
  // Add loading state
  iframe.addEventListener('load', () => {
    console.log('🎥 Video loaded successfully')
    
    // Track video load
    import('./analytics.js').then(({ trackVideoPlay }) => {
      trackVideoPlay()
    })
    
    // Remove loading state
    container.classList.add('loaded')
  })
  
  iframe.addEventListener('error', () => {
    console.error('🎥 Error loading video')
    showVideoPlaceholder(container)
  })
  
  container.appendChild(iframe)
  
  // Setup Vimeo player API if needed for advanced tracking
  setupVimeoPlayerAPI(iframe, videoId)
}

function setupVimeoPlayerAPI(iframe, videoId) {
  // Load Vimeo Player SDK for advanced event tracking
  if (!window.Vimeo) {
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    script.onload = () => {
      initVimeoPlayer(iframe, videoId)
    }
    document.head.appendChild(script)
  } else {
    initVimeoPlayer(iframe, videoId)
  }
}

function initVimeoPlayer(iframe, videoId) {
  try {
    const player = new window.Vimeo.Player(iframe)
    
    // Track video events
    player.on('play', () => {
      console.log('🎥 Video started playing')
      // Additional analytics tracking here
    })
    
    player.on('pause', () => {
      console.log('🎥 Video paused')
    })
    
    player.on('ended', () => {
      console.log('🎥 Video finished')
      // Track completion for analytics
      if (window.gtag) {
        gtag('event', 'video_complete', {
          event_category: 'engagement',
          event_label: 'vsl_video_complete'
        })
      }
    })
    
    // Track viewing progress
    player.on('timeupdate', (data) => {
      const progress = (data.seconds / data.duration) * 100
      
      // Track 25%, 50%, 75% milestones
      if (progress >= 25 && !player._tracked25) {
        player._tracked25 = true
        console.log('🎥 Video 25% watched')
      }
      
      if (progress >= 50 && !player._tracked50) {
        player._tracked50 = true
        console.log('🎥 Video 50% watched')
      }
      
      if (progress >= 75 && !player._tracked75) {
        player._tracked75 = true
        console.log('🎥 Video 75% watched')
      }
    })
    
  } catch (error) {
    console.error('🎥 Error initializing Vimeo player:', error)
  }
}

function showVideoPlaceholder(container) {
  container.innerHTML = `
    <div class="video-placeholder">
      <div class="placeholder-content">
        <div class="play-button">▶</div>
        <h3>VSL Video Coming Soon</h3>
        <p>Your 45-60 second video will appear here once uploaded to Vimeo</p>
        <div class="placeholder-details">
          <strong>Setup Required:</strong>
          <br>1. Upload video to Vimeo
          <br>2. Update VITE_VIMEO_VIDEO_ID in environment
        </div>
      </div>
    </div>
  `
  
  // Add click handler for demo purposes
  const playButton = container.querySelector('.play-button')
  if (playButton) {
    playButton.addEventListener('click', () => {
      console.log('🎥 Placeholder video clicked')
      
      // Track the interaction
      import('./analytics.js').then(({ trackVideoPlay }) => {
        trackVideoPlay()
      })
      
      // Animate the button
      playButton.style.transform = 'scale(1.2)'
      setTimeout(() => {
        playButton.style.transform = 'scale(1)'
      }, 200)
    })
  }
  
  console.log('🎥 Video placeholder displayed')
}

// Utility function to check if video is in viewport (for lazy loading)
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
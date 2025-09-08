// Typeform integration for Japour Gym VSL - Updated for Live Embed

export function initTypeform() {
  console.log('🔧 Initializing Typeform...')
  
  const typeformId = import.meta.env.VITE_TYPEFORM_ID
  
  if (!typeformId || typeformId === 'placeholder') {
    console.log('🔧 Typeform ID not set - showing placeholder')
    showTypeformPlaceholder()
    return
  }
  
  console.log('🔧 Loading Typeform:', typeformId)
  
  // Load Typeform embed script
  loadTypeformScript().then(() => {
    setupTypeformLiveEmbed(typeformId)
  }).catch(error => {
    console.error('🔧 Error loading Typeform:', error)
    showTypeformPlaceholder()
  })
}

function loadTypeformScript() {
  return new Promise((resolve, reject) => {
    // Check if Typeform script is already loaded
    if (document.querySelector('script[src*="embed.typeform.com"]')) {
      resolve()
      return
    }
    
    console.log('🔧 Loading Typeform embed script...')
    
    const script = document.createElement('script')
    script.src = '//embed.typeform.com/next/embed.js'
    script.async = true
    script.onload = () => {
      console.log('🔧 Typeform script loaded successfully')
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Typeform script'))
    }
    
    document.head.appendChild(script)
  })
}

function setupTypeformLiveEmbed(typeformId) {
  const container = document.getElementById('typeform-container')
  const fallbackButton = document.getElementById('fallback-cta')
  
  if (!container) {
    console.error('🔧 Typeform container not found')
    return
  }
  
  try {
    // Hide fallback button since we have real form
    if (fallbackButton) {
      fallbackButton.style.display = 'none'
    }
    
    // Clear container and create live embed div
    container.innerHTML = ''
    
    // Create the live embed div
    const embedDiv = document.createElement('div')
    embedDiv.setAttribute('data-tf-live', typeformId)
    
    // Add optional parameters for customization
    embedDiv.setAttribute('data-tf-medium', 'snippet')
    embedDiv.setAttribute('data-tf-hide-headers', 'true')
    embedDiv.setAttribute('data-tf-hide-footer', 'true')
    embedDiv.setAttribute('data-tf-opacity', '100')
    
    // Add hidden fields for tracking
    embedDiv.setAttribute('data-tf-hidden', 'utm_source=vsl-landing-page,utm_medium=organic,utm_campaign=33-day-program')
    
    // Set inline styles for the embed
    embedDiv.style.width = '100%'
    embedDiv.style.height = '500px'
    
    // Append to container
    container.appendChild(embedDiv)
    
    // Set up event listeners for form interactions
    setupTypeformEventListeners()
    
    console.log('🔧 Typeform live embed created successfully')
    
    // Show container with fade-in effect
    container.style.opacity = '1'
    
  } catch (error) {
    console.error('🔧 Error creating Typeform live embed:', error)
    showTypeformPlaceholder()
  }
}

function setupTypeformEventListeners() {
  // Listen for Typeform events if available
  if (window.tf && window.tf.live) {
    // Form ready event
    window.tf.live.on('form_ready', function(event) {
      console.log('🔧 Typeform is ready')
    })
    
    // Form submit event
    window.tf.live.on('form_submit', function(event) {
      console.log('🔧 Form submitted:', event)
      
      // Track form submission
      import('./analytics.js').then(({ trackFormSubmission }) => {
        trackFormSubmission()
      }).catch(e => console.log('Analytics not available'))
      
      // Optional: Add custom behavior after submission
      // window.location.href = '/thank-you'
    })
    
    // Form close event
    window.tf.live.on('form_close', function(event) {
      console.log('🔧 Form closed')
    })
  }
}

function showTypeformPlaceholder() {
  const container = document.getElementById('typeform-container')
  const fallbackButton = document.getElementById('fallback-cta')
  
  if (!container) return
  
  // Show fallback button
  if (fallbackButton) {
    fallbackButton.style.display = 'inline-block'
    fallbackButton.addEventListener('click', handleFallbackClick)
  }
  
  // Create placeholder in container
  container.innerHTML = `
    <div class="typeform-placeholder">
      <h3>🚀 Multi-Step Application Form</h3>
      <p>Your application form will appear here once Typeform is configured.</p>
      <div class="placeholder-form">
        <input type="text" placeholder="First Name" disabled>
        <input type="email" placeholder="Email Address" disabled>
        <input type="tel" placeholder="Phone Number" disabled>
        <select disabled>
          <option>What's your main fitness goal?</option>
          <option>Weight Loss</option>
          <option>Build Strength</option>
          <option>Improve Fitness</option>
          <option>Body Conditioning</option>
        </select>
        <label class="checkbox-label">
          <input type="checkbox" disabled>
          <span>I'm ready to invest £196 in my fitness transformation</span>
        </label>
        <button disabled>Submit Application →</button>
      </div>
      <p class="setup-note">
        <strong>Setup Required:</strong> Configure Typeform account and update VITE_TYPEFORM_ID
      </p>
      <p class="debug-info">
        <strong>Current ID:</strong> ${import.meta.env.VITE_TYPEFORM_ID || 'Not set'}
      </p>
    </div>
  `
  
  console.log('🔧 Typeform placeholder displayed')
}

function handleFallbackClick() {
  console.log('🔧 Fallback CTA clicked')
  
  // Track the click
  import('./analytics.js').then(({ trackFormClick }) => {
    trackFormClick()
  }).catch(e => console.log('Analytics not available'))
  
  // For now, just alert (replace with actual fallback behavior)
  alert('Thanks for your interest! The application form will be available once setup is complete. Please check back soon or call us directly.')
}
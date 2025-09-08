// Youform integration for Japour Gym VSL

export function initTypeform() {
  console.log('📝 Initializing Youform...')
  
  const youformId = import.meta.env.VITE_YOUFORM_ID
  
  if (!youformId || youformId === 'placeholder') {
    console.log('📝 Youform ID not set - showing placeholder')
    showYouformPlaceholder()
    return
  }
  
  console.log('📝 Loading Youform:', youformId)
  
  // Load Youform embed script
  loadYouformScript().then(() => {
    setupYouformEmbed(youformId)
  }).catch(error => {
    console.error('📝 Error loading Youform:', error)
    showYouformPlaceholder()
  })
}

function loadYouformScript() {
  return new Promise((resolve, reject) => {
    // Check if Youform script is already loaded
    if (window.youform) {
      resolve()
      return
    }
    
    console.log('📝 Loading Youform embed script...')
    
    const script = document.createElement('script')
    script.src = 'https://app.youform.com/embed.js'
    script.async = true
    script.onload = () => {
      console.log('📝 Youform script loaded successfully')
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Youform script'))
    }
    
    document.head.appendChild(script)
  })
}

function setupYouformEmbed(youformId) {
  const container = document.getElementById('typeform-container')
  const fallbackButton = document.getElementById('fallback-cta')
  
  if (!container) {
    console.error('📝 Youform container not found')
    return
  }
  
  try {
    // Hide fallback button since we have real form
    if (fallbackButton) {
      fallbackButton.style.display = 'none'
    }
    
    // Method 1: Try Youform widget embed (if available)
    if (window.youform && window.youform.embed) {
      createYouformWidget(container, youformId)
    } 
    // Method 2: Fallback to iframe embed
    else {
      createYouformIframe(container, youformId)
    }
    
    console.log('📝 Youform embed created successfully')
    
  } catch (error) {
    console.error('📝 Error creating Youform embed:', error)
    showYouformPlaceholder()
  }
}

function createYouformWidget(container, youformId) {
  // Youform widget method (if their API supports it)
  const widget = window.youform.embed({
    formId: youformId,
    container: container,
    height: 500,
    // Custom styling
    theme: {
      primaryColor: '#4ECDC4', // Mint green
      backgroundColor: '#1a1a1a', // Dark theme
      textColor: '#ffffff'
    },
    // Hidden fields for tracking
    hidden: {
      utm_source: 'vsl-landing-page',
      utm_medium: 'organic',
      utm_campaign: '33-day-program'
    },
    // Callback functions
    onReady: function() {
      console.log('📝 Youform widget is ready')
      container.style.opacity = '1'
    },
    onSubmit: function(event) {
      console.log('📝 Form submitted:', event)
      
      // Track form submission
      import('./analytics.js').then(({ trackFormSubmission }) => {
        trackFormSubmission()
      })
      
      // Optional: Show success message or redirect
      showSuccessMessage()
    }
  })
}

function createYouformIframe(container, youformId) {
  // Direct iframe embed method
  console.log('📝 Using Youform iframe embed')
  
  const iframe = document.createElement('iframe')
  iframe.src = `https://app.youform.com/forms/agfu3gle`
  iframe.style.width = '100%'
  iframe.style.height = '500px'
  iframe.style.border = 'none'
  iframe.style.borderRadius = '12px'
  iframe.style.backgroundColor = '#1a1a1a'
  iframe.loading = 'lazy'
  
  // Handle iframe load events
  iframe.addEventListener('load', () => {
    console.log('📝 Youform iframe loaded')
    container.style.opacity = '1'
    
    // Set up message listener for form events
    setupYouformMessageListener()
  })
  
  iframe.addEventListener('error', () => {
    console.error('📝 Youform iframe failed to load')
    showYouformPlaceholder()
  })
  
  container.appendChild(iframe)
}

function setupYouformMessageListener() {
  // Listen for messages from Youform iframe
  window.addEventListener('message', (event) => {
    // Verify origin for security
    if (event.origin !== 'https://youform.com') return
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      
      if (data.type === 'youform_submit') {
        console.log('📝 Youform submission detected via postMessage')
        
        // Track form submission
        import('./analytics.js').then(({ trackFormSubmission }) => {
          trackFormSubmission()
        })
        
        showSuccessMessage()
      }
      
      if (data.type === 'youform_ready') {
        console.log('📝 Youform ready via postMessage')
      }
      
    } catch (error) {
      console.log('📝 Non-JSON message from Youform (probably normal)')
    }
  })
}

function setupYouformPopup(youformId) {
  // Alternative popup method for CTA buttons
  const ctaButton = document.getElementById('cta-button')
  
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      // Open Youform in popup window
      const popup = window.open(
        `https://youform.com/f/${youformId}?utm_source=vsl-cta-button`,
        'youform',
        'width=800,height=600,scrollbars=yes,resizable=yes,centerscreen=yes'
      )
      
      // Focus the popup
      if (popup) {
        popup.focus()
      }
      
      // Track the popup open
      import('./analytics.js').then(({ trackFormClick }) => {
        trackFormClick()
      })
    })
  }
}

function showYouformPlaceholder() {
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
    <div class="youform-placeholder">
      <h3>🚀 Multi-Step Application Form</h3>
      <p>Your application form will appear here once Youform is configured.</p>
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
        <strong>Setup Required:</strong> Configure Youform account and update VITE_YOUFORM_ID
      </p>
    </div>
  `
  
  console.log('📝 Youform placeholder displayed')
}

function showSuccessMessage() {
  const container = document.getElementById('typeform-container')
  
  // Create success overlay
  const successOverlay = document.createElement('div')
  successOverlay.className = 'form-success-overlay'
  successOverlay.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✅</div>
      <h3>Application Submitted!</h3>
      <p>Thank you for your interest in the 33-day program. Jude will call you within 24 hours to discuss your fitness goals.</p>
      <p class="next-steps">
        <strong>What happens next?</strong><br>
        • Personal consultation call<br>
        • Program customization<br>
        • Schedule your first session
      </p>
    </div>
  `
  
  // Style the overlay
  successOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    z-index: 10;
  `
  
  // Position container relatively if not already
  if (container) {
    container.style.position = 'relative'
    container.appendChild(successOverlay)
    
    // Remove overlay after 10 seconds
    setTimeout(() => {
      successOverlay.remove()
    }, 10000)
  }
}

function handleFallbackClick() {
  console.log('📝 Fallback CTA clicked')
  
  // Track the click
  import('./analytics.js').then(({ trackFormClick }) => {
    trackFormClick()
  })
  
  // For now, just alert (replace with actual fallback behavior)
  alert('Thanks for your interest! The application form will be available once Youform is configured. Please check back soon or call us directly.')
}

// Export additional functions for manual control
export function openYouformPopup() {
  const youformId = import.meta.env.VITE_YOUFORM_ID
  if (youformId && youformId !== 'placeholder') {
    setupYouformPopup(youformId)
  }
}

export function redirectToYouform() {
  const youformId = import.meta.env.VITE_YOUFORM_ID
  if (youformId && youformId !== 'placeholder') {
    window.open(`https://youform.com/f/${youformId}?utm_source=vsl-redirect`, '_blank')
  }
}
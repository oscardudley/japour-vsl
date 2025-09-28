// src/js/typeform.js - Enhanced Debug Version

export function initTypeform() {
  console.log('🔧 Initializing Typeform...')
  
  const typeformId = import.meta.env.VITE_TYPEFORM_ID
  
  if (!typeformId || typeformId === 'placeholder') {
    console.log('🔧 Typeform ID not set - showing placeholder')
    showTypeformPlaceholder()
    return
  }
  
  console.log('🔧 Loading Typeform:', typeformId)
  console.log('🔧 Environment check:', {
    isDev: import.meta.env.VITE_DEV_MODE,
    currentURL: window.location.href,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  })
  
  // Add debug container first
  addDebugInfo(typeformId)
  
  // Load Typeform script first, then create embed
  loadTypeformScript()
    .then(() => {
      createTypeformEmbed(typeformId)
    })
    .catch(error => {
      console.error('🔧 Error loading Typeform:', error)
      showTypeformError(error)
    })
}

function addDebugInfo(typeformId) {
  const container = document.getElementById('typeform-container')
  if (!container) return
  
  // Add debug info above the form
  const debugDiv = document.createElement('div')
  debugDiv.id = 'typeform-debug'
  debugDiv.style.cssText = `
    background: #1a1a1a;
    color: #4ECDC4;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #333;
  `
  debugDiv.innerHTML = `
    <strong>🔍 Typeform Debug Info:</strong><br>
    Form ID: ${typeformId}<br>
    Status: <span id="debug-status">Initializing...</span><br>
    Script: <span id="debug-script">Loading...</span><br>
    Embed: <span id="debug-embed">Waiting...</span><br>
    <button onclick="window.debugTypeform()" style="margin-top: 5px; padding: 5px 10px; background: #4ECDC4; border: none; border-radius: 3px; color: #1a1a1a; cursor: pointer;">Force Reload</button>
  `
  
  container.parentNode.insertBefore(debugDiv, container)
}

function updateDebugStatus(step, status) {
  const element = document.getElementById(`debug-${step}`)
  if (element) {
    element.textContent = status
    element.style.color = status.includes('✅') ? '#27ae60' : 
                         status.includes('❌') ? '#e74c3c' : '#4ECDC4'
  }
}

function loadTypeformScript() {
  return new Promise((resolve, reject) => {
    updateDebugStatus('status', 'Loading script...')
    
    // Check if script is already loaded
    if (document.querySelector('script[src*="embed.typeform.com"]')) {
      console.log('🔧 Typeform script already loaded')
      updateDebugStatus('script', '✅ Already loaded')
      resolve()
      return
    }
    
    console.log('🔧 Loading Typeform embed script...')
    updateDebugStatus('script', 'Downloading...')
    
    const script = document.createElement('script')
    script.src = 'https://embed.typeform.com/next/embed.js'
    script.async = true
    
    script.onload = () => {
      console.log('🔧 Typeform script loaded successfully')
      updateDebugStatus('script', '✅ Loaded')
      
      // Wait a bit longer and check if Typeform object exists
      setTimeout(() => {
        if (window.tf) {
          console.log('🔧 Typeform object available:', Object.keys(window.tf))
          updateDebugStatus('script', '✅ Ready with tf object')
        } else {
          console.log('🔧 Script loaded but no tf object found')
          updateDebugStatus('script', '⚠️ No tf object')
        }
        resolve()
      }, 500)
    }
    
    script.onerror = () => {
      console.error('🔧 Failed to load Typeform script')
      updateDebugStatus('script', '❌ Failed to load')
      reject(new Error('Failed to load Typeform script'))
    }
    
    document.head.appendChild(script)
  })
}

function createTypeformEmbed(typeformId) {
  const container = document.getElementById('typeform-container')
  const fallbackButton = document.getElementById('fallback-cta')
  
  if (!container) {
    console.error('🔧 Typeform container not found')
    updateDebugStatus('embed', '❌ Container not found')
    return
  }
  
  try {
    updateDebugStatus('status', 'Creating embed...')
    updateDebugStatus('embed', 'Creating div...')
    
    // Hide fallback button
    if (fallbackButton) {
      fallbackButton.style.display = 'none'
    }
    
    // Clear container but keep debug info
    container.innerHTML = ''
    
    // Create the embed div exactly as Typeform recommends
    const embedDiv = document.createElement('div')
    embedDiv.setAttribute('data-tf-live', typeformId)
    
    // Add more attributes for debugging
    embedDiv.setAttribute('data-tf-opacity', '100')
    embedDiv.setAttribute('data-tf-iframe-props', 'title=Registration Form')
    embedDiv.setAttribute('data-tf-medium', 'snippet')
    
    // Try different hiding options
    embedDiv.setAttribute('data-tf-hide-headers', 'true')
    embedDiv.setAttribute('data-tf-hide-footer', 'true')
    
    // Set explicit dimensions
    embedDiv.style.cssText = `
      width: 100% !important;
      height: 500px !important;
      min-height: 500px !important;
      border: 2px solid #4ECDC4 !important;
      border-radius: 8px !important;
      background: #f5f5f5 !important;
      position: relative !important;
    `
    
    // Add a loading indicator inside
    embedDiv.innerHTML = `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #666;
      ">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #ddd;
          border-top: 3px solid #4ECDC4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        "></div>
        Loading form...
      </div>
    `
    
    // Add to container
    container.appendChild(embedDiv)
    updateDebugStatus('embed', '✅ Div created')
    
    // Monitor for changes
    monitorEmbedChanges(embedDiv, typeformId)
    
    console.log('🔧 Typeform embed created successfully')
    console.log('🔧 Embed element:', embedDiv)
    console.log('🔧 Container:', container)
    
    updateDebugStatus('status', '✅ Embed created')
    
    // Set up event listeners
    setupTypeformEventListeners()
    
    // Show container with fade-in
    container.style.opacity = '1'
    container.classList.add('typeform-loaded')
    
  } catch (error) {
    console.error('🔧 Error creating Typeform embed:', error)
    updateDebugStatus('embed', '❌ Creation failed')
    updateDebugStatus('status', '❌ Failed')
    showTypeformError(error)
  }
}

function monitorEmbedChanges(embedDiv, typeformId) {
  let checkCount = 0
  const maxChecks = 20
  
  const checkEmbed = () => {
    checkCount++
    
    // Check if iframe was created
    const iframe = embedDiv.querySelector('iframe')
    if (iframe) {
      console.log('🔧 ✅ Iframe found!', iframe)
      updateDebugStatus('embed', `✅ Iframe loaded (${iframe.src.substring(0, 50)}...)`)
      updateDebugStatus('status', '✅ Form should be visible')
      
      // Remove loading indicator
      const loader = embedDiv.querySelector('div')
      if (loader) loader.remove()
      
      return
    }
    
    // Check for any child elements
    if (embedDiv.children.length > 1) {
      console.log('🔧 Embed children:', embedDiv.children)
      updateDebugStatus('embed', `⚠️ Has ${embedDiv.children.length} children`)
    }
    
    updateDebugStatus('embed', `⏳ Checking... (${checkCount}/${maxChecks})`)
    
    if (checkCount < maxChecks) {
      setTimeout(checkEmbed, 1000)
    } else {
      console.log('🔧 ❌ Embed never loaded iframe')
      updateDebugStatus('embed', '❌ No iframe after 20s')
      updateDebugStatus('status', '❌ Load timeout')
      
      // Show manual link as fallback
      embedDiv.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #666;">
          <h3>Form Loading Issue</h3>
          <p>The form isn't loading in embed mode.</p>
          <a href="https://form.typeform.com/to/${typeformId}" 
             target="_blank" 
             style="
               display: inline-block;
               padding: 15px 30px;
               background: #4ECDC4;
               color: #1a1a1a;
               text-decoration: none;
               border-radius: 5px;
               font-weight: bold;
               margin-top: 10px;
             ">
            Open Form in New Tab →
          </a>
        </div>
      `
    }
  }
  
  setTimeout(checkEmbed, 2000) // Start checking after 2 seconds
}

function setupTypeformEventListeners() {
  // Enhanced postMessage listener
  window.addEventListener('message', function(event) {
    console.log('🔧 Received message:', event)
    
    // Log all messages for debugging
    if (event.data && typeof event.data === 'object') {
      console.log('🔧 Message data:', event.data)
      updateDebugStatus('status', `📨 Got: ${event.data.type || 'unknown'}`)
    }
    
    // Ensure the message is from Typeform
    if (!event.origin.includes('typeform.com')) {
      return
    }
    
    if (event.data.type === 'form_ready') {
      console.log('🔧 ✅ Typeform is ready!')
      updateDebugStatus('status', '✅ Form ready!')
    }
    
    if (event.data.type === 'form_submit') {
      console.log('🔧 ✅ Form submitted!')
      updateDebugStatus('status', '✅ Form submitted!')
      
      // Track form submission
      import('./analytics.js').then(({ trackFormSubmission }) => {
        trackFormSubmission()
      }).catch(e => console.log('Analytics not available'))
    }
  })
}

function showTypeformError(error) {
  const container = document.getElementById('typeform-container')
  if (!container) return
  
  container.innerHTML = `
    <div style="
      background: #2c1810;
      border: 1px solid #e74c3c;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      color: #e74c3c;
    ">
      <h3>❌ Typeform Loading Error</h3>
      <p>Error: ${error.message}</p>
      <button onclick="location.reload()" style="
        padding: 10px 20px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
      ">Retry</button>
    </div>
  `
}

// Add global debug function
window.debugTypeform = function() {
  console.log('🔧 Manual Typeform reload triggered')
  const debugDiv = document.getElementById('typeform-debug')
  if (debugDiv) debugDiv.remove()
  initTypeform()
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
  
  // Create placeholder
  container.innerHTML = `
    <div class="typeform-placeholder">
      <div class="placeholder-icon">📝</div>
      <h3>Application Form</h3>
      <p>Your multi-step application form will appear here once configured.</p>
      
      <div class="placeholder-form">
        <div class="form-field">
          <input type="text" placeholder="First Name" disabled>
        </div>
        <div class="form-field">
          <input type="email" placeholder="Email Address" disabled>
        </div>
        <div class="form-field">
          <input type="tel" placeholder="Phone Number" disabled>
        </div>
        <div class="form-field">
          <select disabled>
            <option>What's your main fitness goal?</option>
            <option>Weight Loss</option>
            <option>Build Strength</option>
            <option>Improve Fitness</option>
            <option>Body Conditioning</option>
          </select>
        </div>
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" disabled>
            <span>I'm ready to invest £196 in my fitness transformation</span>
          </label>
        </div>
        <button class="cta-button primary" disabled>Submit Application →</button>
      </div>
      
      <div class="setup-info">
        <h4>🚀 Setup Required:</h4>
        <ol>
          <li>Replace placeholder Typeform ID in .env file</li>
          <li>Current ID: <code>${import.meta.env.VITE_TYPEFORM_ID || 'Not set'}</code></li>
          <li>Set <code>VITE_TYPEFORM_ID=01K4N0NVFVZX83HZ5R12J42TTQ</code></li>
        </ol>
      </div>
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
  
  // Show a more user-friendly message
  const message = `
    Thanks for your interest in the 33-Day Program!
    
    The application form is currently being set up. 
    
    In the meantime, you can:
    • Call us directly
    • Email us your details
    • Check back in a few minutes
    
    We'll be in touch within 24 hours!
  `
  
  alert(message)
}
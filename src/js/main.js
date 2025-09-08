// Main JavaScript for Japour Gym VSL
import '../css/main.css'
import { initAnalytics, trackFormClick, trackVideoPlay } from './analytics.js'
import { initTypeform } from './typeform.js'
import { initVideoPlayer } from './video.js'

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏋️ Japour Gym VSL Loading...')
  
  // Initialize core functionality
  initAnalytics()
  initVideoPlayer()
  initTypeform()
  
  // Set up event listeners
  setupEventListeners()
  
  // Add smooth scrolling
  initSmoothScrolling()
  
  console.log('✅ VSL fully loaded')
})

function setupEventListeners() {
  // Primary CTA button
  const primaryCTA = document.getElementById('primary-cta')
  if (primaryCTA) {
    primaryCTA.addEventListener('click', handleCTAClick)
  }
  
  // Fallback CTA button (for before Typeform is set up)
  const fallbackCTA = document.getElementById('fallback-cta')
  if (fallbackCTA) {
    fallbackCTA.addEventListener('click', handleCTAClick)
  }
  
  // Track scroll depth for analytics
  setupScrollTracking()
}

function handleCTAClick(event) {
  console.log('CTA clicked')
  
  // Track the click
  trackFormClick()
  
  // If Typeform is not ready, scroll to form section
  const isTypeformReady = document.querySelector('.typeform-embed')
  if (!isTypeformReady) {
    event.preventDefault()
    
    const formSection = document.getElementById('form-section')
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}

function initSmoothScrolling() {
  // Add smooth scrolling to any anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

function setupScrollTracking() {
  let scrolled50 = false
  let scrolled75 = false
  
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    
    // Track scroll milestones
    if (scrollPercent > 50 && !scrolled50) {
      scrolled50 = true
      console.log('User scrolled 50%')
      // You can add analytics tracking here
    }
    
    if (scrollPercent > 75 && !scrolled75) {
      scrolled75 = true
      console.log('User scrolled 75%')
      // You can add analytics tracking here
    }
  })
}

// Export for debugging in console
window.VSL = {
  trackFormClick,
  trackVideoPlay,
  version: '1.0.0'
}
// Analytics integration for Japour Gym VSL

export function initAnalytics() {
  console.log('🔍 Initializing analytics...')
  
  // Check if we're in development mode
  const isDev = import.meta.env.VITE_DEV_MODE === 'true'
  
  if (isDev) {
    console.log('📊 Development mode - analytics will log to console')
  }
  
  initFacebookPixel()
  initGoogleAnalytics()
}

function initFacebookPixel() {
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID
  
  if (!pixelId || pixelId === 'placeholder') {
    console.log('📘 Facebook Pixel ID not set - using development mode')
    return
  }
  
  console.log('📘 Initializing Facebook Pixel:', pixelId)
  
  // Facebook Pixel Code
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', pixelId);
  fbq('track', 'PageView');
}

function initGoogleAnalytics() {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  if (!gaId || gaId === 'placeholder') {
    console.log('📈 Google Analytics ID not set - using development mode')
    return
  }
  
  console.log('📈 Initializing Google Analytics:', gaId)
  
  // Google Analytics 4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', gaId);
  
  window.gtag = gtag;
}

export function trackFormClick() {
  console.log('📊 Form click tracked')
  
  // Facebook Pixel
  if (window.fbq) {
    fbq('track', 'InitiateCheckout');
    console.log('📘 FB: InitiateCheckout tracked')
  } else {
    console.log('📘 FB: Would track InitiateCheckout (development mode)')
  }
  
  // Google Analytics
  if (window.gtag) {
    gtag('event', 'form_start', {
      event_category: 'engagement',
      event_label: 'vsl_form_click'
    });
    console.log('📈 GA: form_start tracked')
  } else {
    console.log('📈 GA: Would track form_start (development mode)')
  }
}

export function trackVideoPlay() {
  console.log('📊 Video play tracked')
  
  if (window.fbq) {
    fbq('track', 'ViewContent');
    console.log('📘 FB: ViewContent tracked')
  } else {
    console.log('📘 FB: Would track ViewContent (development mode)')
  }
  
  if (window.gtag) {
    gtag('event', 'video_play', {
      event_category: 'engagement',
      event_label: 'vsl_video'
    });
    console.log('📈 GA: video_play tracked')
  } else {
    console.log('📈 GA: Would track video_play (development mode)')
  }
}

export function trackFormSubmission() {
  console.log('📊 Form submission tracked')
  
  if (window.fbq) {
    fbq('track', 'Lead');
    console.log('📘 FB: Lead tracked')
  } else {
    console.log('📘 FB: Would track Lead (development mode)')
  }
  
  if (window.gtag) {
    gtag('event', 'generate_lead', {
      event_category: 'conversion',
      event_label: 'vsl_form_submit'
    });
    console.log('📈 GA: generate_lead tracked')
  } else {
    console.log('📈 GA: Would track generate_lead (development mode)')
  }
}
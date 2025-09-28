import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import './App.css'

function App() {
  const [currentSection, setCurrentSection] = useState(0)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaValue, setRecaptchaValue] = useState(null)
  const recaptchaRef = useRef(null)
  const totalSections = 10 // 1 landing + 1 news + 1 about + 1 background + 5 content sections + 1 contact section

  useEffect(() => {
    let accumulatedDelta = 0
    let touchStartY = 0
    let touchEndY = 0
    const threshold = 100 // Adjust sensitivity
    const touchThreshold = 50 // Touch swipe threshold

    const handleWheel = (event) => {
      event.preventDefault()
      
      accumulatedDelta += event.deltaY
      
      if (Math.abs(accumulatedDelta) >= threshold) {
        if (accumulatedDelta > 0 && currentSection < totalSections - 1) {
          setCurrentSection(prev => prev + 1)
        } else if (accumulatedDelta < 0 && currentSection > 0) {
          setCurrentSection(prev => prev - 1)
        }
        accumulatedDelta = 0
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && currentSection < totalSections - 1) {
        setCurrentSection(prev => prev + 1)
      } else if (event.key === 'ArrowUp' && currentSection > 0) {
        setCurrentSection(prev => prev - 1)
      }
    }

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
    }

    const handleTouchMove = (event) => {
      // Prevent default scrolling behavior
      event.preventDefault()
    }

    const handleTouchEnd = (event) => {
      touchEndY = event.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY
      
      if (Math.abs(deltaY) > touchThreshold) {
        if (deltaY > 0 && currentSection < totalSections - 1) {
          // Swipe up - go to next section
          setCurrentSection(prev => prev + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          // Swipe down - go to previous section
          setCurrentSection(prev => prev - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentSection])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    
    // Check if reCAPTCHA is completed
    if (!recaptchaValue) {
      alert('Vänligen slutför reCAPTCHA verifieringen.')
      return
    }
    
    setIsSubmitting(true)
    
    const form = event.target
    const formData = new FormData(form)
    if (recaptchaValue) {
      formData.append('g-recaptcha-response', recaptchaValue)
    }
    
    // Check if Formspree ID is available
    const formspreeId = import.meta.env.VITE_FORMSPREE_FORM_ID || 'mrbyzyld'
    if (!formspreeId) {
      alert('Kontaktformuläret är inte konfigurerat. Vänligen kontakta oss via sociala medier.')
      setIsSubmitting(false)
      return
    }
    
    try {
      console.log('Submitting to Formspree:', `https://formspree.io/f/${formspreeId}`)
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        setShowSuccessPopup(true)
        form.reset()
        setRecaptchaValue(null)
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setTimeout(() => {
          setShowSuccessPopup(false)
        }, 4000) // Hide popup after 4 seconds
      } else {
        const errorData = await response.text()
        console.error('Form submission failed:', response.status, errorData)
        alert(`Formul\u00e4ret kunde inte skickas. Status: ${response.status}. F\u00f6rs\u00f6k igen eller kontakta oss via sociala medier.`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert(`Ett fel uppstod: ${error.message}. F\u00f6rs\u00f6k igen eller kontakta oss via sociala medier.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const sections = [
    {
      type: 'landing',
      backgroundImage: `${import.meta.env.BASE_URL}assets/zinzeria.jpg`,
      logo: 'ZINZERIA'
    },
    {
      type: 'news',
      layout: 'news-content',
      backgroundImage: `${import.meta.env.BASE_URL}assets/zinzeria.jpg`
    },
    {
      type: 'about',
      layout: 'about-content',
      backgroundImage: `${import.meta.env.BASE_URL}assets/zinzeria.jpg`
    },
    {
      type: 'background',
      layout: 'background-content',
      backgroundImage: `${import.meta.env.BASE_URL}assets/zinzeria.jpg`
    },
       {
      type: 'content',
      layout: 'image-left',
      title: 'Lead Singer',
      text: 'Magda.<br /><br />Född: - <br /> Från: Göteborg.<br />Favorit band: -',
      image: `${import.meta.env.BASE_URL}assets/logo.jpg`
    },
    {
      type: 'content',
      layout: 'image-right',
      title: 'Lead guitarrist, vocalist and growler',
      text: 'Sebastian Franzén (Logic).<br /><br />Född 1997 och uppvuxen i Göteborg.<br /><br />Favorit band: Lorna Shore.',
      image: `${import.meta.env.BASE_URL}assets/leadsinger.jpg`,
      flipImage: true
    },
     {
      type: 'content',
      layout: 'image-left',
      title: 'Bassist.',
      text: 'Open slot',
      image: `${import.meta.env.BASE_URL}assets/logo.jpg`
    },
      {
      type: 'content',
      layout: 'image-right',
      title: 'Keyboardist',
      text: 'Martin, <br /><br /> Från: Göteborg.<br />Favorit band: -',
      image: `${import.meta.env.BASE_URL}assets/logo.jpg`
    },
    {
      type: 'content',
      layout: 'image-left',
      title: 'Drummer',
      text: 'Nicolas (Nico) kommer ursprungligen från Borås men bor nu i Göteborg. Han har spelat trummor i många olika band, men framför allt i sitt egna.<br /><br />Med en erfarenhet på cirka 20 år både inom liveframträdanden och studio, innehar han en stor fantasi och skapar gärna visioner för andra att se. "The storyline is yet to be revealed" - en mystik som omger hans kreativa process.<br /><br />Att skapa ZINZERIA var roligt och få ihop bandet var en oerhörd känsla. Första lineup-känslan är det bästa enligt Nico. Han spelar med hjärtat varje gång och som han själv säger: "We are all Zinzeria Quote".',
      image: `${import.meta.env.BASE_URL}assets/Drummer.jpg`
    },
    {
      type: 'contact',
      layout: 'contact-social'
    }
  ]

  const currentSectionData = sections[currentSection]

  return (
    <div className="app">
      {currentSectionData.type === 'landing' ? (
        <div 
          className="landing-section"
          style={{ backgroundImage: `url(${currentSectionData.backgroundImage})` }}
        >
        </div>
      ) : currentSectionData.type === 'news' ? (
        <div 
          className="news-section"
          style={{ backgroundImage: `url(${currentSectionData.backgroundImage})` }}
        >
          <div className="news-layout">
            <div className="news-title-container">
              <h2 className="news-title">Nyheter</h2>
            </div>
            <div className="news-content-container">
              <p className="news-text">
                  Du kan nu följa oss på våra sociala medier! Få de senaste uppdateringarna om nya låtar och spelningar. 
                  <br /><br />
                  Se längst ned på sidan för länkar till våra sociala medier.
              </p>
            </div>
          </div>
        </div>
      ) : currentSectionData.type === 'about' ? (
        <div 
          className="about-section"
          style={{ backgroundImage: `url(${currentSectionData.backgroundImage})` }}
        >
          <div className="about-layout">
            <div className="about-title-container">
              <h2 className="about-title">Om oss</h2>
            </div>
            <div className="about-content-container">
              <p className="about-text">
              Vi är ett nyskapat metalband ifrån vår kära stad Göteborg.
                <br /><br />
                För tillfället är vi fortfarande under process med rep och låt skrivning men allt rullar på så vi hoppas på att allt ska va full go till efter nyår.
                <br /><br />
               Följ oss på våra sociala medier för mer updates om kommande låtar och spelningar!
              </p>
              {/* Audio player example - uncomment when you add audio files */}
              {/* 
              <div className="audio-player-container" style={{marginTop: '20px'}}>
                <h3>Lyssna på våra låtar:</h3>
                <audio controls style={{width: '100%', marginBottom: '10px'}}>
                  <source src={`${import.meta.env.BASE_URL}assets/zinzeria-song1.mp3`} type="audio/mpeg" />
                  <source src={`${import.meta.env.BASE_URL}assets/zinzeria-song1.ogg`} type="audio/ogg" />
                  Din webbläsare stöder inte audiospelaren.
                </audio>
              </div>
              */}
            </div>
          </div>
        </div>
      ) : currentSectionData.type === 'background' ? (
        <div 
          className="background-section"
          style={{ backgroundImage: `url(${currentSectionData.backgroundImage})` }}
        >
          <div className="background-layout">
            <div className="background-title-container">
              <h2 className="background-title">Bakgrund till bandet</h2>
            </div>
            <div className="background-content-container">
              <p className="background-text">
                
              I skuggorna av Göteborg föddes Zinzeria år 2025 – ett fantasy metalband där verklighet möter saga. Med symfoniska arrangemang, tunga riff och en sång som växlar mellan mäktiga growls och klara melodiska toner, målar vi musikaliska världar fyllda av ljus och mörker.
                <br /><br />
                    Varje låt är en berättelse. Våra refränger bär på episka stämningar som stannar kvar länge efter sista tonen, och våra konserter blir resor där publiken får kliva in i en annan verklighet. Inspirerade av klassisk metal och tidlösa myter skapar vi något eget – en fantasyvärld i ljudets form.
                    <br /><br />
               Bandet består av fem passionerade musiker, förenade av kärleken till tung musik, starka känslor och kraftfulla framträdanden. Tillsammans är vi Zinzeria – där musiken blir magi och fantasin får liv.
              </p>
            </div>
          </div>
        </div>
      ) : currentSectionData.type === 'contact' ? (
        <div className="contact-section">
          <div className="contact-layout">
            <div className="contact-form-container">
              <h2 className="contact-title">Contact Form</h2>
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Your Name" className="form-input" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Your Email" className="form-input" required />
                </div>
                <div className="form-group">
                  <input type="text" name="subject" placeholder="Subject" className="form-input" required />
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder="Your Message" className="form-textarea" rows="5" required></textarea>
                </div>
                <div className="form-group recaptcha-container">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={
                      window.location.hostname === "localhost"
                        ? import.meta.env.VITE_RECAPTCHA_OFFLINE_KEY // testkey
                        : import.meta.env.VITE_RECAPTCHA_SITE_KEY   // riktig prod key
                    }
                    onChange={(value) => setRecaptchaValue(value)}
                    theme="dark"
                  />
                </div>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isSubmitting || !recaptchaValue}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
            <div className="social-media-container">
              <h2 className="social-title">Social Media</h2>
              <div className="social-icons">
                <a href="#" className="social-link instagram" target="_blank" rel="noopener noreferrer">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61581173254251" className="social-link facebook" target="_blank" rel="noopener noreferrer">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content-section">
          <div className={`content-layout ${currentSectionData.layout}`}>
            <div className="text-container">
              {currentSectionData.title && (
                <h2 className="content-title">{currentSectionData.title}</h2>
              )}
              <p className="content-text" dangerouslySetInnerHTML={{ __html: currentSectionData.text }}></p>
            </div>
            <div className="image-container">
              <img 
                src={currentSectionData.image} 
                alt="Section content" 
                className={`content-image ${currentSectionData.flipImage ? 'flipped' : ''}`}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="section-indicators">
        {sections.map((section, index) => (
          <div 
            key={index}
            className={`indicator ${currentSection === index ? 'active' : ''}`}
            onClick={() => setCurrentSection(index)}
            title={section.type === 'landing' ? 'Hem' : 
                   section.type === 'news' ? 'Nyheter' : 
                   section.type === 'about' ? 'Om oss' : 
                   section.type === 'background' ? 'Bakgrund till bandet' : 
                   section.type === 'contact' ? 'Kontakt' : section.title}
          >
            <span className="indicator-tooltip">
              {section.type === 'landing' ? 'Hem' : 
               section.type === 'news' ? 'Nyheter' : 
               section.type === 'about' ? 'Om oss' : 
               section.type === 'background' ? 'Bakgrund till bandet' : 
               section.type === 'contact' ? 'Kontakt' : section.title}
            </span>
          </div>
        ))}
      </div>
      
      <div className="scroll-hint">
        <p>Scroll, swipe, or use arrow keys to navigate</p>
      </div>
      
      <div className="designer-credit">
        <p>@designed by OTengnér Web and Media</p>
      </div>
      
      {showSuccessPopup && (
        <div className="popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="success-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowSuccessPopup(false)}>
              ×
            </button>
            <h3>Thanks for your message!</h3>
            <p>We will get back to you as soon as possible.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

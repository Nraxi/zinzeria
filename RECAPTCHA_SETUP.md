# Google reCAPTCHA Setup

För att få reCAPTCHA att fungera på din webbplats behöver du skaffa dina egna nycklar från Google.

## Steg för att få reCAPTCHA-nycklar:

1. **Gå till Google reCAPTCHA Admin Console**: https://www.google.com/recaptcha/admin/create

2. **Skapa en ny reCAPTCHA**:
   - Label: "ZINZERIA Contact Form" (eller vad du vill)
   - reCAPTCHA type: Välj "reCAPTCHA v2" -> "I'm not a robot" Checkbox
   - Domains: Lägg till din webbplats domän (t.ex. "zinzeria.com" eller "localhost" för utveckling)

3. **Acceptera Terms of Service** och klicka "Submit"

4. **Kopiera nycklarna**:
   - **Site Key** (public key) - denna används i frontend
   - **Secret Key** (private key) - denna används i backend (Formspree hanterar detta)

## Uppdatera koden:

Uppdatera din `.env` fil med dina riktiga nycklar:

```bash
# I .env filen, ersätt test-värdena:
VITE_FORMSPREE_FORM_ID=din_formspree_form_id
VITE_RECAPTCHA_SITE_KEY=din_recaptcha_site_key
```

**OBS:** Starta om utvecklingsservern (`npm run dev`) efter att du ändrat .env filen.

## Aktuell test-nyckel:
För närvarande används Google's test-nyckel: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`

Denna nyckel fungerar för utveckling men kommer alltid att passera valideringen. För produktion MÅSTE du använda din egen nyckel.

## Formspree integration:
Formspree kommer automatiskt att validera reCAPTCHA-svaret när det inkluderas i form-datan.

## Notering:
reCAPTCHA är inställd på "dark" tema för att matcha din svarta webbplats-design.
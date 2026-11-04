
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";

import {
    FaLeaf,
    FaTimes,
    FaPaperPlane,
    FaRobot,
    FaUser,
    FaMapMarkerAlt,
    FaLocationArrow,
    FaTrash,
    FaMicrophone,
    FaVolumeUp,
    FaStop,
    FaSpinner,
    FaExpand,
    FaCompress,
    FaMinus
} from "react-icons/fa";

// --------------------------------------------------
// API CONFIGURATION
// --------------------------------------------------

const API_BASE_URL = (
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:5000"
        : "https://krishidoot-backend.onrender.com")
).replace(/\/$/, "");

const MASCOT_IMAGE = "/images/krishidoot-farmer.gif";

// --------------------------------------------------
// LANGUAGE CONFIGURATION
// --------------------------------------------------

const languages = [
    { code: "Hindi", label: "हिंदी", speechCode: "hi-IN" },
    { code: "English", label: "English", speechCode: "en-IN" },
    { code: "Bengali", label: "বাংলা", speechCode: "bn-IN" },
    { code: "Tamil", label: "தமிழ்", speechCode: "ta-IN" },
    { code: "Telugu", label: "తెలుగు", speechCode: "te-IN" },
    { code: "Marathi", label: "मराठी", speechCode: "mr-IN" },
    { code: "Gujarati", label: "ગુજરાતી", speechCode: "gu-IN" },
    { code: "Punjabi", label: "ਪੰਜਾਬੀ", speechCode: "pa-IN" },
    { code: "Kannada", label: "ಕನ್ನಡ", speechCode: "kn-IN" },
    { code: "Malayalam", label: "മലയാളം", speechCode: "ml-IN" },
    { code: "Odia", label: "ଓଡ଼ିଆ", speechCode: "or-IN" },
    { code: "Assamese", label: "অসমীয়া", speechCode: "as-IN" }
];

// --------------------------------------------------
// WELCOME MESSAGES
// --------------------------------------------------

const welcomeMessages = {
    Hindi:
        "नमस्ते! मैं KrishiDoot AI हूँ। मुझसे फसल चयन, मिट्टी की सेहत, सिंचाई, खाद और खेती से जुड़ी समस्याओं के बारे में पूछें।",

    English:
        "Namaste! I'm KrishiDoot AI. Ask me about crop selection, soil health, irrigation, fertilizers or farming problems.",

    Bengali:
        "নমস্কার! আমি KrishiDoot AI। ফসল নির্বাচন, মাটির স্বাস্থ্য, সেচ এবং কৃষিকাজের সমস্যা সম্পর্কে আমাকে জিজ্ঞাসা করুন।",

    Tamil:
        "வணக்கம்! நான் KrishiDoot AI. பயிர் தேர்வு, மண் வளம், பாசனம் மற்றும் விவசாயப் பிரச்சினைகள் பற்றி என்னிடம் கேளுங்கள்.",

    Telugu:
        "నమస్కారం! నేను KrishiDoot AI. పంటల ఎంపిక, నేల ఆరోగ్యం, నీటిపారుదల మరియు వ్యవసాయ సమస్యల గురించి నన్ను అడగండి.",

    Marathi:
        "नमस्कार! मी KrishiDoot AI आहे. पीक निवड, मातीचे आरोग्य, सिंचन आणि शेतीच्या समस्यांबद्दल मला विचारा.",

    Gujarati:
        "નમસ્તે! હું KrishiDoot AI છું. પાકની પસંદગી, જમીનનું સ્વાસ્થ્ય, સિંચાઈ અને ખેતીની સમસ્યાઓ વિશે મને પૂછો.",

    Punjabi:
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ KrishiDoot AI ਹਾਂ। ਫਸਲਾਂ ਦੀ ਚੋਣ, ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ ਸਿੰਚਾਈ ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।",

    Kannada:
        "ನಮಸ್ಕಾರ! ನಾನು KrishiDoot AI. ಬೆಳೆ ಆಯ್ಕೆ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ನೀರಾವರಿ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.",

    Malayalam:
        "നമസ്കാരം! ഞാൻ KrishiDoot AI ആണ്. വിള തിരഞ്ഞെടുപ്പ്, മണ്ണിന്റെ ആരോഗ്യം, ജലസേചനം എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ.",

    Odia:
        "ନମସ୍କାର! ମୁଁ KrishiDoot AI। ଫସଲ ଚୟନ, ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଜଳସେଚନ ବିଷୟରେ ପଚାରନ୍ତୁ।",

    Assamese:
        "নমস্কাৰ! মই KrishiDoot AI। শস্য নিৰ্বাচন, মাটিৰ স্বাস্থ্য আৰু জলসিঞ্চনৰ বিষয়ে মোক সোধক।"
};

// --------------------------------------------------
// LOCALIZED SUGGESTIONS
// --------------------------------------------------

const suggestions = {
    Hindi: [
        "मैं कौन सी फसल उगाऊँ?",
        "मिट्टी की सेहत कैसे सुधारूँ?",
        "पानी कैसे बचाऊँ?"
    ],

    English: [
        "Which crop should I grow?",
        "How can I improve soil health?",
        "How can I save irrigation water?"
    ],

    Bengali: [
        "আমি কোন ফসল চাষ করব?",
        "মাটির স্বাস্থ্য কীভাবে উন্নত করব?",
        "সেচের জল কীভাবে বাঁচাব?"
    ],

    Tamil: [
        "எந்தப் பயிரை பயிரிடலாம்?",
        "மண் வளத்தை எப்படி மேம்படுத்துவது?",
        "பாசன நீரை எப்படிச் சேமிப்பது?"
    ],

    Telugu: [
        "నేను ఏ పంటను సాగు చేయాలి?",
        "నేల ఆరోగ్యాన్ని ఎలా మెరుగుపరచాలి?",
        "నీటిని ఎలా ఆదా చేయాలి?"
    ],

    Marathi: [
        "मी कोणते पीक घ्यावे?",
        "मातीचे आरोग्य कसे सुधारावे?",
        "पाणी कसे वाचवावे?"
    ],

    Gujarati: [
        "મારે કયો પાક ઉગાડવો જોઈએ?",
        "જમીનનું સ્વાસ્થ્ય કેવી રીતે સુધારવું?",
        "પાણી કેવી રીતે બચાવવું?"
    ],

    Punjabi: [
        "ਮੈਨੂੰ ਕਿਹੜੀ ਫਸਲ ਬੀਜਣੀ ਚਾਹੀਦੀ ਹੈ?",
        "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਿਵੇਂ ਸੁਧਾਰਾਂ?",
        "ਪਾਣੀ ਕਿਵੇਂ ਬਚਾਈਏ?"
    ],

    Kannada: [
        "ನಾನು ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?",
        "ಮಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?",
        "ನೀರನ್ನು ಹೇಗೆ ಉಳಿಸಬಹುದು?"
    ],

    Malayalam: [
        "ഞാൻ ഏത് വിളയാണ് കൃഷി ചെയ്യേണ്ടത്?",
        "മണ്ണിന്റെ ആരോഗ്യം എങ്ങനെ മെച്ചപ്പെടുത്താം?",
        "വെള്ളം എങ്ങനെ സംരക്ഷിക്കാം?"
    ],

    Odia: [
        "ମୁଁ କେଉଁ ଫସଲ ଚାଷ କରିବି?",
        "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ କିପରି ସୁଧାରିବି?",
        "ଜଳ କିପରି ସଞ୍ଚୟ କରିବି?"
    ],

    Assamese: [
        "মই কোনটো শস্য খেতি কৰিম?",
        "মাটিৰ স্বাস্থ্য কেনেকৈ উন্নত কৰিম?",
        "পানী কেনেকৈ ৰাহি কৰিম?"
    ]
};

// --------------------------------------------------
// MARKDOWN RENDERER
// Formats headings, bold text, bullets and numbering.
// --------------------------------------------------

function renderInline(text) {
    const parts = text.split(
        /(\*\*.*?\*\*|__.*?__|`[^`]+`|\*[^*]+\*)/g
    );

    return parts.map((part, index) => {
        if (
            (part.startsWith("**") && part.endsWith("**")) ||
            (part.startsWith("__") && part.endsWith("__"))
        ) {
            return (
                <strong key={index}>
                    {part.slice(2, -2)}
                </strong>
            );
        }

        if (
            part.startsWith("*") &&
            part.endsWith("*")
        ) {
            return (
                <em key={index}>
                    {part.slice(1, -1)}
                </em>
            );
        }

        if (
            part.startsWith("`") &&
            part.endsWith("`")
        ) {
            return (
                <code key={index}>
                    {part.slice(1, -1)}
                </code>
            );
        }

        return part;
    });
}

function FormattedMessage({ text }) {
    const lines = String(text || "").split(/\r?\n/);

    return (
        <div className="kdw-formatted">

            {lines.map((line, index) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    return (
                        <div
                            className="kdw-line-space"
                            key={index}
                        />
                    );
                }

                const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
                const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
                const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);

                if (heading) {
                    return (
                        <div className="kdw-heading" key={index}>
                            {renderInline(heading[1])}
                        </div>
                    );
                }

                if (bullet) {
                    return (
                        <div className="kdw-list-item" key={index}>
                            <span className="kdw-bullet">•</span>
                            <span>{renderInline(bullet[1])}</span>
                        </div>
                    );
                }

                if (numbered) {
                    return (
                        <div className="kdw-list-item" key={index}>
                            <span className="kdw-number">
                                {trimmed.match(/^\d+/)[0]}.
                            </span>
                            <span>{renderInline(numbered[1])}</span>
                        </div>
                    );
                }

                return (
                    <div className="kdw-paragraph" key={index}>
                        {renderInline(trimmed)}
                    </div>
                );
            })}

        </div>
    );
}

// --------------------------------------------------
// CSS
// --------------------------------------------------

const styles = `

/* MAIN FLOATING CONTAINER */

.kdw-root {
  position: fixed;
  right: 20px;
  bottom: 12px;
  z-index: 99999;
  color: #edf7ef;
  font-family: inherit;
}

.kdw-root *,
.kdw-root *::before,
.kdw-root *::after {
  box-sizing: border-box;
}

/* FARMER MASCOT */

.kdw-launcher {
  width: 175px;
  height: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  gap: 0;
  padding: 0;

  border: none;
  border-radius: 0;
  outline: none;
  background: transparent;
  box-shadow: none;

  cursor: pointer;
  overflow: visible;

  transition: transform .25s ease;
}

.kdw-launcher:hover {
  transform: translateY(-7px) scale(1.04);
}

/* The GIF itself has a transparent background.
   Do not add a circle, colored background or border. */

.kdw-launcher img {
  display: block;

  width: 175px;
  height: 185px;

  max-width: none;

  object-fit: contain;
  object-position: center bottom;

  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;

  filter: drop-shadow(0 5px 8px rgba(0,0,0,.30));

  pointer-events: none;
}

/* FARMER NAME */

.kdw-launcher-name {
  display: inline-block;

  padding: 6px 17px;
  margin-top: 2px;

  border-radius: 20px;

  background: #c5ff70;
  color: #10351e;

  font-size: 14px;
  font-weight: 850;

  white-space: nowrap;

  box-shadow: 0 4px 12px rgba(0,0,0,.25);
}

/* CHAT WINDOW */

.kdw-panel {
  position: absolute;
  right: 0;
  bottom: 228px;

  width: min(500px, calc(100vw - 32px));
  height: min(740px, calc(100dvh - 255px));
  min-height: 400px;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  min-width: 0;

  background: #0b1b12;
  border: 1px solid rgba(193,255,112,.22);
  border-radius: 20px;

  box-shadow: 0 20px 70px rgba(0,0,0,.45);

  animation: kdw-in .22s ease;
}

@keyframes kdw-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* FULL SCREEN */

.kdw-panel.expanded {
  position: fixed;
  inset: 12px;

  width: auto;
  height: auto;

  min-height: 0;

  z-index: 100000;

  border-radius: 17px;
}

/* HEADER */

.kdw-header {
  padding: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
  flex-shrink: 0;

  background: linear-gradient(120deg,#173a25,#10251a);
  border-bottom: 1px solid #31523b;
}

.kdw-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.kdw-logo {
  width: 43px;
  height: 43px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 13px;

  background: #c5ff70;
  color: #10251a;

  font-size: 20px;
}

.kdw-title {
  font-size: 18px;
  font-weight: 850;
}

.kdw-subtitle {
  color: #abc2af;
  font-size: 11px;
  margin-top: 4px;
}

.kdw-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.kdw-icon-btn {
  width: 37px;
  height: 37px;

  border: 0;
  border-radius: 9px;

  background: transparent;
  color: #c5d5c8;

  font-size: 14px;
  cursor: pointer;
}

.kdw-icon-btn:hover {
  color: #c5ff70;
  background: rgba(255,255,255,.06);
}

/* LANGUAGE AND LOCATION */

.kdw-settings {
  padding: 13px 16px;

  display: flex;
  align-items: center;
  gap: 12px;

  flex-shrink: 0;

  background: #10251a;
  border-bottom: 1px solid #294632;
}

.kdw-language {
  flex: 1;
  min-width: 0;
}

.kdw-settings label {
  display: block;
  color: #a7b9ab;
  font-size: 11px;
  margin-bottom: 6px;
}

.kdw-settings select,
.kdw-location-input {
  width: 100%;

  background: #07150e;
  border: 1px solid #31523b;
  border-radius: 9px;

  color: white;

  padding: 10px 11px;
  outline: none;

  font-size: 12px;
}

.kdw-settings details {
  position: relative;
  flex-shrink: 0;
}

.kdw-location-summary {
  list-style: none;

  cursor: pointer;

  color: #c5ff70;

  font-size: 12px;

  padding: 12px;

  border: 1px solid #365b41;
  border-radius: 9px;
}

.kdw-location-summary::-webkit-details-marker {
  display: none;
}

.kdw-location-content {
  position: absolute;
  z-index: 10;

  right: 0;
  top: calc(100% + 8px);

  width: 280px;
  max-width: calc(100vw - 45px);

  padding: 14px;

  background: #10251a;
  border: 1px solid #365b41;
  border-radius: 12px;

  box-shadow: 0 12px 35px rgba(0,0,0,.4);
}

.kdw-location-input {
  margin-bottom: 8px;
}

.kdw-gps {
  width: 100%;

  background: #193624;
  color: #c5ff70;

  border: 1px solid #365b41;
  border-radius: 8px;

  padding: 9px;

  font-size: 11px;
  cursor: pointer;
}

.kdw-status {
  font-size: 10px;
  color: #a7b9ab;
  margin-top: 7px;
  line-height: 1.5;
}

/* MESSAGES */

.kdw-messages {
  flex: 1;
  min-height: 0;
  min-width: 0;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 22px 19px;

  background: #0b1b12;

  scroll-behavior: smooth;
}

.kdw-message {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  max-width: 94%;
  min-width: 0;
}

.kdw-message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.kdw-avatar {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background: #254a31;
  color: #c5ff70;

  font-size: 13px;
}

.kdw-message.user .kdw-avatar {
  background: #36553d;
  color: white;
}

.kdw-message-content {
  min-width: 0;
  max-width: 100%;
}

.kdw-bubble {
  background: #142d1e;
  border: 1px solid #294632;

  border-radius: 4px 15px 15px;

  padding: 14px 16px;

  font-size: 13px;
  line-height: 1.8;

  white-space: normal;
  overflow-wrap: anywhere;
}

.kdw-message.user .kdw-bubble {
  background: #244a30;
  border-radius: 15px 4px 15px 15px;
}

/* FORMATTED RESPONSES */

.kdw-formatted {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kdw-heading {
  color: #c5ff70;
  font-size: 14px;
  font-weight: 800;

  margin-top: 9px;
  margin-bottom: 3px;
}

.kdw-paragraph {
  margin: 1px 0;
}

.kdw-list-item {
  display: flex;
  align-items: flex-start;

  gap: 8px;

  padding-left: 3px;
  margin: 2px 0;
}

.kdw-bullet,
.kdw-number {
  flex-shrink: 0;
  color: #c5ff70;
  font-weight: 800;
}

.kdw-bubble strong {
  color: #f4ffdf;
  font-weight: 800;
}

.kdw-bubble code {
  background: rgba(0,0,0,.25);
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 12px;
}

.kdw-line-space {
  height: 5px;
}

/* SPEECH */

.kdw-speech-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;
  margin-top: 7px;

  padding: 6px 9px;

  border: 1px solid #365b41;
  border-radius: 7px;

  background: transparent;
  color: #c5ff70;

  font-size: 10px;
  cursor: pointer;
}

.kdw-speech-btn:hover {
  background: #193624;
}

/* COMPOSER */

.kdw-composer {
  padding: 14px 16px;

  flex-shrink: 0;

  border-top: 1px solid #31523b;
  background: #10251a;
}

.kdw-suggestions {
  display: flex;
  flex-wrap: wrap;

  gap: 7px;
  margin-bottom: 13px;
}

.kdw-suggestion {
  max-width: 100%;

  border: 1px solid #365840;
  border-radius: 20px;

  background: transparent;
  color: #cfe6d2;

  padding: 8px 11px;

  font-size: 11px;
  cursor: pointer;
}

.kdw-suggestion:hover {
  background: #193624;
}

.kdw-input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.kdw-input {
  flex: 1;
  min-width: 0;

  min-height: 48px;
  max-height: 120px;

  resize: vertical;

  background: #07150e;
  border: 1px solid #365840;
  border-radius: 11px;

  color: white;

  outline: none;
  padding: 12px;

  font: inherit;
  font-size: 12px;
  line-height: 1.5;
}

.kdw-input:focus {
  border-color: #c5ff70;
}

.kdw-send,
.kdw-mic {
  width: 46px;
  height: 46px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border: 0;
  border-radius: 11px;

  cursor: pointer;
  font-size: 15px;
}

.kdw-send {
  background: #c5ff70;
  color: #10251a;
}

.kdw-mic {
  background: #193624;
  border: 1px solid #365b41;
  color: #c5ff70;
}

.kdw-mic.listening {
  background: #8b2929;
  border-color: #e56b6b;
  color: white;

  animation: kdw-pulse 1.1s infinite;
}

@keyframes kdw-pulse {
  50% {
    box-shadow: 0 0 0 5px rgba(229,107,107,.15);
  }
}

.kdw-send:disabled,
.kdw-mic:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.kdw-voice-status {
  color: #c5ff70;
  font-size: 10px;
  margin-top: 8px;
}

.kdw-error {
  background: #391c1b;
  color: #ffd8d5;

  border-radius: 9px;
  padding: 10px;

  font-size: 11px;
  margin-bottom: 10px;
}

.kdw-context,
.kdw-footer-note {
  font-size: 10px;
  color: #a7b9ab;
  margin-top: 9px;
  line-height: 1.5;
}

.kdw-footer-note {
  text-align: center;
  font-size: 9px;
}

.kdw-login {
  padding: 18px;
  text-align: center;

  font-size: 12px;
  color: #cbd9ce;
  line-height: 1.7;
}

.kdw-login a {
  color: #c5ff70;
  font-weight: bold;
}

/* MOBILE RESPONSIVENESS */

@media(max-width:600px) {

  .kdw-root {
    right: 8px;
    bottom: 8px;
  }

  .kdw-launcher {
    width: 145px;
    height: 185px;
  }

  .kdw-launcher img {
    width: 145px;
    height: 155px;
  }

  .kdw-launcher-name {
    font-size: 12px;
    padding: 5px 13px;
  }

  .kdw-panel {
    position: fixed;

    right: 12px;
    bottom: 190px;

    width: calc(100vw - 24px);
    height: min(690px, calc(100dvh - 210px));

    min-height: 300px;
  }

  .kdw-panel.expanded {
    inset: 8px;
    width: auto;
    height: auto;
  }

  .kdw-messages {
    padding: 16px 12px;
  }

  .kdw-message {
    max-width: 97%;
  }

  .kdw-header {
    padding: 13px;
  }

  .kdw-composer {
    padding: 11px;
  }

  .kdw-header-actions {
    gap: 1px;
  }

  .kdw-icon-btn {
    width: 32px;
    height: 32px;
  }
}

@media(max-height:550px) {

  .kdw-panel {
    height: calc(100dvh - 220px);
    min-height: 260px;
  }
}

@media(prefers-reduced-motion:reduce) {

  .kdw-panel,
  .kdw-launcher,
  .kdw-mic {
    animation: none;
    transition: none;
  }
}
`;

// --------------------------------------------------
// MAIN FLOATING ASSISTANT
// --------------------------------------------------

export default function AssistantWidget() {

    const { currentUser } = useAuth();

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [language, setLanguage] = useState("Hindi");

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: welcomeMessages.Hindi,
            isWelcome: true
        }
    ]);

    const [input, setInput] = useState("");

    const [locationLabel, setLocationLabel] = useState("");
    const [gpsLocation, setGpsLocation] = useState(null);

    const [locationStatus, setLocationStatus] = useState(
        "Location is optional."
    );

    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const [error, setError] = useState("");
    const [contextUsed, setContextUsed] = useState(null);

    const [speakingIndex, setSpeakingIndex] = useState(null);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // ------------------------------------------------
    // Update welcome message when language changes
    // ------------------------------------------------

    useEffect(() => {

        setMessages((previous) => {

            if (
                previous.length === 1 &&
                previous[0].isWelcome
            ) {

                return [{
                    role: "assistant",
                    content:
                        welcomeMessages[language] ||
                        welcomeMessages.English,
                    isWelcome: true
                }];
            }

            return previous;
        });

    }, [language]);

    // ------------------------------------------------
    // Scroll to latest message
    // ------------------------------------------------

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });

    }, [messages, loading, open]);

    // ------------------------------------------------
    // Cleanup speech services
    // ------------------------------------------------

    useEffect(() => {

        return () => {

            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }

        };

    }, []);

    // ------------------------------------------------
    // Minimize and close
    // ------------------------------------------------

    const minimizeChat = () => {

        setExpanded(false);
        setOpen(false);

    };

    // ------------------------------------------------
    // Full-screen expand / restore
    // ------------------------------------------------

    const toggleExpand = () => {

        setExpanded((previous) => !previous);

    };

    // ------------------------------------------------
    // Stop speech playback
    // ------------------------------------------------

    const stopSpeaking = () => {

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        setSpeakingIndex(null);

    };

    // ------------------------------------------------
    // Text-to-speech
    // ------------------------------------------------

    const speakMessage = (text, index) => {

        if (!("speechSynthesis" in window)) {

            setError(
                "Speech playback is not supported by this browser."
            );

            return;
        }

        if (speakingIndex === index) {

            stopSpeaking();
            return;

        }

        window.speechSynthesis.cancel();

        const selectedLanguage = languages.find(
            (item) => item.code === language
        );

        const languageCode =
            selectedLanguage?.speechCode || "en-IN";

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = languageCode;
        utterance.rate = 0.92;
        utterance.pitch = 1;

        const availableVoices =
            window.speechSynthesis.getVoices();

        const selectedVoice = availableVoices.find(
            (voice) =>
                voice.lang.toLowerCase() === languageCode.toLowerCase()
        ) || availableVoices.find(
            (voice) =>
                voice.lang.toLowerCase().startsWith(
                    languageCode.split("-")[0].toLowerCase()
                )
        );

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            setSpeakingIndex(index);
            setError("");
        };

        utterance.onend = () => {
            setSpeakingIndex(null);
        };

        utterance.onerror = () => {
            setSpeakingIndex(null);
            setError(
                "Could not play this response using speech."
            );
        };

        window.speechSynthesis.speak(utterance);

    };

    // ------------------------------------------------
    // Microphone input
    // ------------------------------------------------

    const toggleVoiceInput = () => {

        if (listening) {

            recognitionRef.current?.stop();
            return;

        }

        if (!currentUser) {

            setError(
                "Please sign in before using voice input."
            );

            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setError(
                "Voice input is not supported in this browser. Please type your question."
            );

            return;
        }

        if (!window.isSecureContext) {

            setError(
                "Microphone access requires HTTPS or localhost."
            );

            return;
        }

        stopSpeaking();
        setError("");

        const selectedLanguage = languages.find(
            (item) => item.code === language
        );

        const recognition = new SpeechRecognition();

        recognition.lang =
            selectedLanguage?.speechCode || "hi-IN";

        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
            setListening(true);
            setError("");
        };

        recognition.onresult = (event) => {

            const transcript =
                event.results?.[0]?.[0]?.transcript;

            if (transcript) {

                setInput((previous) =>
                    previous.trim()
                        ? `${previous.trim()} ${transcript}`
                        : transcript
                );

            }

        };

        recognition.onerror = (event) => {

            setListening(false);

            const errors = {
                "not-allowed":
                    "Microphone permission was denied.",

                "no-speech":
                    "No speech detected. Please try again.",

                "audio-capture":
                    "No microphone was detected.",

                "language-not-supported":
                    "Speech recognition does not support this language here."
            };

            setError(
                errors[event.error] ||
                "Voice input failed. Please try again."
            );

        };

        recognition.onend = () => {

            setListening(false);
            recognitionRef.current = null;

        };

        recognitionRef.current = recognition;

        try {

            recognition.start();

        } catch {

            recognitionRef.current = null;
            setListening(false);

            setError(
                "Could not start the microphone. Please try again."
            );

        }

    };

    // ------------------------------------------------
    // Farmer location permission
    // ------------------------------------------------

    const requestLocation = () => {

        if (!navigator.geolocation) {

            setLocationStatus(
                "Location is not supported by this browser."
            );

            return;
        }

        setLocationStatus(
            "Waiting for location permission..."
        );

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setGpsLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy_m: position.coords.accuracy,
                    consented: true
                });

                setLocationStatus(
                    "Location permission granted."
                );

            },

            () => {

                setGpsLocation(null);

                setLocationStatus(
                    "Location unavailable. Enter your district manually."
                );

            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 600000
            }

        );

    };

    // ------------------------------------------------
    // Send question to Flask backend
    // ------------------------------------------------

    const sendMessage = async (event) => {

        event?.preventDefault();

        const question = input.trim();

        if (!question || loading) return;

        if (!currentUser) {

            setError(
                "Please sign in to use your personalized assistant."
            );

            return;
        }

        if (listening) {
            recognitionRef.current?.stop();
        }

        stopSpeaking();

        setError("");
        setInput("");
        setContextUsed(null);

        const previousHistory = messages
            .filter((item) =>
                item.role === "user" ||
                item.role === "assistant"
            )
            .slice(-8)
            .map(({ role, content }) => ({
                role,
                content
            }));

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: question
            }
        ]);

        setLoading(true);

        try {

            const token = await currentUser.getIdToken();

            const location = {

                ...(locationLabel.trim()
                    ? { label: locationLabel.trim() }
                    : {}),

                ...(gpsLocation || {})

            };

            const response = await axios.post(

                `${API_BASE_URL}/api/assistant/chat`,

                {
                    message: question,
                    language: language,
                    history: previousHistory,
                    location: location
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    timeout: 90000
                }

            );

            const reply = response.data?.reply;

            if (
                typeof reply !== "string" ||
                !reply.trim()
            ) {

                throw new Error(
                    "The assistant returned an invalid response."
                );

            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: reply
                }
            ]);

            setContextUsed(
                response.data.context_used || null
            );

        } catch (err) {

            console.error(
                "KrishiDoot assistant error:",
                err
            );

            setError(
                err.response?.data?.error ||
                (
                    err.code === "ECONNABORTED"
                        ? "The assistant took too long to respond. Please try again."
                        : "Could not connect to KrishiDoot AI."
                )
            );

        } finally {

            setLoading(false);

        }

    };

    // ------------------------------------------------
    // Clear chat
    // ------------------------------------------------

    const clearChat = () => {

        stopSpeaking();

        if (listening) {
            recognitionRef.current?.stop();
        }

        setMessages([{
            role: "assistant",
            content:
                welcomeMessages[language] ||
                welcomeMessages.English,
            isWelcome: true
        }]);

        setContextUsed(null);
        setError("");
        setInput("");

    };

    // ------------------------------------------------
    // Keyboard handling
    // ------------------------------------------------

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();
            sendMessage();

        }

    };

    // ------------------------------------------------
    // RENDER
    // ------------------------------------------------

    return (
        <>
            <style>{styles}</style>

            <div className="kdw-root">

                {/* CHAT PANEL */}

                {open && (

                    <section
                        className={`kdw-panel ${expanded ? "expanded" : ""}`}
                        aria-label="KrishiDoot AI chat"
                    >

                        {/* HEADER */}

                        <header className="kdw-header">

                            <div className="kdw-brand">

                                <div className="kdw-logo">
                                    <FaLeaf />
                                </div>

                                <div>
                                    <div className="kdw-title">
                                        KrishiDoot AI
                                    </div>

                                    <div className="kdw-subtitle">
                                        आपका व्यक्तिगत कृषि सहायक
                                    </div>
                                </div>

                            </div>

                            <div className="kdw-header-actions">

                                <button
                                    type="button"
                                    className="kdw-icon-btn"
                                    onClick={clearChat}
                                    title="Clear conversation"
                                    aria-label="Clear conversation"
                                >
                                    <FaTrash />
                                </button>

                                <button
                                    type="button"
                                    className="kdw-icon-btn"
                                    onClick={toggleExpand}
                                    title={
                                        expanded
                                            ? "Restore window"
                                            : "Expand to full screen"
                                    }
                                    aria-label={
                                        expanded
                                            ? "Restore chat size"
                                            : "Expand chat"
                                    }
                                >
                                    {expanded
                                        ? <FaCompress />
                                        : <FaExpand />}
                                </button>

                                <button
                                    type="button"
                                    className="kdw-icon-btn"
                                    onClick={minimizeChat}
                                    title="Minimize chat"
                                    aria-label="Minimize chat"
                                >
                                    <FaMinus />
                                </button>

                                <button
                                    type="button"
                                    className="kdw-icon-btn"
                                    onClick={minimizeChat}
                                    title="Close assistant"
                                    aria-label="Close assistant"
                                >
                                    <FaTimes />
                                </button>

                            </div>

                        </header>

                        {/* SETTINGS */}

                        <div className="kdw-settings">

                            <div className="kdw-language">

                                <label htmlFor="kdw-language">
                                    Response language
                                </label>

                                <select
                                    id="kdw-language"
                                    value={language}
                                    onChange={(event) => {
                                        setLanguage(event.target.value);
                                        stopSpeaking();
                                    }}
                                >

                                    {languages.map((item) => (

                                        <option
                                            key={item.code}
                                            value={item.code}
                                        >
                                            {item.label} ({item.code})
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <details>

                                <summary className="kdw-location-summary">
                                    <FaMapMarkerAlt /> Location
                                </summary>

                                <div className="kdw-location-content">

                                    <label htmlFor="kdw-location">
                                        District and state
                                    </label>

                                    <input
                                        id="kdw-location"
                                        className="kdw-location-input"
                                        value={locationLabel}
                                        onChange={(event) =>
                                            setLocationLabel(event.target.value)
                                        }
                                        placeholder="e.g. Farrukhabad, Uttar Pradesh"
                                        maxLength={150}
                                    />

                                    <button
                                        type="button"
                                        className="kdw-gps"
                                        onClick={requestLocation}
                                    >
                                        <FaLocationArrow /> Allow GPS location
                                    </button>

                                    <div className="kdw-status">
                                        {locationStatus}
                                    </div>

                                </div>

                            </details>

                        </div>

                        {/* CONVERSATION */}

                        <div
                            className="kdw-messages"
                            aria-live="polite"
                        >

                            {messages.map((message, index) => (

                                <div
                                    key={`${index}-${message.role}`}
                                    className={`kdw-message ${message.role}`}
                                >

                                    <div className="kdw-avatar">

                                        {message.role === "assistant"
                                            ? <FaRobot />
                                            : <FaUser />}

                                    </div>

                                    <div className="kdw-message-content">

                                        <div className="kdw-bubble">

                                            {message.role === "assistant"
                                                ? (
                                                    <FormattedMessage
                                                        text={message.content}
                                                    />
                                                )
                                                : message.content}

                                        </div>

                                        {message.role === "assistant" && (

                                            <button
                                                type="button"
                                                className="kdw-speech-btn"
                                                onClick={() =>
                                                    speakMessage(
                                                        message.content,
                                                        index
                                                    )
                                                }
                                                title="Listen to response"
                                            >

                                                {speakingIndex === index
                                                    ? <FaStop />
                                                    : <FaVolumeUp />}

                                                {speakingIndex === index
                                                    ? "Stop"
                                                    : "Listen"}

                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                            {loading && (

                                <div className="kdw-message assistant">

                                    <div className="kdw-avatar">
                                        <FaRobot />
                                    </div>

                                    <div className="kdw-bubble">
                                        <FaSpinner /> KrishiDoot is thinking...
                                    </div>

                                </div>

                            )}

                            <div ref={messagesEndRef} />

                        </div>

                        {/* COMPOSER */}

                        <div className="kdw-composer">

                            {!currentUser ? (

                                <div className="kdw-login">

                                    Please{" "}

                                    <Link
                                        to="/auth/login"
                                        onClick={minimizeChat}
                                    >
                                        sign in
                                    </Link>

                                    {" "}to access your personalized farming assistant.

                                </div>

                            ) : (

                                <>

                                    <div className="kdw-suggestions">

                                        {(suggestions[language] || suggestions.English)
                                            .map((suggestion) => (

                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    className="kdw-suggestion"
                                                    onClick={() => setInput(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>

                                            ))}

                                    </div>

                                    {error && (

                                        <div
                                            className="kdw-error"
                                            role="alert"
                                        >
                                            {error}
                                        </div>

                                    )}

                                    <form
                                        className="kdw-input-row"
                                        onSubmit={sendMessage}
                                    >

                                        <textarea
                                            className="kdw-input"
                                            value={input}
                                            onChange={(event) =>
                                                setInput(event.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                            placeholder={
                                                listening
                                                    ? "Listening... speak now"
                                                    : "Ask your farming question..."
                                            }
                                            maxLength={4000}
                                            rows={2}
                                            disabled={loading}
                                        />

                                        <button
                                            type="button"
                                            className={`kdw-mic ${listening ? "listening" : ""}`}
                                            onClick={toggleVoiceInput}
                                            disabled={loading}
                                            title="Speak your question"
                                            aria-label="Voice input"
                                        >
                                            {listening
                                                ? <FaStop />
                                                : <FaMicrophone />}
                                        </button>

                                        <button
                                            type="submit"
                                            className="kdw-send"
                                            disabled={
                                                loading ||
                                                !input.trim() ||
                                                listening
                                            }
                                            title="Send message"
                                            aria-label="Send message"
                                        >
                                            {loading
                                                ? <FaSpinner />
                                                : <FaPaperPlane />}
                                        </button>

                                    </form>

                                    {listening && (

                                        <div className="kdw-voice-status">
                                            <FaMicrophone /> Listening in {language}...
                                        </div>

                                    )}

                                    {contextUsed && (

                                        <div className="kdw-context">
                                            Previous predictions used:{" "}
                                            {contextUsed.prediction_records}

                                            {" · "}

                                            Location:{" "}
                                            {contextUsed.location_available
                                                ? "Available"
                                                : "Not provided"}
                                        </div>

                                    )}

                                </>

                            )}

                            <div className="kdw-footer-note">
                                AI guidance can contain errors. Verify important
                                agricultural decisions with a local expert.
                            </div>

                        </div>

                    </section>

                )}

                {/* FLOATING FARMER MASCOT */}

                {!expanded && (

                    <button
                        type="button"
                        className="kdw-launcher"
                        onClick={() => setOpen((previous) => !previous)}
                        aria-label={
                            open
                                ? "Close Kisan Mitra"
                                : "Open Kisan Mitra"
                        }
                        title="Ask Kisan Mitra"
                    >

                        {open ? (

                            <FaTimes className="kdw-launcher-close" />

                        ) : (

                            <>
                                <img
                                    src={MASCOT_IMAGE}
                                    alt="Kisan Mitra - KrishiDoot farmer assistant"
                                    draggable="false"
                                />

                                <span className="kdw-launcher-name">
                                    किसान मित्र
                                </span>
                            </>

                        )}

                    </button>

                )}

            </div>
        </>
    );
}

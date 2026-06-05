import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";

// ── Claude chat API call ──────────────────────────────────────────────────────
async function askClaude(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`Chat error ${res.status}`);
  const data = await res.json();
  return data.reply || "";
}

// ── Animated SVG Avatar Face ──────────────────────────────────────────────────
function AvatarFace({ state, size = 120 }) {
  const mouthRef = useRef(null);
  const timerRef = useRef(null);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Animate mouth when speaking
  useEffect(() => {
    if (state === "speaking") {
      timerRef.current = setInterval(() => setMouthOpen((o) => !o), 110);
    } else {
      clearInterval(timerRef.current);
      setMouthOpen(false);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  const mouth = mouthOpen
    ? "M33,70 Q50,86 67,70" // open
    : "M36,70 Q50,78 64,70"; // gentle smile

  const eyeH = state === "listening" ? 5 : 4;
  const eyeY = state === "speaking" ? 51 : 52;
  const glowOp = state === "speaking" ? 0.25 : 0;
  const crownSc = state === "speaking" ? 1.05 : 1;

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: size,
        height: size,
        display: "block",
        overflow: "visible",
      }}
    >
      {/* Glow ring when speaking */}
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="rgba(184,144,60,0.18)"
        style={{ opacity: glowOp, transition: "opacity .3s" }}
      />

      {/* Background */}
      <circle cx="50" cy="50" r="47" fill="#0D0B09" />

      {/* Gold border */}
      <circle
        cx="50"
        cy="50"
        r="46.5"
        fill="none"
        stroke="#B8903C"
        strokeWidth="1.2"
      />

      {/* Inner subtle ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="rgba(184,144,60,0.15)"
        strokeWidth="0.5"
      />

      {/* Crown — scales slightly when speaking */}
      <g
        transform={`translate(50,50) scale(${crownSc}) translate(-50,-50)`}
        style={{ transition: "transform .3s ease" }}
      >
        <polygon
          points="35,38 41,27 50,33 59,27 65,38 62,42 38,42"
          fill="#B8903C"
        />
        <circle cx="41" cy="27" r="2.8" fill="#F0D483" />
        <circle cx="50" cy="33" r="2.8" fill="#F0D483" />
        <circle cx="59" cy="27" r="2.8" fill="#F0D483" />
        {/* Crown base line */}
        <rect x="36" y="41" width="28" height="2" rx="1" fill="#8B6330" />
      </g>

      {/* Eyes */}
      <rect
        x="28"
        y={eyeY}
        width="16"
        height={eyeH}
        rx={eyeH / 2}
        fill="#D4AC5A"
        style={{ transition: "all .2s ease" }}
      />
      <rect
        x="56"
        y={eyeY}
        width="16"
        height={eyeH}
        rx={eyeH / 2}
        fill="#D4AC5A"
        style={{ transition: "all .2s ease" }}
      />

      {/* Eye shine */}
      <circle cx="31" cy={eyeY + 1} r="1.5" fill="rgba(255,255,255,0.6)" />
      <circle cx="59" cy={eyeY + 1} r="1.5" fill="rgba(255,255,255,0.6)" />

      {/* Mouth */}
      <path
        ref={mouthRef}
        d={mouth}
        stroke="#D4AC5A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ transition: state !== "speaking" ? "all .2s ease" : "none" }}
      />

      {/* Thinking dots */}
      {state === "thinking" &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={43 + i * 7}
            cy={80}
            r="2.5"
            fill="#B8903C"
            style={{
              animation: `thinkDot .9s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}

      {/* EMDAD initial — subtle */}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        fill="rgba(184,144,60,0.07)"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="bold"
      >
        E
      </text>
    </svg>
  );
}

// ── Listening ring pulses ─────────────────────────────────────────────────────
function ListeningRings() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: "50%" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1.5px solid rgba(184,144,60,0.5)",
            animation: `ring 1.8s ${i * 0.55}s ease-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Status label ──────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  en: {
    idle: "Tap the mic to speak",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
    error: "Something went wrong",
  },
  ar: {
    idle: "انقر على الميكروفون للتحدث",
    listening: "أستمع…",
    thinking: "أفكّر…",
    speaking: "أتحدث…",
    error: "حدث خطأ",
  },
};

// ── Quick suggestion chips ────────────────────────────────────────────────────
const CHIPS = {
  en: [
    "Tell me about EMDAD",
    "Show me bedroom collections",
    "What smart furniture do you offer?",
    "How do I book a visit?",
    "What are your services?",
  ],
  ar: [
    "أخبرني عن إمداد",
    "أرني مجموعات غرف النوم",
    "ما هو الأثاث الذكي؟",
    "كيف أحجز زيارة؟",
    "ما هي خدماتكم؟",
  ],
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function VoiceAvatar() {
  const { isAr } = useLang();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle|listening|thinking|speaking|error
  const [voiceLang, setVoiceLang] = useState(() => (isAr ? "ar" : "en"));
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [voices, setVoices] = useState([]);

  const recogRef = useRef(null);
  const synthRef = useRef(null);
  const bottomRef = useRef(null);

  // ── Load voices ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setSpeechSupported(false);
      return;
    }
    synthRef.current = synth;

    const loadVoices = () => {
      const available = synth.getVoices();
      if (available.length) {
        setVoices(available);
      }
    };

    loadVoices();
    const timeoutId = window.setTimeout(loadVoices, 250);
    synth.addEventListener("voiceschanged", loadVoices);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      window.clearTimeout(timeoutId);
    };
  }, []);

  // ── Check speech recognition support ───────────────────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSpeechSupported(false);
  }, []);

  // ── Scroll to bottom of messages ────────────────────────────────────────────
  useEffect(() => {
    if (open)
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
  }, [history, open]);

  // ── Get best voice for language ─────────────────────────────────────────────
  const getVoice = useCallback(
    (lang) => {
      if (!voices.length) return null;
      if (lang === "ar") {
        return (
          voices.find((v) => v.lang === "ar-JO") ||
          voices.find((v) => v.lang === "ar-SA") ||
          voices.find((v) => v.lang?.startsWith("ar")) ||
          voices.find((v) => v.lang?.includes("ar")) ||
          voices.find((v) => v.name?.toLowerCase().includes("arab")) ||
          voices[0] ||
          null
        );
      }
      return (
        voices.find((v) => v.lang === "en-GB") ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang?.startsWith("en")) ||
        voices[0] ||
        null
      );
    },
    [voices],
  );

  const sanitizeSpeechText = useCallback((text) => {
    return text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^[#>*\-]+\s*/gm, "")
      .replace(/[:;][\-~]?[)DPp\(]/g, "")
      .replace(/<3/g, "")
      .replace(/[#*_`~]/g, "")
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
      // Say brand/acronyms as words, not spelled-out letters (TTS reads
      // all-caps as initialisms, so "EMDAD" → "E-M-D-A-D"). Display text is
      // unaffected — this only changes what the speech engine receives.
      .replace(/\bEMDAD\b/g, "Emdad")
      .replace(/\s{2,}/g, " ")
      .trim();
  }, []);

  // ── Speak text out loud ──────────────────────────────────────────────────────
  const speak = useCallback(
    (text, lang) => {
      const synth = synthRef.current;
      if (!synth) return;
      synth.cancel();

      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = lang === "ar" ? "ar-SA" : "en-US";
      utt.rate = lang === "ar" ? 0.88 : 0.92;
      utt.pitch = 1.05;

      let voice = getVoice(lang);
      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang || utt.lang;
      } else if (voices.length) {
        voice = voices[0];
        utt.voice = voice;
        utt.lang = voice.lang || utt.lang;
      }

      utt.onstart = () => setState("speaking");
      utt.onend = () => setState("idle");
      utt.onerror = () => setState("idle");

      synth.speak(utt);
    },
    [getVoice],
  );

  // ── Process message through Claude ──────────────────────────────────────────
  const processMessage = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      setState("thinking");
      setTranscript(userText);

      const newHistory = [...history, { role: "user", content: userText }];

      try {
        const reply = await askClaude(newHistory);
        const cleanReply = sanitizeSpeechText(reply);
        const updatedHistory = [
          ...newHistory,
          { role: "assistant", content: cleanReply },
        ];
        setHistory(updatedHistory.slice(-12)); // keep last 6 exchanges
        setResponse(cleanReply);
        const speakLang = /[\u0600-\u06FF]/.test(cleanReply) ? "ar" : voiceLang;
        speak(cleanReply, speakLang);
      } catch (err) {
        console.error("Chat error:", err);
        const errMsg =
          voiceLang === "ar"
            ? "عذراً، حدث خطأ. تأكد من تشغيل proxy-server.js"
            : "Sorry, something went wrong. Make sure proxy-server.js is running.";
        setResponse(errMsg);
        setState("error");
      }
    },
    [history, voiceLang, speak],
  );

  // ── Start voice recognition ──────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (state === "listening") {
      recogRef.current?.stop();
      setState("idle");
      return;
    }
    if (state === "speaking") {
      synthRef.current?.cancel();
      setState("idle");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recogRef.current = recognition;
    recognition.lang = voiceLang === "ar" ? "ar-JO" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalText = "";

    recognition.onstart = () => setState("listening");
    recognition.onspeechend = () => recognition.stop();
    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      if (e.error !== "no-speech") setState("idle");
    };

    recognition.onresult = (e) => {
      const interim = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(interim);
      if (e.results[e.results.length - 1].isFinal) {
        finalText = interim;
      }
    };

    recognition.onend = () => {
      if (finalText.trim()) {
        processMessage(finalText);
      } else {
        setState("idle");
      }
    };

    recognition.start();
  }, [state, voiceLang, processMessage]);

  // ── Handle text input fallback ───────────────────────────────────────────────
  const handleTextSend = useCallback(() => {
    if (!textInput.trim()) return;
    processMessage(textInput);
    setTextInput("");
  }, [textInput, processMessage]);

  // ── Stop speaking ────────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    recogRef.current?.stop();
    setState("idle");
  }, []);

  const labels = STATUS_LABELS[voiceLang];
  const chips = CHIPS[voiceLang];
  const isActive = state === "listening" || state === "speaking";

  return (
    <>
      {/* ── Floating Avatar Button ──────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 4, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#0D0B09",
          border: "1.5px solid #B8903C",
          boxShadow: "0 8px 32px rgba(184,144,60,0.35)",
          position: "fixed",
        }}
        aria-label="Open EMDAD Voice Advisor"
      >
        {/* Pulse when active */}
        {isActive && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(184,144,60,0.2)",
              animationDuration: "1.2s",
            }}
          />
        )}
        <div style={{ transform: "scale(0.52)", pointerEvents: "none" }}>
          <AvatarFace state={open ? state : "idle"} size={120} />
        </div>
      </motion.button>

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed z-50"
            style={{
              bottom: 90,
              left: 24,
              width: 360,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "70vh",
              background: "#0D0B09",
              border: "1px solid rgba(184,144,60,0.25)",
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
            dir={voiceLang === "ar" ? "rtl" : "ltr"}
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: "1px solid rgba(184,144,60,0.12)",
                background: "rgba(28,25,23,0.9)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: state === "idle" ? "#3B6D11" : "#B8903C",
                  }}
                />
                <span className="font-body text-xs font-600 text-white tracking-wide">
                  {voiceLang === "ar"
                    ? "ليلى — مساعدة إمداد"
                    : "Layla — EMDAD Advisor"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Language toggle */}
                <div
                  className="flex rounded-sm overflow-hidden"
                  style={{ border: "1px solid rgba(184,144,60,0.3)" }}
                >
                  {["en", "ar"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setVoiceLang(l)}
                      className="px-3 py-1 font-body text-[10px] font-600 tracking-widest transition-all"
                      style={{
                        background: voiceLang === l ? "#B8903C" : "transparent",
                        color:
                          voiceLang === l ? "white" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Avatar + Status ─────────────────────────────────────────── */}
            <div
              className="flex flex-col items-center py-6 flex-shrink-0"
              style={{ background: "rgba(13,11,9,0.8)" }}
            >
              <div className="relative" style={{ width: 120, height: 120 }}>
                <AvatarFace state={state} size={120} />
                {state === "listening" && <ListeningRings />}
              </div>

              <p
                className="font-body text-xs mt-4 transition-all duration-300"
                style={{
                  color:
                    state === "error" ? "#E24B4A" : "rgba(255,255,255,0.45)",
                }}
              >
                {labels[state]}
              </p>

              {/* Live transcript */}
              {transcript && state !== "idle" && (
                <div
                  className="mt-2 mx-4 px-3 py-2 text-center"
                  style={{
                    background: "rgba(184,144,60,0.06)",
                    border: "1px solid rgba(184,144,60,0.15)",
                    maxWidth: "90%",
                  }}
                >
                  <p className="font-body text-xs text-white/60 italic leading-relaxed">
                    {transcript}
                  </p>
                </div>
              )}
            </div>

            {/* ── Conversation history ────────────────────────────────────── */}
            {history.length > 0 && (
              <div
                className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(184,144,60,0.2) transparent",
                }}
              >
                {history.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? (voiceLang === "ar" ? "justify-start" : "justify-end") : voiceLang === "ar" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] px-3 py-2 text-xs font-body leading-relaxed"
                      style={
                        msg.role === "assistant"
                          ? {
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.85)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: 2,
                            }
                          : {
                              background: "rgba(184,144,60,0.75)",
                              color: "white",
                              borderRadius: 2,
                            }
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {state === "thinking" && (
                  <div
                    className={`flex ${voiceLang === "ar" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-4 py-3 flex gap-1"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                          style={{
                            animation: `thinkDot .9s ${i * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* ── Suggestion chips (when no history) ─────────────────────── */}
            {history.length === 0 && state === "idle" && (
              <div
                className="px-3 py-3 flex flex-wrap gap-1.5 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {chips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => processMessage(chip)}
                    className="px-3 py-1.5 font-body text-[10px] text-yellow-400/70 hover:text-yellow-300 hover:border-yellow-500/40 transition-all duration-200"
                    style={{
                      border: "1px solid rgba(184,144,60,0.25)",
                      background: "rgba(184,144,60,0.04)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* ── Controls ────────────────────────────────────────────────── */}
            <div
              className="px-3 pb-3 pt-3 flex-shrink-0 space-y-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Text input fallback */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
                  placeholder={
                    voiceLang === "ar"
                      ? "أو اكتب سؤالك هنا..."
                      : "Or type your question…"
                  }
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-white/20 outline-none px-3 py-2"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderColor: textInput ? "rgba(184,144,60,0.5)" : undefined,
                  }}
                  dir={voiceLang === "ar" ? "rtl" : "ltr"}
                />
                <button
                  onClick={handleTextSend}
                  disabled={!textInput.trim()}
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0 disabled:opacity-25 transition-opacity"
                  style={{
                    background: "linear-gradient(135deg,#B8903C,#D4AC5A)",
                  }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        voiceLang === "ar"
                          ? "M12 19l-7-7 7-7m7 7H5"
                          : "M12 5l7 7-7 7M5 12h14"
                      }
                    />
                  </svg>
                </button>
              </div>

              {/* Mic button */}
              <div className="flex items-center gap-3">
                {speechSupported ? (
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={
                      state === "speaking" ? stopSpeaking : startListening
                    }
                    className="flex-1 flex items-center justify-center gap-3 py-3 font-body text-sm font-600 tracking-wide transition-all duration-300"
                    style={{
                      background:
                        state === "listening"
                          ? "rgba(220,38,38,0.2)"
                          : state === "speaking"
                            ? "rgba(184,144,60,0.15)"
                            : "linear-gradient(135deg,#B8903C,#D4AC5A)",
                      border:
                        state === "listening"
                          ? "1px solid rgba(220,38,38,0.5)"
                          : state === "speaking"
                            ? "1px solid rgba(184,144,60,0.4)"
                            : "none",
                      color: state === "speaking" ? "#D4AC5A" : "white",
                    }}
                    disabled={state === "thinking"}
                  >
                    {state === "listening" ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        {voiceLang === "ar" ? "إيقاف" : "Stop"}
                      </>
                    ) : state === "speaking" ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {voiceLang === "ar" ? "إيقاف التحدث" : "Stop speaking"}
                      </>
                    ) : state === "thinking" ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {voiceLang === "ar" ? "يفكّر..." : "Thinking…"}
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                        {voiceLang === "ar" ? "انقر للتحدث" : "Tap to speak"}
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="flex-1 text-center py-3 font-body text-xs text-white/30">
                    {voiceLang === "ar"
                      ? "الكتابة متاحة (Chrome يدعم الصوت)"
                      : "Type above (Chrome supports voice)"}
                  </div>
                )}

                {/* Clear history */}
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      setHistory([]);
                      setTranscript("");
                      setResponse("");
                    }}
                    className="w-10 h-10 flex items-center justify-center text-white/25 hover:text-white/50 transition-colors flex-shrink-0"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    title="Clear conversation"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* No history prompt */}
              {history.length === 0 && (
                <div className="flex items-center justify-center gap-4 pt-1">
                  <Link
                    to="/collections"
                    onClick={() => setOpen(false)}
                    className="font-body text-[10px] text-yellow-500/50 hover:text-yellow-400 transition-colors uppercase tracking-widest"
                  >
                    {voiceLang === "ar" ? "المجموعات" : "Collections"}
                  </Link>
                  <span className="w-px h-3 bg-white/10" />
                  <Link
                    to="/appointment"
                    onClick={() => setOpen(false)}
                    className="font-body text-[10px] text-yellow-500/50 hover:text-yellow-400 transition-colors uppercase tracking-widest"
                  >
                    {voiceLang === "ar" ? "حجز موعد" : "Book Visit"}
                  </Link>
                  <span className="w-px h-3 bg-white/10" />
                  <Link
                    to="/quote"
                    onClick={() => setOpen(false)}
                    className="font-body text-[10px] text-yellow-500/50 hover:text-yellow-400 transition-colors uppercase tracking-widest"
                  >
                    {voiceLang === "ar" ? "عرض سعر" : "Get Quote"}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CSS Animations ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes thinkDot {
          0%,100% { transform: translateY(0);    opacity: 0.4; }
          50%      { transform: translateY(-5px); opacity: 1;   }
        }
      `}</style>
    </>
  );
}

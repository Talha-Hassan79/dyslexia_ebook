"use client"; 
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import stories from '../../../ebook/data/stories.json';

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id || '0', 10);
  const story = stories[id] || stories[0];

  const [lang, setLang] = useState('en');
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);

  // New states for flipping
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);

  const synthRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis || null;
    const savedLang = localStorage.getItem('lang');
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    setPageIndex(0);
    stopSpeaking();
    setHighlightIndex(null);
  }, [id, lang]);

  useEffect(() => {
    stopSpeaking();
    setHighlightIndex(null);
  }, [pageIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.load();
  }, []);

  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setHighlightIndex(null);
  };

  const speakText = async (text) => {
    if (!synthRef.current) return;
    setIsSpeaking(true);
    const words = text.split(/\s+/).filter(Boolean);
    let i = 0;

    const speakNext = () => {
      if (i >= words.length) {
        setHighlightIndex(null);
        setIsSpeaking(false);
        return;
      }
      setHighlightIndex(i);
      const utter = new SpeechSynthesisUtterance(words[i]);
      utter.rate = 0.95;
      utter.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
      utter.onend = () => { i++; setTimeout(speakNext, 60); };
      synthRef.current.speak(utter);
    };

    speakNext();
  };

  const readAloud = async () => {
    const page = lang === 'ur' ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
    await speakText(page);
  };

  const playFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // New flip function
  const flipPage = (direction) => {
    if (isFlipping) return;
    setFlipDirection(direction);
    setIsFlipping(true);
    stopSpeaking();
    playFlipSound();

    setTimeout(() => {
      if (direction === "next") {
        if (pageIndex < story.pages.length - 1) setPageIndex(pageIndex + 1);
        else if (id < stories.length - 1) router.push(`/reader/${id + 1}`);
        else router.push("/stories");
      } else {
        if (pageIndex > 0) setPageIndex(pageIndex - 1);
      }
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800); // animation duration
  };

  const toggleLang = (l) => {
    stopSpeaking();
    setLang(l);
    localStorage.setItem('lang', l);
    setPageIndex(0);
    setHighlightIndex(null);
  };

  const navigate = (path) => {
    stopSpeaking();
    router.push(path);
  };

  const pageText = lang === 'ur' ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
  const isRTL = lang === 'ur';

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 16,
        boxSizing: 'border-box',
        fontFamily: lang === 'ur' ? "'Noto Naskh Arabic', 'Noto Sans Arabic', sans-serif" : "'OpenDyslexic', sans-serif",
        backgroundColor: story.theme + '11',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/foley/page_flip.ogg" preload="auto" />

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <button onClick={() => navigate('/stories')} style={btnStyle}>Back to Menu</button>
            <button onClick={() => navigate('/')} style={{ ...btnStyle, backgroundColor: '#e0e0e0' }}>Home</button>
            <div style={{ marginLeft: 8, display: 'flex', gap: 4 }}>
              <button onClick={() => toggleLang('en')} style={{ ...langBtn, backgroundColor: lang === 'en' ? '#ffd54a' : '#fff' }}>English</button>
              <button onClick={() => toggleLang('ur')} style={{ ...langBtn, backgroundColor: lang === 'ur' ? '#ffd54a' : '#fff' }}>اردو</button>
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, textAlign: 'center', flex: 1 }}>{lang === 'ur' ? story.title.ur : story.title.en}</h2>
          <div style={{ width: 120 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <div style={{ width: '100%', perspective: 1200 }}>
            <div
              style={{
                ...pageCard,
                backgroundColor: story.theme + '22',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s ease',
                transform: isFlipping ? `rotateY(${flipDirection === 'next' ? -180 : 180}deg)` : 'rotateY(0deg)',
              }}
            >
              {story.pages[pageIndex].image && <img src={story.pages[pageIndex].image} style={imageStyle} alt="" />}
              <div style={{ padding: 10, textAlign: isRTL ? 'right' : 'left' }}>
                <p style={pageTextStyle}>
                  {pageText.split(/\s+/).map((w, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: i === highlightIndex ? '#fff3b0' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: 6,
                        marginRight: isRTL ? 0 : 6,
                        marginLeft: isRTL ? 6 : 0,
                        display: 'inline-block',
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ color: '#444' }}>Page {pageIndex + 1} of {story.pages.length}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {pageIndex > 0 && <button onClick={() => flipPage('prev')} style={navBtn}>Previous</button>}
                  <button onClick={readAloud} disabled={isSpeaking} style={readBtn}>{isSpeaking ? 'Reading...' : lang === 'ur' ? 'پڑھیں' : 'Read Aloud'}</button>
                  {pageIndex < story.pages.length - 1 ? (
                    <button onClick={() => flipPage('next')} style={navBtn}>Next</button>
                  ) : (
                    <button onClick={() => navigate(id < stories.length - 1 ? `/reader/${id + 1}` : '/stories')} style={nextStoryBtn}>{lang === 'ur' ? 'اگلی کہانی' : 'Next Story'}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 🧩 Styles
const btnStyle = { padding: '8px 12px', borderRadius: 10, border: 'none', backgroundColor: '#ffd54a', cursor: 'pointer' };
const langBtn = { padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', fontSize: 14 };
const navBtn = { padding: '10px 12px', borderRadius: 10, border: 'none', backgroundColor: '#ffe6a8', cursor: 'pointer' };
const readBtn = { padding: '10px 12px', borderRadius: 10, border: 'none', backgroundColor: '#8be78b', cursor: 'pointer' };
const nextStoryBtn = { padding: '10px 12px', borderRadius: 10, border: 'none', backgroundColor: '#b3e5ff', cursor: 'pointer' };
const pageCard = { borderRadius: 14, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', padding: 12, minHeight: 420 };
const imageStyle = { width: '100%', height: 500, objectFit: 'cover', borderRadius: 8, marginBottom: 10 };
const pageTextStyle = { fontSize: 26, lineHeight: 1.9, margin: 0, color: '#222' };

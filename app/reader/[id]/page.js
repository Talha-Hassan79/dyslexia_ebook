"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import stories from '../../../ebook/data/stories.json';

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id || '0', 10);
  const story = stories[id] || stories[0];

  // language state: 'en' or 'ur'
  const [lang, setLang] = useState(typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en');
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang');
      if (saved) setLang(saved);
    }
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
    setIsSpeaking(false);
  };

  const speakText = async (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    return new Promise((resolve) => {
      const words = text.split(/\s+/).filter(Boolean);
      let i = 0;
      const speakNext = () => {
        if (i >= words.length) {
          setHighlightIndex(null);
          resolve();
          return;
        }
        setHighlightIndex(i);
        const u = new SpeechSynthesisUtterance(words[i]);
        u.rate = 0.95;
        u.lang = lang === 'ur' ? 'ur' : 'en-US';
        u.onend = () => { i++; setTimeout(speakNext, 60); };
        window.speechSynthesis.speak(u);
      };
      speakNext();
    });
  };

  const readAloud = async () => {
    stopSpeaking();
    setIsSpeaking(true);
    const page = (lang === 'ur') ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
    await speakText(page);
    setIsSpeaking(false);
    setHighlightIndex(null);
  };

  const playFlipSound = () => {
    try {
      if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); }
    } catch (e) { /* ignore */ }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      playFlipSound();
      setPageIndex(pageIndex - 1);
    }
  };

  const nextPage = () => {
    if (pageIndex < story.pages.length - 1) {
      playFlipSound();
      setPageIndex(pageIndex + 1);
    } else {
      if (id < stories.length - 1) {
        router.push(`/reader/${id+1}`);
      } else {
        router.push('/stories');
      }
    }
  };

  const toggleLang = (l) => {
    setLang(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
    stopSpeaking();
    setPageIndex(0);
    setHighlightIndex(null);
  };

  const pageText = (lang === 'ur') ? story.pages[pageIndex].ur : story.pages[pageIndex].en;
  const isRTL = lang === 'ur';

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 16,
        boxSizing: 'border-box',
        fontFamily:
          lang === 'ur'
            ? "'Noto Naskh Arabic', 'Noto Sans Arabic', sans-serif"
            : "'OpenDyslexic', sans-serif",
        backgroundColor: story.theme + '11',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/foley/page_flip.ogg"
        preload="auto"
      />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <button onClick={() => router.push('/stories')} style={btnStyle}>
              Back to Menu
            </button>
            <button onClick={() => router.push('/')} style={{ ...btnStyle, backgroundColor: '#e0e0e0' }}>
              Home
            </button>
            <div style={{ marginLeft: 8, display: 'flex', gap: 4 }}>
              <button
                onClick={() => toggleLang('en')}
                style={{
                  ...langBtn,
                  backgroundColor: lang === 'en' ? '#ffd54a' : '#fff',
                }}
              >
                English
              </button>
              <button
                onClick={() => toggleLang('ur')}
                style={{
                  ...langBtn,
                  backgroundColor: lang === 'ur' ? '#ffd54a' : '#fff',
                }}
              >
                اردو
              </button>
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, textAlign: 'center', flex: 1 }}>
            {lang === 'ur' ? story.title.ur : story.title.en}
          </h2>
          <div style={{ width: 120 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <div style={{ width: '100%' }}>
            <div style={{ ...pageCard, backgroundColor: story.theme + '22' }}>
              {story.pages[pageIndex].image && (
                <img src={story.pages[pageIndex].image} style={imageStyle} alt="" />
              )}
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
                  {pageIndex > 0 && <button onClick={prevPage} style={navBtn}>Previous</button>}
                  <button onClick={readAloud} disabled={isSpeaking} style={readBtn}>
                    {isSpeaking ? 'Reading...' : lang === 'ur' ? 'پڑھیں' : 'Read Aloud'}
                  </button>
                  {pageIndex < story.pages.length - 1 ? (
                    <button onClick={nextPage} style={navBtn}>Next</button>
                  ) : (
                    <button
                      onClick={() => {
                        if (id < stories.length - 1) router.push(`/reader/${id + 1}`);
                        else router.push('/stories');
                      }}
                      style={nextStoryBtn}
                    >
                      {lang === 'ur' ? 'اگلی کہانی' : 'Next Story'}
                    </button>
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
const imageStyle = { width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 10 };
const pageTextStyle = { fontSize: 26, lineHeight: 1.9, margin: 0, color: '#222' };

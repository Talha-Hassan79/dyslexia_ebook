"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontFamily: "'OpenDyslexic', sans-serif",
        backgroundColor: '#f0f8ff'
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          padding: 30,
          borderRadius: 20,
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff'
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 12, color: '#333' }}>Dyslexia eBook</h1>
        <p style={{ color: '#555', fontSize: 18, marginBottom: 24, lineHeight: 1.5 }}>
          Welcome! Open the story library and start reading interactive stories designed for dyslexic-friendly reading.
        </p>
        <Link href="/stories">
          <button
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#ffd54a',
              color: '#333',
              fontWeight: 'bold',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Open Library
          </button>
        </Link>
      </div>
    </div>
  );
}

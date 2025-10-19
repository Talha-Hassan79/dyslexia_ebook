import Link from 'next/link';

export default function Home() {
  return (
    <div style={{padding:20, fontFamily: "'OpenDyslexic', sans-serif"}}>
      <h1 style={{fontSize:32}}>Dyslexia eBook</h1>
      <p style={{color:'#555'}}>Welcome — open the story library to begin.</p>
      <Link href="/stories"><button style={{padding:'10px 14px', borderRadius:10, border:'none', backgroundColor:'#ffd54a', cursor:'pointer'}}>Open Library</button></Link>
    </div>
  );
}

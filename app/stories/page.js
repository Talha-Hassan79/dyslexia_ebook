import stories from '../../ebook/data/stories.json';
import Link from 'next/link';

export default function StoriesPage() {
  return (
    <div style={{ padding:20, fontFamily: "'OpenDyslexic', sans-serif" }}>
      <h1 style={{ textAlign:'center', fontSize:34 }}>Story Library</h1>
      <p style={{ textAlign:'center', color:'#666' }}>Choose a story to begin</p>
      <div style={shelfStyle}>
        {stories.map((s, i) => (
          <Link key={i} href={`/reader/${i}`} style={{ textDecoration:'none' }}>
            <div style={{ ...cardStyle, backgroundColor: s.theme + '20' }}>
              <img src={s.pages[0].image} alt="" style={thumbStyle} />
              <div style={{ padding:12 }}>
                <h2 style={{ margin:0, fontSize:20, color:'#111' }}>{s.title.en}</h2>
                <p style={{ margin:'8px 0 0', color:'#444' }}>{s.description.en}</p>
                <p style={{ margin:'6px 0 0', color:'#666', fontSize:13 }}>اردو میں بھی دستیاب</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const shelfStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 18,
  maxWidth: 1100,
  margin: '20px auto'
};

const cardStyle = {
  borderRadius: 12,
  padding:0,
  boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  cursor: 'pointer',
  width: '100%'
};

const thumbStyle = { width:'100%', height:150, objectFit:'cover' };

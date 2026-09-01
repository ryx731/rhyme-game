import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Page Components
const HomePage = ({ onStart }) => {
  const [selectedScheme, setSelectedScheme] = useState('AABB');
  const [selectedTheme, setSelectedTheme] = useState('nature');

  const themes = {
    nature: ['trees', 'breeze', 'sun', 'sky', 'flowers', 'rain', 'moon', 'stars'],
    love: ['heart', 'soul', 'dream', 'kiss', 'smile', 'eyes', 'touch', 'warm'],
    adventure: ['quest', 'brave', 'trail', 'storm', 'light', 'dark', 'climb', 'roam'],
    urban: ['city', 'lights', 'street', 'sound', 'rhythm', 'crowd', 'night', 'bloom']
  };

  return (
    <div className="page home-page">
      <div className="hero">
        <div className="music-notes">🎵 ♪ ♫ ♪ 🎵</div>
        <h1>🎤 Rhyme Freestyle</h1>
        <p className="subtitle">Generate words, find your flow, create magic</p>
      </div>

      <div className="settings-panel">
        <div className="setting-group">
          <label>🎯 Rhyme Scheme</label>
          <div className="scheme-buttons">
            {['AABB', 'ABAB', 'ABBA', 'AAAA'].map(scheme => (
              <button
                key={scheme}
                className={`scheme-btn ${selectedScheme === scheme ? 'active' : ''}`}
                onClick={() => setSelectedScheme(scheme)}
              >
                {scheme}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>🌍 Theme</label>
          <div className="theme-buttons">
            {Object.keys(themes).map(theme => (
              <button
                key={theme}
                className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="start-btn"
          onClick={() => onStart(selectedScheme, selectedTheme)}
        >
          🚀 Start Freestyling
        </button>
      </div>

      <div className="how-to">
        <h3>How to Play</h3>
        <div className="steps">
          <div className="step">
            <span className="step-num">1</span>
            <p>Choose a rhyme scheme and theme</p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <p>Get auto-generated words to rhyme with</p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <p>Freestyle your lyrics line by line</p>
          </div>
          <div className="step">
            <span className="step-num">4</span>
            <p>Create your masterpiece! 🎵</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GamePage = ({ scheme, theme, onBack }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userLines, setUserLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bounceOffset, setBounceOffset] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const animationRef = useRef(null);

  // Word banks for different themes
  const wordBanks = {
    nature: {
      rhymes: {
        'A': ['day', 'way', 'play', 'stay', 'gray'],
        'B': ['sky', 'fly', 'high', 'why', 'cry'],
        'C': ['green', 'seen', 'queen', 'dream', 'mean'],
        'D': ['bloom', 'room', 'moon', 'soon', 'tune']
      },
      words: ['sunshine', 'forest', 'river', 'mountain', 'petal', 'breeze', 'clouds', 'meadow']
    },
    love: {
      rhymes: {
        'A': ['heart', 'start', 'part', 'smart', 'dart'],
        'B': ['true', 'you', 'through', 'blue', 'knew'],
        'C': ['soul', 'goal', 'whole', 'roll', 'stole'],
        'D': ['kiss', 'miss', 'bliss', 'this', 'wish']
      },
      words: ['cherish', 'forever', 'passion', 'gentle', 'whisper', 'embrace', 'devotion', 'tender']
    },
    adventure: {
      rhymes: {
        'A': ['brave', 'wave', 'cave', 'save', 'gave'],
        'B': ['quest', 'rest', 'best', 'test', 'west'],
        'C': ['trail', 'fail', 'mail', 'sail', 'tail'],
        'D': ['storm', 'warm', 'form', 'norm', 'swarm']
      },
      words: ['treasure', 'dragon', 'ancient', 'hero', 'journey', 'battle', 'legend', 'courage']
    },
    urban: {
      rhymes: {
        'A': ['city', 'pretty', 'kitty', 'nitty', 'gritty'],
        'B': ['night', 'light', 'bright', 'sight', 'might'],
        'C': ['street', 'beat', 'heat', 'seat', 'neat'],
        'D': ['sound', 'round', 'found', 'bound', 'ground']
      },
      words: ['concrete', 'rhythm', 'hustle', 'glow', 'vibe', 'dreams', 'shadow', 'echo']
    }
  };

  // Generate rhyme scheme structure
  const generateSongStructure = (scheme, theme) => {
    const patterns = {
      'AABB': ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'],
      'ABAB': ['A', 'B', 'A', 'B', 'C', 'D', 'C', 'D'],
      'ABBA': ['A', 'B', 'B', 'A', 'C', 'D', 'D', 'C'],
      'AAAA': ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']
    };

    const pattern = patterns[scheme] || patterns['AABB'];
    const themeWords = wordBanks[theme] || wordBanks['nature'];
    const rhymeGroups = {};

    // Generate random words for each rhyme group
    pattern.forEach((letter, index) => {
      if (!rhymeGroups[letter]) {
        const rhymes = themeWords.rhymes[letter] || ['day', 'play', 'say'];
        rhymeGroups[letter] = rhymes[Math.floor(Math.random() * rhymes.length)];
      }
    });

    // Create lines with the rhyming words
    return pattern.map((letter, index) => ({
      id: index,
      rhymeLetter: letter,
      rhymeWord: rhymeGroups[letter],
      isUserLine: false
    }));
  };

  const [songStructure, setSongStructure] = useState(() => 
    generateSongStructure(scheme, theme)
  );

  // Reset game when scheme/theme changes
  useEffect(() => {
    setSongStructure(generateSongStructure(scheme, theme));
    setUserLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
    setIsPlaying(false);
    setCurrentInput('');
  }, [scheme, theme]);

  // Auto-focus input
  useEffect(() => {
    if (!isComplete && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [currentLineIndex, isComplete]);

  // Bounce animation
  useEffect(() => {
    if (isPlaying) {
      let startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newOffset = Math.sin(elapsed * 8) * 8;
        setBounceOffset(newOffset);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setBounceOffset(0);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying]);

  // Smooth scroll to current line
  useEffect(() => {
    if (lineRefs.current[currentLineIndex]) {
      setTimeout(() => {
        const element = lineRefs.current[currentLineIndex];
        if (element && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const offset = containerRect.height / 2 - 40;
          const scrollTarget = element.offsetTop - offset;
          
          containerRef.current.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentLineIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentInput.trim() && !isComplete) {
      const newLine = {
        text: currentInput.trim(),
        rhymeWord: songStructure[currentLineIndex].rhymeWord,
        rhymeLetter: songStructure[currentLineIndex].rhymeLetter
      };
      
      const newUserLines = [...userLines, newLine];
      setUserLines(newUserLines);
      setCurrentInput('');

      if (currentLineIndex >= songStructure.length - 1) {
        setIsComplete(true);
        setIsPlaying(false);
      } else {
        setCurrentLineIndex(currentLineIndex + 1);
        setIsPlaying(true);
      }
    }
  };

  const getRhymeColor = (rhyme) => {
    const colors = {
      'A': '#FF6B6B',
      'B': '#4ECDC4',
      'C': '#45B7D1',
      'D': '#96CEB4'
    };
    return colors[rhyme] || '#636E72';
  };

  const handleReset = () => {
    setUserLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
    setIsPlaying(false);
    setCurrentInput('');
    setSongStructure(generateSongStructure(scheme, theme));
  };

  const handleBackToHome = () => {
    if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
      onBack();
    }
  };

  const currentLine = songStructure[currentLineIndex];

  return (
    <div className="page game-page">
      <div className="game-header">
        <button className="back-btn" onClick={handleBackToHome}>← Back</button>
        <div className="game-info">
          <span className="scheme-tag">{scheme}</span>
          <span className="theme-tag">{theme}</span>
        </div>
        <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
      </div>

      <div className="game-container" ref={containerRef}>
        <div className="lyrics-area">
          {/* Show all completed lines */}
          {userLines.map((line, index) => (
            <div key={`user-${index}`} className="line completed-line">
              <div className="line-content">
                <span className="rhyme-badge" style={{ background: getRhymeColor(line.rhymeLetter) }}>
                  {line.rhymeLetter}
                </span>
                <span className="line-text">{line.text}</span>
                <span className="rhyme-word">[{line.rhymeWord}]</span>
              </div>
            </div>
          ))}

          {/* Current line with bouncing ball */}
          {!isComplete && currentLine && (
            <div 
              ref={(el) => lineRefs.current[currentLineIndex] = el}
              className="line current-line"
            >
              <div className="line-content">
                <span className="rhyme-badge" style={{ background: getRhymeColor(currentLine.rhymeLetter) }}>
                  {currentLine.rhymeLetter}
                </span>
                <form onSubmit={handleSubmit} className="input-form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Type your line..."
                    className="line-input"
                    autoFocus
                  />
                  <button type="submit" className="submit-btn">→</button>
                </form>
                <span className="rhyme-word rhyme-target">
                  [{currentLine.rhymeWord}]
                  <span className="rhyme-hint">(must rhyme with this)</span>
                </span>
              </div>
              <div className="bouncing-ball" style={{
                transform: `translateY(${isPlaying ? bounceOffset : 0}px)`
              }}>
                <div className="ball"></div>
              </div>
            </div>
          )}

          {/* Completion screen */}
          {isComplete && (
            <div className="completion-screen">
              <div className="completion-content">
                <div className="trophy">🏆</div>
                <h2>Your Masterpiece!</h2>
                <div className="completed-lyrics">
                  {userLines.map((line, index) => (
                    <div key={index} className="completed-line-full">
                      <span className="line-num">{index + 1}.</span>
                      <span className="line-text">{line.text}</span>
                      <span className="rhyme-indicator">(rhymes with: {line.rhymeWord})</span>
                    </div>
                  ))}
                </div>
                <div className="completion-actions">
                  <button className="btn-primary" onClick={handleReset}>🔄 Try Again</button>
                  <button className="btn-secondary" onClick={handleBackToHome}>🏠 Home</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{
          width: `${(userLines.length / songStructure.length) * 100}%`
        }} />
        <span className="progress-text">
          {userLines.length} / {songStructure.length} lines
        </span>
      </div>
    </div>
  );
};

// Main App
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [gameSettings, setGameSettings] = useState({ scheme: 'AABB', theme: 'nature' });

  const handleStart = (scheme, theme) => {
    setGameSettings({ scheme, theme });
    setCurrentPage('game');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="app">
      {currentPage === 'home' && <HomePage onStart={handleStart} />}
      {currentPage === 'game' && (
        <GamePage 
          scheme={gameSettings.scheme} 
          theme={gameSettings.theme}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;

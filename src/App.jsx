import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamesHub from './pages/GamesHub'
import GamePage from './pages/GamePage'
import ReactionGame from './pages/ReactionGame'
import SequenceGame from './pages/SequenceGame'
import QuickMathGame from './pages/QuickMathGame'
import StroopGame from './pages/StroopGame'
import MemoryGame from './pages/MemoryGame'
import PatternGame from './pages/PatternGame'
import NumberMemoryGame from './pages/NumberMemoryGame'
import BlogPage from './pages/BlogPage'
import SciencePage from './pages/SciencePage'

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav className="nav-bar">
          <NavLink to="/" className="nav-logo">
            <div className="nav-logo-icon">ד</div>
            <span>דע</span>
          </NavLink>
          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} end>דף הבית</NavLink>
            <NavLink to="/games" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>משחקים</NavLink>
            <NavLink to="/science" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>מדע</NavLink>
            <NavLink to="/blog" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>בלוג</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/game/schulte" element={<GamePage />} />
            <Route path="/game/reaction" element={<ReactionGame />} />
            <Route path="/game/sequence" element={<SequenceGame />} />
            <Route path="/game/math" element={<QuickMathGame />} />
            <Route path="/game/stroop" element={<StroopGame />} />
            <Route path="/game/memory" element={<MemoryGame />} />
            <Route path="/game/pattern" element={<PatternGame />} />
            <Route path="/game/numbers" element={<NumberMemoryGame />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

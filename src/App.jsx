import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
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
import TypingGame from './pages/TypingGame'
import GridRecallGame from './pages/GridRecallGame'
import ColorMatchGame from './pages/ColorMatchGame'
import AimTrainerGame from './pages/AimTrainerGame'
import BlogPage from './pages/BlogPage'
import SciencePage from './pages/SciencePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ShopPage from './pages/ShopPage'

function Navbar() {
  const { userData, isLoggedIn } = useUser()
  return (
    <nav className="nav-bar">
      <NavLink to="/" className="nav-logo">
        <div className="nav-logo-icon">ד</div>
        <span>דע</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} end>דף הבית</NavLink>
        <NavLink to="/games" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>משחקים</NavLink>
        <NavLink to="/shop" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>חנות</NavLink>
        <NavLink to="/science" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>מדע</NavLink>
        <NavLink to="/blog" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>בלוג</NavLink>
        <NavLink to="/profile" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          {isLoggedIn || userData ? '👤 פרופיל' : 'התחבר'}
        </NavLink>
      </div>
    </nav>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
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
            <Route path="/game/typing" element={<TypingGame />} />
            <Route path="/game/grid" element={<GridRecallGame />} />
            <Route path="/game/color" element={<ColorMatchGame />} />
            <Route path="/game/aim" element={<AimTrainerGame />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App

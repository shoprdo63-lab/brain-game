import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../supabase'

const UserContext = createContext(null)

export function useUser() {
  return useContext(UserContext)
}

const DEFAULT_UNLOCKS = {
  proMode: false,
  extraTime: false,
  themeDark: true,
  themeNeon: false,
  hints: false,
  gameTyping: false,
  gameGridRecall: false,
  gameColorMatch: false,
  gameWordScramble: false,
  gameAimTrainer: false,
  gameNBack: false,
  gameChimpTest: false,
  gameOddOneOut: false,
  gameFocusGrid: false,
  gameReflexChallenge: false,
  gameSpeedMatch: false,
}

function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem('da_guest_user'))
  } catch {
    return null
  }
}

function setLocalUser(data) {
  localStorage.setItem('da_guest_user', JSON.stringify(data))
}

export function UserProvider({ children }) {
  const [sessionUser, setSessionUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') {
      console.error('fetchProfile error:', error)
    }
    return data
  }, [])

  const createProfile = useCallback(async (user) => {
    if (!supabase) return null
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'משתמש'
    const newProfile = {
      id: user.id,
      display_name: displayName,
      email: user.email,
      points: 0,
      total_games_played: 0,
      unlocks: DEFAULT_UNLOCKS,
      created_at: new Date().toISOString(),
      high_scores: {},
    }
    const { error } = await supabase.from('profiles').insert(newProfile)
    if (error) console.error('createProfile error:', error)
    return newProfile
  }, [])

  useEffect(() => {
    if (!supabase) {
      const guest = getLocalUser()
      if (guest) {
        setIsGuest(true)
        setUserData(guest)
      }
      setLoading(false)
      return () => {}
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null
      setSessionUser(user)
      if (user) {
        setIsGuest(false)
        let profile = await fetchProfile(user.id)
        if (!profile) {
          profile = await createProfile(user)
        }
        setUserData(profile)
      } else {
        const guest = getLocalUser()
        if (guest) {
          setIsGuest(true)
          setUserData(guest)
        } else {
          setIsGuest(false)
          setUserData(null)
        }
      }
      setLoading(false)
    })

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null
      setSessionUser(user)
      if (user) {
        setIsGuest(false)
        let profile = await fetchProfile(user.id)
        if (!profile) {
          profile = await createProfile(user)
        }
        setUserData(profile)
      } else {
        const guest = getLocalUser()
        if (guest) {
          setIsGuest(true)
          setUserData(guest)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, createProfile])

  const register = useCallback(async (email, password, displayName) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error
    return data.user
  }, [])

  const login = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setSessionUser(null)
    setUserData(null)
    setIsGuest(false)
  }, [])

  const addPoints = useCallback(async (points, gameKey, score) => {
    if (sessionUser && supabase) {
      const profile = await fetchProfile(sessionUser.id)
      if (!profile) return
      const newPoints = (profile.points || 0) + points
      const newHighScores = { ...(profile.high_scores || {}) }
      if (score > (newHighScores[gameKey] || 0)) {
        newHighScores[gameKey] = score
      }
      const { error } = await supabase.from('profiles').update({
        points: newPoints,
        total_games_played: (profile.total_games_played || 0) + 1,
        high_scores: newHighScores,
      }).eq('id', sessionUser.id)
      if (error) console.error('addPoints error:', error)
      else setUserData({ ...profile, points: newPoints, total_games_played: (profile.total_games_played || 0) + 1, high_scores: newHighScores })
    } else if (isGuest && userData) {
      const updated = {
        ...userData,
        points: (userData.points || 0) + points,
        totalGamesPlayed: (userData.totalGamesPlayed || 0) + 1,
        highScores: {
          ...(userData.highScores || {}),
          [gameKey]: Math.max(score, userData.highScores?.[gameKey] || 0),
        },
      }
      setUserData(updated)
      setLocalUser(updated)
    }
  }, [sessionUser, isGuest, userData, fetchProfile])

  const purchase = useCallback(async (itemKey, cost) => {
    if (!userData || userData.points < cost) return false
    const newUnlocks = { ...(userData.unlocks || {}), [itemKey]: true }
    const newPoints = userData.points - cost
    if (sessionUser && supabase) {
      const { error } = await supabase.from('profiles').update({
        points: newPoints,
        unlocks: newUnlocks,
      }).eq('id', sessionUser.id)
      if (error) { console.error('purchase error:', error); return false }
      setUserData({ ...userData, points: newPoints, unlocks: newUnlocks })
    } else if (isGuest) {
      const updated = { ...userData, points: newPoints, unlocks: newUnlocks }
      setUserData(updated)
      setLocalUser(updated)
    }
    return true
  }, [userData, sessionUser, isGuest])

  const ensureGuest = useCallback(() => {
    if (userData) return
    const guest = {
      displayName: 'אורח',
      email: null,
      points: 0,
      totalGamesPlayed: 0,
      unlocks: { ...DEFAULT_UNLOCKS },
      createdAt: Date.now(),
      highScores: {},
    }
    setIsGuest(true)
    setUserData(guest)
    setLocalUser(guest)
  }, [userData])

  const value = useMemo(() => ({
    user: sessionUser,
    userData,
    isGuest,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    addPoints,
    purchase,
    ensureGuest,
    isLoggedIn: !!sessionUser,
  }), [sessionUser, userData, isGuest, loading, register, login, loginWithGoogle, logout, addPoints, purchase, ensureGuest])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

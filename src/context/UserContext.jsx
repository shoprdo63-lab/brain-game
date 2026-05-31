import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

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
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        setIsGuest(false)
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setUserData(snap.data())
        } else {
          const newData = {
            displayName: user.displayName || user.email?.split('@')[0] || 'משתמש',
            email: user.email,
            points: 0,
            totalGamesPlayed: 0,
            unlocks: { ...DEFAULT_UNLOCKS },
            createdAt: Date.now(),
            highScores: {},
          }
          await setDoc(ref, newData)
          setUserData(newData)
        }
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
    return unsub
  }, [])

  useEffect(() => {
    if (!firebaseUser) return
    const ref = doc(db, 'users', firebaseUser.uid)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setUserData(snap.data())
    })
    return unsub
  }, [firebaseUser])

  const register = useCallback(async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred.user
  }, [auth])

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }, [auth])

  const logout = useCallback(async () => {
    await signOut(auth)
    setFirebaseUser(null)
    setUserData(null)
    setIsGuest(false)
  }, [auth])

  const addPoints = useCallback(async (points, gameKey, score) => {
    if (firebaseUser) {
      const ref = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) return
      const data = snap.data()
      const newPoints = (data.points || 0) + points
      const newHighScores = { ...(data.highScores || {}) }
      if (score > (newHighScores[gameKey] || 0)) {
        newHighScores[gameKey] = score
      }
      await updateDoc(ref, {
        points: newPoints,
        totalGamesPlayed: (data.totalGamesPlayed || 0) + 1,
        highScores: newHighScores,
      })
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
  }, [firebaseUser, isGuest, userData])

  const purchase = useCallback(async (itemKey, cost) => {
    if (!userData || userData.points < cost) return false
    const newUnlocks = { ...(userData.unlocks || {}), [itemKey]: true }
    const newPoints = userData.points - cost
    if (firebaseUser) {
      const ref = doc(db, 'users', firebaseUser.uid)
      await updateDoc(ref, { points: newPoints, unlocks: newUnlocks })
    } else if (isGuest) {
      const updated = { ...userData, points: newPoints, unlocks: newUnlocks }
      setUserData(updated)
      setLocalUser(updated)
    }
    return true
  }, [userData, firebaseUser, isGuest])

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
    user: firebaseUser,
    userData,
    isGuest,
    loading,
    register,
    login,
    logout,
    addPoints,
    purchase,
    ensureGuest,
    isLoggedIn: !!firebaseUser,
  }), [firebaseUser, userData, isGuest, loading, register, login, logout, addPoints, purchase, ensureGuest])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

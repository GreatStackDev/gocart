'use client'
import { useRef, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from '../lib/store'

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  )
}

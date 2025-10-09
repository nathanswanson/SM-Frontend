import React from 'react'
import { createContext, useEffect, useState } from 'react'

interface IWindowContext {
    scrollPosition: { x: number; y: number }
    setScrollPosition: (pos: { x: number; y: number }) => void
}

const WindowContext = createContext<IWindowContext | undefined>(undefined)

export const useWindowContext = () => {
    const context = React.useContext(WindowContext)
    if (!context) {
        throw new Error('useWindowContext must be used within a WindowProvider')
    }
    return context
}

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
    const [scrollPosition, setScrollPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        // Determine the target to listen to (window for global, or elementRef for local)
        const target = window

        // 2. Define the handler function
        const handleScroll = () => {
            let newX = 0
            let newY = 0

            newY = window.scrollY || document.documentElement.scrollTop
            newX = window.scrollX || document.documentElement.scrollLeft
            setScrollPosition({ x: newX, y: newY })
        }

        // 3. Attach the event listener
        target.addEventListener('scroll', handleScroll)

        // Initial call to set the position when component mounts
        handleScroll()

        // 4. Clean up the event listener
        return () => {
            target.removeEventListener('scroll', handleScroll)
        }
        // The dependency array is empty because we only want to set up and tear down
        // the listener once, when the component mounts and unmounts.
    }, [])

    return <WindowContext.Provider value={{ scrollPosition, setScrollPosition }}>{children}</WindowContext.Provider>
}

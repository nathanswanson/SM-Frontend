import { createContext, useState } from 'react'
import { useContext } from 'react'
import { ReactNode } from 'react'

interface ISelectedServerContext {
    selectedServer: string | undefined
    setSelectedServer: (id: string) => void
}

const SelectedServerContext = createContext<ISelectedServerContext | undefined>(
    undefined
)

export const useSelectedServerContext = () => {
    const context = useContext(SelectedServerContext)
    if (!context) {
        throw new Error(
            'useSelectedServerContext must be used within a SelectedServerProvider'
        )
    }
    return context
}

export const SelectedServerProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const [selectedServer, setSelectedServer] = useState<string | undefined>(
        undefined
    )

    return (
        <SelectedServerContext.Provider
            value={{ selectedServer, setSelectedServer }}
        >
            {children}
        </SelectedServerContext.Provider>
    )
}

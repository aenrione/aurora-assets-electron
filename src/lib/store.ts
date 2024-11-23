import { create } from 'zustand'
import { Asset } from '@/helpers/ipc/ftp'


export const gameStore = create<GameStore>((set) => ({
    currentGame: {
        name: '',
        titleId: '',
        databaseId: ''
    },
    games: [],
    setCurrentGame: (game: Asset) => set({ currentGame: game }),
    setGames: (games: Asset[]) => set({ games }),
    clearCurrentGame: () => set({ currentGame: { name: '', titleId: '', databaseId: '' } })
}))

export type GameStore = {
    currentGame: Asset
    games: Asset[],
    setCurrentGame: (game: Asset) => void,
    setGames: (games: Asset[]) => void,
    clearCurrentGame: () => void
}

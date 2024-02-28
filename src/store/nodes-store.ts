import { create } from 'zustand'

type InputTextNode = {
  text: string
}

type Action = {
  updateText: (text: InputTextNode["text"]) => void
}

export const useInputNodeStore = create<InputTextNode & Action>()((set) => ({
  text: '',
  updateText: (text) => set({ text }),
}))
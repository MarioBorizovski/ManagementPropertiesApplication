import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function AuthThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2.5 rounded-full bg-surface-hover text-muted hover:text-title hover:shadow-md transition-all z-50 border border-border"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}

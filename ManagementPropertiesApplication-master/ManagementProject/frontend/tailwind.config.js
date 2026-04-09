/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-base)',
                surface: 'var(--bg-surface)',
                'surface-hover': 'var(--bg-surface-hover)',
                border: 'var(--border-color)',
                'border-warm': 'var(--border-warm)',
                title: 'var(--text-title)',
                muted: 'var(--text-muted)',
                brand: {
                    DEFAULT: 'var(--brand-primary)',
                    hover: 'var(--brand-hover)',
                    50:  'var(--brand-50)',
                    100: 'var(--brand-100)',
                    200: 'var(--brand-200)',
                    300: 'var(--brand-300)',
                    400: 'var(--brand-400)',
                    500: 'var(--brand-500)',
                    600: 'var(--brand-600)',
                    700: 'var(--brand-700)',
                    800: 'var(--brand-800)',
                    900: 'var(--brand-900)',
                }
            }
        }
    },
    plugins: []
}
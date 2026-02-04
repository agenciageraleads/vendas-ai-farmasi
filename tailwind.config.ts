import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-primary)",
                foreground: "var(--text-primary)",

                // Brand Colors linked to design-tokens.css
                primary: {
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    DEFAULT: 'var(--primary-500)',
                },
                accent: {
                    300: 'var(--accent-300)',
                    400: 'var(--accent-400)',
                    500: 'var(--accent-500)',
                    600: 'var(--accent-600)',
                    700: 'var(--accent-700)',
                    DEFAULT: 'var(--accent-500)',
                },
                gold: {
                    500: 'var(--gold-500)',
                    600: 'var(--gold-600)',
                    700: 'var(--gold-700)',
                },

                // Semantic Colors
                success: {
                    DEFAULT: 'var(--success)',
                    bg: 'var(--success-bg)',
                },
                warning: {
                    DEFAULT: 'var(--warning)',
                    bg: 'var(--warning-bg)',
                },
                error: {
                    DEFAULT: 'var(--error)',
                    bg: 'var(--error-bg)',
                },
                info: {
                    DEFAULT: 'var(--info)',
                    bg: 'var(--info-bg)',
                },

                // Neutrals mapped to design tokens
                gray: {
                    50: 'var(--bg-secondary)', // Mapping lightest gray to secondary bg
                    100: 'var(--bg-tertiary)',
                    // Standard Tailwind grays are kept for other shades if needed, 
                    // or we can map them to specific text colors if we want Strict adherence.
                    // For now, let's keep standard tailwind grays available by NOT overriding 'gray' completely 
                    // but we added 'background' and 'foreground' above.
                    // Actually, to use standard tailwind grays alongside custom, we typically 
                    // just don't define 'gray' here unless we want to override it.
                    // The user wanted "Rich Aesthetics", so let's stick to the variables where possible.
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-poppins)', 'sans-serif'],
            },
            spacing: {
                'screen-padding': 'var(--screen-padding)',
            }
        },
    },
    plugins: [],
};
export default config;

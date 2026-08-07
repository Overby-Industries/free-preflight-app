'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'night' | 'day';

const THEME_STORAGE_KEY = 'freeflight-theme';

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('night');

    useEffect(() => {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'day' || stored === 'night') {
            setTheme(stored);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove('theme-night', 'theme-day');
        document.documentElement.classList.add(`theme-${theme}`);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

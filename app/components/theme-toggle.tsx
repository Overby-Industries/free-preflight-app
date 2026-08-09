'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTheme } from '@/app/context/theme-context';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'night' ? 'Switch to day mode' : 'Switch to night mode'}
            className="flex items-center gap-1.5 border border-[var(--color-rule)] px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
            {theme === 'night' ? <SunIcon className="w-4" /> : <MoonIcon className="w-4" />}
            <span className="hidden md:block">{theme === 'night' ? 'Day mode' : 'Night mode'}</span>
        </button>
    );
};

export default ThemeToggle;

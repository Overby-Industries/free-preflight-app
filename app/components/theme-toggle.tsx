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
            className="flex h-full items-center justify-center gap-2 rounded-md bg-[var(--color-panel)] text-[var(--color-accent)] text-sm font-medium hover:opacity-80 p-2"
        >
            {theme === 'night' ? <SunIcon className="w-6" /> : <MoonIcon className="w-6" />}
            <p className="hidden md:block">{theme === 'night' ? 'Day mode' : 'Night mode'}</p>
        </button>
    );
};

export default ThemeToggle;

import Link from 'next/link';
import NavLinks from './nav-links';
import ThemeToggle from './theme-toggle';
import React from 'react';

const Nav = () => {
    return (
        <section className="flex flex-col md:flex-row w-full items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4 md:pb-3">
            <Link href="/" className="flex flex-col items-center md:items-start">
                <h1 className="font-serif text-3xl text-[var(--color-text)]">
                    Free<em className="italic text-[var(--color-accent)]">Flight</em>
                </h1>
                <span className="eyebrow mb-0">Pilot Pre-Flight EFB</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-2">
                <NavLinks />
                <ThemeToggle />
            </div>
        </section>
    );
}

export default Nav;

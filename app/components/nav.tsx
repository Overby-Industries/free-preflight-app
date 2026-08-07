import Link from 'next/link';
import { roboto } from '@/app/ui/fonts';
import NavLinks from './nav-links';
import ThemeToggle from './theme-toggle';
import React from 'react';

const Nav = () => {
    return (
        <>
            <section className="flex flex-col md:flex-row max-h-max w-full items-center justify-between">
                <div className="grid-cols-2 h-full w-full md:w-1/2 items-left justify-between">
                    <Link
                        className="flex flex-col h-full w-full rounded-md bg-[var(--color-panel)]"
                        href="/"
                    >
                        <h1
                            className={`${roboto.className} h-1/2 font-bold text-3xl antialiased text-center text-[var(--color-accent)]`}
                        >
                            FreeFlight
                        </h1>
                        <h2 className="h-1/2 text-center text-lg text-[var(--color-accent)]">
                            Pilot pre-flight EFB
                        </h2>
                    </Link>
                </div>
                <div className="flex gap-2 h-full w-full md:w-1/2 items-right justify-start pt-4 md:pl-2 md:py-0">
                    <NavLinks />
                    <ThemeToggle />
                </div>
            </section>
        </>
    );
}

export default Nav;
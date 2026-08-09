'use client';

import {
    MapIcon,
    RocketLaunchIcon,
    ScaleIcon,
    Square3Stack3DIcon,
    SunIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';

const links = [
    { name: 'Dashboard', href: '/ui/dashboard', icon: Square3Stack3DIcon },
    { name: 'Weather', href: '/ui/dashboard/weather', icon: SunIcon },
    { name: 'Traffic', href: '/ui/dashboard/traffic', icon: MapIcon },
    { name: 'Weight & Balance', href: '/ui/dashboard/weight-balance', icon: ScaleIcon },
    { name: 'Pre-Flight', href: '/ui/dashboard/pre-flight', icon: RocketLaunchIcon },
];

const NavLinks = () => {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                const active = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex items-center gap-1.5 border px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-widest transition-colors',
                            active
                                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                                : 'border-[var(--color-rule)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                        )}
                    >
                        <LinkIcon className="w-4" />
                        <span className="hidden md:block">{link.name}</span>
                    </Link>
                );
            })}
        </>
    );
}

export default NavLinks;

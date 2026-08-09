import { Instrument_Serif, Syne, DM_Mono } from 'next/font/google';

export const instrumentSerif = Instrument_Serif({
    weight: ['400'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
});

export const syne = Syne({
    weight: ['400', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

export const dmMono = DM_Mono({
    weight: ['300', '400', '500'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

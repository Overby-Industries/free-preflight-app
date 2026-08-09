import React from 'react';
import FlightServiceContacts from '@/app/components/flight-service-contacts';

const PreFlight = () => {
    return (
        <section className="flex flex-col w-full items-start gap-4 pt-6">
            <div>
                <span className="eyebrow">Get Ready</span>
                <h2 className="font-serif text-2xl text-[var(--color-text)]">Pre-Flight</h2>
            </div>
            <div className="flex flex-col w-full items-start">
                <FlightServiceContacts />
            </div>
        </section>
    );
}

export default PreFlight;

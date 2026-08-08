import React from 'react';
import FlightServiceContacts from '@/app/components/flight-service-contacts';

const PreFlight = () => {
    return (
        <>
            <section className="flex flex-col h-full w-full items-center gap-4">
                <p className="h-fit w-full text-center text-xl pt-4 text-[var(--color-text)]">Pre-Flight</p>
                <div className="flex flex-col w-full items-start">
                    <FlightServiceContacts />
                </div>
            </section>
        </>
    );
}

export default PreFlight;
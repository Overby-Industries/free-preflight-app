import React from 'react';

const FlightServiceContacts = () => {
    return (
        <div className="flex flex-col gap-3 bg-[var(--color-panel)] rounded-md p-4 w-full">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Flight Service</h2>
            <p className="text-sm">
                Leidos Flight Service provides free weather briefings and can file, open, and
                close a VFR flight plan by phone.
            </p>
            <div className="flex flex-col gap-1 text-sm">
                <span>
                    <strong>1-800-WX-BRIEF</strong> (1-800-992-7433) — CONUS, Hawaii, and U.S.
                    territories
                </span>
                <span>
                    <strong>1-833-AK-BRIEF</strong> (1-833-252-7433) — Alaska
                </span>
                <a
                    href="https://www.1800wxbrief.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] underline w-fit"
                >
                    1800wxbrief.com
                </a>
            </div>
            <p className="text-xs opacity-70">
                In-flight contact frequencies aren&apos;t listed here yet. The FAA is actively
                decommissioning much of its remote communications outlet (RCO) network through
                2026, so for now use the frequency published on your current sectional chart or
                in the Chart Supplement rather than a number that may be out of date.
            </p>
        </div>
    );
};

export default FlightServiceContacts;

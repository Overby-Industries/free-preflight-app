import React from 'react';
import GetAirportInfo from '@/app/components/get-airport-info';
import GetStationInfo from '@/app/components/get-station-info';
import GetNavaid from '@/app/components/get-navaid';
import GetFix from '@/app/components/get-fix';
import GetFeatures from '@/app/components/get-features';
import GetObstacles from '@/app/components/get-obstacles';

const WeatherReference = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <span className="eyebrow">Briefing</span>
            <h2 className="font-serif text-2xl text-[var(--color-text)] pb-2">Reference Data</h2>
            <div className="flex flex-col w-full items-start divide-y divide-[var(--color-rule)]">
                <GetAirportInfo />
                <GetStationInfo />
                <GetNavaid />
                <GetFix />
                <GetFeatures />
                <GetObstacles />
            </div>
        </section>
    );
};

export default WeatherReference;

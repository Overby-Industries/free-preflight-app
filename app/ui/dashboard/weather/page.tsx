import React from 'react';
import GetMetar from '@/app/components/get-metar';
import GetPirep from '@/app/components/get-pirep';
import GetAirSigmet from '@/app/components/get-airsigmet';
import GetWindsAloft from '@/app/components/get-windsaloft';

const Weather = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <span className="eyebrow">Briefing</span>
            <h2 className="font-serif text-2xl text-[var(--color-text)] pb-2">Weather</h2>
            <div className="flex flex-col w-full items-start divide-y divide-[var(--color-rule)]">
                <GetMetar />
                <GetPirep />
                <GetAirSigmet />
                <GetWindsAloft />
            </div>
        </section>
    );
}

export default Weather;

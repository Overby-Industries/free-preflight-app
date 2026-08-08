import React from 'react';
import GetMetar from '@/app/components/get-metar';
import GetPirep from '@/app/components/get-pirep';
import GetAirSigmet from '@/app/components/get-airsigmet';
import GetWindsAloft from '@/app/components/get-windsaloft';

const Weather = () => {
    return (
        <>
            <section className="flex flex-col h-screen w-full items-center justify-between">
                <p className="h-fit w-full text-center text-xl pt-4 text-[var(--color-text)]">Weather</p>
                <div className="flex flex-col h-full w-full items-start">
                    <GetMetar />
                    <GetPirep />
                    <GetAirSigmet />
                    <GetWindsAloft />
                </div>
            </section>
        </>
    );
}

export default Weather;
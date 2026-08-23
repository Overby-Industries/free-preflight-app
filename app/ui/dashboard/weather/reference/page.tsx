import React from 'react';
import GetAirportInfo from '@/app/components/get-airport-info';
import GetStationInfo from '@/app/components/get-station-info';
import GetNavaid from '@/app/components/get-navaid';
import GetFix from '@/app/components/get-fix';
// import GetFeatures from '@/app/components/get-features';
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
                {/*
                  Aviation Navigation Features (aviationweather.gov's
                  /api/data/feature) — disabled for now, returns no useful
                  data with either a nationwide CONUS bbox or an
                  airport-centered one. Component/route left in place at
                  app/components/get-features.tsx, app/components/
                  features-map.tsx, and app/api/feature/route.ts.

                  Worth trying next: query along a flight route (a bbox or
                  buffered corridor between a departure/destination pair)
                  rather than one static box — this dataset may be meant to
                  be queried per-leg, not as a wide area dump.
                */}
                {/* <GetFeatures /> */}
                <GetObstacles />
            </div>
        </section>
    );
};

export default WeatherReference;

import React from 'react';
import GetCwa from '@/app/components/get-cwa';
import GetMis from '@/app/components/get-mis';
import GetAreaFcst from '@/app/components/get-areafcst';
import GetFcstDisc from '@/app/components/get-fcstdisc';
import GetAlerts from '@/app/components/get-alerts';

const WeatherProducts = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <span className="eyebrow">Briefing</span>
            <h2 className="font-serif text-2xl text-[var(--color-text)] pb-2">Products &amp; Alerts</h2>
            <div className="flex flex-col w-full items-start divide-y divide-[var(--color-rule)]">
                <GetFcstDisc />
                <GetAreaFcst />
                <GetCwa />
                <GetMis />
                <GetAlerts />
            </div>
        </section>
    );
};

export default WeatherProducts;

import React from 'react';
import WeightBalancePanel from '@/app/components/weight-balance/weight-balance-panel';

const WeightBalance = () => {
    return (
        <>
            <section className="flex flex-col h-screen w-full items-center justify-between">
                <p className="h-fit w-full text-center text-xl pt-4 text-[var(--color-text)]">
                    Weight &amp; Balance
                </p>
                <div className="flex flex-col h-full w-full items-start pt-4">
                    <WeightBalancePanel />
                </div>
            </section>
        </>
    );
}

export default WeightBalance;

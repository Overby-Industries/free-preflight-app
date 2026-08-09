import React from 'react';
import WeightBalancePanel from '@/app/components/weight-balance/weight-balance-panel';

const WeightBalance = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <WeightBalancePanel />
        </section>
    );
}

export default WeightBalance;

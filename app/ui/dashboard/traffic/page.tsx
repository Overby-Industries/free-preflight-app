import React from 'react';
import GetTraffic from '@/app/components/get-traffic';

const Traffic = () => {
    return (
        <>
            <section className="flex flex-col h-screen w-full items-center justify-between">
                <p className="h-fit w-full text-center text-xl pt-4 text-[var(--color-text)]">Traffic</p>
                <div className="flex flex-col h-full w-full items-start">
                    <GetTraffic />
                </div>
            </section>
        </>
    );
}

export default Traffic;

"use client"
import { useState, useEffect } from "react";

export default function CountdownTimer({ endDate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    });

    useEffect(() => {
        const target = new Date(endDate).getTime();

        const calculateTimeLeft = () => {
            const now = Date.now();
            const distance = target - now;

            if (distance < 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
                expired: false
            };
        };

        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endDate]);

    if (timeLeft.expired) {
        return <div className="text-red-500 font-bold text-xl animate-pulse">Offer Expired!</div>;
    }

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="bg-primary-custom text-white rounded-lg w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg mb-1 transform hover:scale-105 transition-transform duration-200">
                {String(value).padStart(2, '0')}
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
        </div>
    );

    return (
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-xl md:text-2xl font-bold mb-6">:</div>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <div className="text-xl md:text-2xl font-bold mb-6">:</div>
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <div className="text-xl md:text-2xl font-bold mb-6">:</div>
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
    );
}
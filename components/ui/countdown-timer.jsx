"use client"
import { useState, useEffect } from "react";

export default function CountdownTimer({ endDate }) {
    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        const target = new Date(endDate).getTime();

        const intervalId = setInterval(() => {
            const now = Date.now();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(intervalId);
                setTimeRemaining("Expired");
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeRemaining(`${days ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endDate]);

    return <div>{timeRemaining}</div>;
}
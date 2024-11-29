'use client'
import React, { useEffect, useState } from 'react';

export default function Genres() {
    const [genres, setGenres] = useState<any[]>([]);
    const [desc, setDesc] = useState<any[]>([]);

    const [timeRange, setTimeRange] = useState<number>(() => {
        return parseInt(localStorage.getItem("timeRange") || "2", 10);
    });

    useEffect(() => {
        const storedTimeRange = localStorage.getItem("timeRange");
        if (storedTimeRange) {
            setTimeRange(parseInt(storedTimeRange, 10));
        }
    }, []);

    async function fetchFavoriteGenres(): Promise<void> {
        try {
            const response = await fetch(`http://localhost:8000/spotify_data/displaygenres?timeframe=${timeRange}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                console.error("Failed to fetch SpotifyUser data");
                return;
            }
            let data = await response.json();
            console.log('everything went alright');
            console.log(data);
            
            setGenres(data.genres);
            setDesc(data.desc)
        } catch (error) {
            console.error("Error fetching SpotifyUser data:", error);
        }
    }

    useEffect(() => {
        fetchFavoriteGenres().catch(console.error);
    }, []);   

    return (
        <div className={"flex flex-row justify-center"}>
            <p>{genres}</p>
            <p>{desc}</p>
            <img 
                src="..\..\images\dumpster.png" 
                alt="dumpster graphic" 
                style={{ maxWidth: "20%", height: "auto", marginTop: "20px" }}
                />
        </div>
    );
}
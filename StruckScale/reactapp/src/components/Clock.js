import React, { useEffect, useState } from 'react'

const Clock = () => {
    const [clockState, setClockState] = useState();
    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setClockState(date.toLocaleString('en-GB'));
        }, 1000);
    }, []);
    return (
        <div style={{ fontSize: "20px" }}>{clockState}</div>
    )
}

export default Clock;
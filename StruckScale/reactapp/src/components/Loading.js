import React from 'react'


const Loading = async () => {
    return (
        <div className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default Loading;
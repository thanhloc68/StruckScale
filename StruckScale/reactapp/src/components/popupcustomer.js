/* eslint-disable react/prop-types */
import React from 'react'

function PopUpCenter(props) {
    return (props.trigger) ? (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <button className="close-btn" onClick={()=> props.setTrigger(false) }>x</button>
                    {props.children}
                </div>
            </div>
        </>
    ) : "";
}
export default PopUpCenter;
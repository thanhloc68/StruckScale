/* eslint-disable react/prop-types */
import React from 'react'



class Print extends React.Component {
    state = {
        carNumber : this.state.carNumber,
        customer: this.state.customer
    }
    render() {
        return (
            <>
                <div>chill components : {this.props.state.carNumber}</div>
                <div>chill components : {this.props.customer}</div>
            </>
        )
    }
}

export default Print;
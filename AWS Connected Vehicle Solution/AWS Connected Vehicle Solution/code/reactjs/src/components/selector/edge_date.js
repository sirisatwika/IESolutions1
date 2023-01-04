import React from "react";

function DateSelector() {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    
    return (
        <React.Fragment>
            <div className="todaysdate">
                Today <span>{date}</span>
            </div>
        </React.Fragment>
    )
}
export default DateSelector;
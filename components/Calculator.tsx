import React, { useState } from 'react';

const SALARY_THRESHOLD = 40000;
const LOWER_PRICE = 10;
const HIGHER_PRICE = 20;

export default function Calculator() {
    const [salary, setSalary] = useState(0);
    const [numCourses, setNumCourses] = useState(4);

    const cost = calculateCost(salary, numCourses);

return <div>
        <h2>How much will it cost?</h2>
        <label>Annual salary
            <input className="block" type="number" name="salary" onChange={(e) => setSalary(parseInt(e.target.value))}/>
        </label>

        <label>Number of sessions
            <input className="block" type="number" name="sessions" onChange={(e) => setNumCourses(parseInt(e.target.value))}/>
        </label>

        <Cost cost={cost}/>
       
    </div>
}

// Sorry for the old school null check -- should refactor into modern coalescing operator and/or ? optionals

function Cost(props:any) {
    const cost = props.cost;
    if (cost != null && !isNaN(cost)) {
        return (
            <label>Cost
                <div className="block">
                    {cost}
                </div>
            </label>
        )   
    }
    else {
        return <div>Enter your salary and sessions to calculate the cost.</div>
    }

}

function calculateCost(salary:number, numCourses:number):number {
    const price = salary < SALARY_THRESHOLD ? LOWER_PRICE : HIGHER_PRICE;
    return price * numCourses;
}

function onChangeSalary(e) {

}

function onChangeNumSessions(e) {

}
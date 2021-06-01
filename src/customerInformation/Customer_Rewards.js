import React, { useState, useEffect, Fragment } from 'react';
import './CustomerRewards.css';
import data from '../customerData';
import { rewardPointsCalculator } from '../common/RewardsCalculator';


const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const CustomerRewards = () => {
    const [loadedData, setloadedData] = useState({});
    const [userRewards, setUserRewards] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });

    useEffect(() => {
        setloadedData({ ...data });
        setUsers([...Object.keys(data)]);

    }, []);

    const userSelect = (value) => {
        setCurrentUser(value);
        let userData = loadedData[value];

        let monthT = [];

        userData.length > 0 && userData.forEach((nameProp, i) => {
            let month = new Date(nameProp['date']);

            let monObj = {
                amounts: [],
                rewards: 0,
                monthName: ''
            }
            let ifExists = false;
            monthT.forEach((exestingMonth) => {
                if (exestingMonth.monthName === monthNames[month.getMonth()]) {
                    exestingMonth.amounts.push(nameProp['amount']);
                    ifExists = true;
                }
            })
            if (!ifExists) {
                monObj.amounts.push(nameProp['amount']);
                monObj.monthName = monthNames[month.getMonth()];
                monthT.push(JSON.parse(JSON.stringify(monObj)));

            }

        })


        monthT.forEach((monthTElement) => {
            let total_month_rewards = 0;
            monthTElement['amounts'].forEach((eachAmount) => {
                total_month_rewards = total_month_rewards + rewardPointsCalculator(eachAmount);
            })
            monthTElement['rewards'] = total_month_rewards;
        })
        setUserRewards([...monthT]);
        setUserTransactions([...userData]);
    };

    const updateInput = (e) => {
        if (e.target.name === "date") {
            setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
        }
        if (e.target.name === "amount") {
            setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
        }
    }

    const btnAddtransaction = () => {
        let data = { ...loadedData };
        let month = new Date(newTransaction['date']);
        const formatedate = (month.getMonth() + 1) + '/' + (month.getDate() + 1) + '/' + newTransaction.date.slice(0, 4)
        newTransaction.date = formatedate;
        data[currentUser].push(newTransaction);

        setloadedData({ ...data });

        userSelect(currentUser);
        setNewTransaction({ date: new Date(), amount: 0 });
    }
    const totalRewards = () => {
        let totalPoints = 0;
        userRewards.forEach((calcRewards) => {
            totalPoints += calcRewards.rewards;
        })
        return (
            <tr>
                <td>Total Reward</td>
                <td>{totalPoints}</td>
            </tr>
        )
    }
    return (
        <div style={{
            marginTop: "20px",
            marginBottom: "50px",
            fontSize: "20px",
            textAlign: 'center'
        }}>
            <h2 style={{ textAlign: "center" }}>Customer Rewards Dashborad</h2>
            <p>A customer receives 2 points for every dollar spent over $100 in each transaction, plus 1 point for every dollar spent over $50 in each transaction
Below Example might be wrong.
(e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points).</p>
            <p>If i am correct,
(e.g. a $120 purchase = 2x$20 + 1x$70 = 110 points).</p>
            <div className="select-style">
                <select onChange={e => userSelect(e.target.value)} value={currentUser} >
                    <option value="" disabled>Select User</option>
                    {users.map((item, index) => {
                        return (
                            <option key={index} value={item}> {item.toUpperCase()} </option>
                        );
                    })}
                </select>
            </div>
            {userRewards.length > 0 &&
                <Fragment>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Rewards</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRewards.map((eachUserElement, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{eachUserElement.monthName} Month</td>
                                        <td>{eachUserElement["rewards"]}</td>
                                    </tr>
                                )
                            })}
                            {totalRewards()}
                        </tbody>
                    </table>
                    <h4>User Transactions</h4>
                    {userTransactions.length > 0 ?
                        <table className="customers">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Rewards</th>
                                </tr>

                            </thead>
                            <tbody>
                                {userTransactions.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item["date"]}</td>
                                        <td>{item["amount"]}</td>
                                        <td>{rewardPointsCalculator(item["amount"])}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        : <div>No Transactions Found</div>}
                    <div>
                        <h4>Add Transactions</h4>
                        <label>Date : </label><input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
                        <label>Amount :</label><input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
                        <button onClick={() => btnAddtransaction()}>Add Transaction</button>
                    </div>
                </Fragment>
            }


        </ div >
    );
}

const arePropsEqual = (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps);

export default React.memo(CustomerRewards, arePropsEqual);

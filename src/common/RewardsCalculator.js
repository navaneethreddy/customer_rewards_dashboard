export const rewardPointsCalculator = (purchasePrice) => {
    let rewards = 0;
    /*customer receives 2 points for every dollar spent over $100 in each transaction*/
    if (purchasePrice > 100) {
        rewards = (purchasePrice - 100) * 2;
    }
    /********************* */
    /**customer receives 1 point for every dollar spent over $50 in each transaction */
    if (purchasePrice > 50) {
        rewards = (purchasePrice - 50) + rewards;
    }
    /********************* */
    return rewards;

}

/*******
A customer receives 2 points for every dollar spent over $100 in each transaction, plus 1 point for every dollar spent over $50 in each transaction
Below Example might be wrong.
(e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points). */

/*******
If i am correct,
(e.g. a $120 purchase = 2x$20 + 1x$70 = 110 points). */
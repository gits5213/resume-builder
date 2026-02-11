/**
 * Finds the sum of multiples of 3 or 5 that are less than the provided number.
 *
 * @param {number} number - The maximum number to check against (exclusive).
 * @returns {number} Sum of all multiples of either 3 or 5 between 1 and n.
 * 
 * multiplesOf3And5(10) should return 23
 * multiplesOf3And5(1000) should return 233168
 * 
 * 
*/


const multiplesOf3And5 = number => { // eslint-disable-line no-unused-vars
  let sum = 0;
  for (let i = 1; i < number; i++) {
    if (i % 3 === 0 || i % 5 === 0) sum += i;
  }
  return sum;
};  // eslint-disable-line no-unused-vars   eslint-disable-line no-unused-vars

console.log(multiplesOf3And5(10));
console.log(multiplesOf3And5(1000));



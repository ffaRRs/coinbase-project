const fetch = require("node-fetch");
const fs =  require("fs");

class YearPriceChart {

    constructor() {
        this.chartCurrency = [];
    };

    #getCurrencyMaxValue(arr) {
        let max = 0;
        let timeStamp = 0;
        let length = 365;

        if(arr.length < length) {
            length = arr.length;
        }
    
        for(let i = 0; i < length; i++) {
            if(arr[i][2] > max) {
                timeStamp = arr[i][0];
                max = arr[i][2];
            }
        }
        return {timeStamp: timeStamp, maxValue: max}
    }
    
    
    #getCurrencyMinValue(arr, maxValue) {
        let min = maxValue;
        let timeStamp = 0;
        let index = 0;

        for(let i = 0; i < arr.length; i++) {
            if(arr[i][2] == maxValue)  {
                index = i; 
                break;
            }
        }

        for(let i = index; i > 0; i--) {          
            if(arr[i][1] < min) {
                timeStamp = arr[i][0];
                min = arr[i][1];
            }
        }
         
        return {timeStamp: timeStamp, minValue: min}
    }
    
    
    async #getCurrencyValuesOfPeriod(id, yearRange) {
        const arrayValues = [];
        const options = {method: 'GET', headers: {accept: 'application/json'}};
    
        const getCurrentYear = await fetch(`https://api.exchange.coinbase.com/products/${id}/candles?granularity=86400`, options);
        const currentTime = (await getCurrentYear.json())[0][0];
    
        for(let i = 0; i < yearRange; i++) {
            const getValues = await fetch(`https://api.exchange.coinbase.com/products/${id}/candles?granularity=86400&start=${currentTime - ((i + 1) * 300 * 86400)}&end=${currentTime - ((i) * 300 * 86400)}`, options);
            arrayValues.push(await getValues.json());
        }

        for(let i = 0; i < arrayValues.length; i++) {
            fs.writeFileSync("values.txt", `${arrayValues[i]} \n`)
        }
        // console.log(arrayValues);
        return arrayValues.flat();  
    }
    
    
    async #getAllCurrencies() { 
        const arrayCurrencies = [];
        const options = {method: 'GET', headers: {accept: 'application/json'}};
    
        const getAllCurrencies = await fetch(`https://api.exchange.coinbase.com/products`, options);
        arrayCurrencies.push(await getAllCurrencies.json());
    
        return arrayCurrencies.flat().filter((elem) => elem.quote_currency == "USD");    
    }
    
    async start() {

        const curriencies = await this.#getAllCurrencies();
        this.chartCurrency.length = 0;
    
        for(let i = 0; i < 1; i++) {
           
            const currencyValues = await this.#getCurrencyValuesOfPeriod("KNC-USD", 2);
            // console.log(curriencies[0]);
    
            this.chartCurrency.push({
                base: curriencies[i].base_currency,
                values: currencyValues,
                curValue: currencyValues[0][3],
                maxValue: this.#getCurrencyMaxValue(currencyValues).maxValue,
                minValue: this.#getCurrencyMinValue(currencyValues, this.#getCurrencyMaxValue(currencyValues).maxValue).minValue
            });
            // console.log(this.chartCurrency[0]);
        }
        console.log(this.chartCurrency[0].values.length)

        // console.log(this.chartCurrency[0].values[364])
        // console.log(this.chartCurrency[0].values[363])
        
        // console.log(this.chartCurrency[0].values[362])
        // console.log(this.chartCurrency[0].values[361])

        console.log(this.chartCurrency[0].values[4])
        console.log(this.chartCurrency[0].values[3])
        console.log(this.chartCurrency[0].values[2])

        console.log(this.chartCurrency[0].values[1])
        console.log(this.chartCurrency[0].values[0])



        // console.log(await getAllCurrencies())  
    }
}

module.exports = YearPriceChart;














// const fetch = require('node-fetch');
// const fs = require("fs");

// const getCurrencyMaxValue = (arr) => {
//     let max = 0;
//     let timeStamp = 0;
    
//     arr = arr.flat();

//     for(let i = 3; i < arr.length; i += 6) {
//         // console.log(arr[i]);
//         if(arr[i] > max) {
//             timeStamp = arr[i - 3];
//             max = arr[i];
//         }
//     }
//     return {timeStamp: timeStamp, maxValue: max}
// }


// const getCurrencyMinValue = (arr, maxValue) => {
//     let min = maxValue;
//     let timeStamp = 0;
//     let tmp = [];

//     arr = arr.flat();

//     console.log(arr);

//     for(let i = arr.indexOf(maxValue) - 2; i > 0; i -= 6) {
//         tmp.push(arr[i]);
//         // console.log(arr[i]);
//         if(arr[i] < min) {
//             timeStamp = arr[i - 1];
//             min = arr[i];
//         }
//     }
//     // console.log(tmp);
//     // console.log(tmp.length);

//     return {timeStamp: timeStamp, minValue: min}
// }


// const getCurrencyValuesOfPeriod = async (id, yearRange) => {
//     const arrayValues = [];
//     const options = {method: 'GET', headers: {accept: 'application/json'}};

//     const getCurrentYear = await fetch(`https://api.exchange.coinbase.com/products/${id}/candles?granularity=86400`, options);
//     const currentTime = (await getCurrentYear.json())[0][0];

//     for(let i = 0; i < yearRange; i++) {
//         console.log(i);
//         console.log(currentTime - (i * 300 * 86400));
//         const getValues = await fetch(`https://api.exchange.coinbase.com/products/${id}/candles?granularity=86400&start=${currentTime - ((i + 1) * 300 * 86400)}&end=${currentTime - ((i) * 300 * 86400)}`, options);
//         arrayValues.push(await getValues.json());
//     }
//     // for(let i = 0; i < arrayValues.length; i++) {
//     //     fs.writeFileSync("values.txt", `${arrayValues[i]} \n`)
//     // }
//     return arrayValues.flat();  
// }


// const getAllCurrencies = async () => {
//     const arrayCurrencies = [];
//     const options = {method: 'GET', headers: {accept: 'application/json'}};

//     const getAllCurrencies = await fetch(`https://api.exchange.coinbase.com/products`, options);
//     arrayCurrencies.push(await getAllCurrencies.json());

//     return arrayCurrencies.flat().filter((elem) => elem.quote_currency == "USD");    
// }

// const start = async () => {
//     const chartCurrency = [];


//     const curriencies = await getAllCurrencies();

 
//     for(let i = 0; i < 1; i++) {
       
//         const currencyValues = await getCurrencyValuesOfPeriod("ETH-USD", 3);
//         // console.log(curriencies[0]);

//         chartCurrency.push({
//             base: curriencies[i].base_currency,
//             values: currencyValues,
//             curValue: currencyValues[0][3],
//             maxValue: getCurrencyMaxValue(currencyValues).maxValue,
//             minValue: getCurrencyMinValue(currencyValues, getCurrencyMaxValue(currencyValues).maxValue).minValue
//         });

//     }


//     console.log(chartCurrency[0])
//     // console.log(await getAllCurrencies()) 

// }

// // console.log(getMaxCurrencyValueOfAllTime(5))
// module.exports = start;


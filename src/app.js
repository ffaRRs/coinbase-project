const path = require("path");

require("dotenv").config();

const YearPriceChart = require("./charts/year-price-chart/YearPriceChart.js");
const fs = require("fs")
const express = require("express");
const { send } = require("process");

const app = express();
const yearPriceChart = new YearPriceChart()

// console.log(app);
const port = 3000;

app.use(express.static("/charts"));


app.get("/data", async (req,res) => {

    const dataOnChart = [];

    yearPriceChart.chartCurrency[0].values.forEach((elem, i) => {
        if(i < 365) {
            // labelsOnChart.push(`"${new Date(elem[0] * 1000).toLocaleDateString('en-us', { month:"short", day:"numeric"})}"`);
            dataOnChart.push({x: `${new Date(elem[0] * 1000).toLocaleDateString('en-us', { month:"short", day:"numeric"})}`, y: elem[4].toFixed(2)});
        }
    })
    res.json({price: dataOnChart.reverse(), base: yearPriceChart.chartCurrency[0].base});
})

app.get('*', async (req, res) => {
    // console.log(yearPriceChart.chartCurrency[0]);

    if(req.url == "/charts/year-price-chart/script.js") {
        res.sendFile(path.join(__dirname, "/charts", "/year-price-chart", "/script.js"), (err) => {
            if(err) console.log(err);
        })
    }
    
    else { 
        res.sendFile(path.join(__dirname, "/charts", "/year-price-chart", "/year_chart.html"), (err) => {
            if(err) console.log(err);
        })
    }   
});


// app.get("/charts/year-price-chart/script.js", async (req, res) => {
//     console.log("hello");
//     res.sendStatus(200);
// })
  
app.listen(port, async () => {
    await yearPriceChart.start();

    console.log(`Example app listening on port ${port}`)
});





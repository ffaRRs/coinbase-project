// const yearPriceChart = require("./YearPriceChart.js");
// console.log(yearPriceChart);
// const Chart = require("chart.js");

(async () => {
        let data = ""

        try {
            data = (await axios.get("/data")).data;
            console.log(data);

        } catch(e) {
            console.log(e);
        }
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: data.base,
                        data: data.price,    
                        backgroundColor: ["transparent"],
                        pointBorderColor: 'transparent',
                        borderColor: [],
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                }
            });
})();





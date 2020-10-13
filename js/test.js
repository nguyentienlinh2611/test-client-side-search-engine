import {hofMeasuredExecutionTime, removeAccentedCharacter} from "./utils";
import FlexSearch from "flexsearch";

$(document).ready(function () {
  const keywords = ["Trà", "Trà Đào", "Trà Đà", "trà đ", "Tra Dao", "tra dao", "tra da", "tra ", "tr"];
  const fields = ["VariantName", "ProductName"];

  // $.ajax("products.json", {
  //   success: function (data) {
  //     const addedProducts = data.Products.map(function (product) {
  //       product.VariantNonAccent = removeAccentedCharacter(product.VariantName);
  //       return product;
  //     });
  //     for (let product of addedProducts) {
  //         elasticlunrWithNonAccentsSE.addDoc(product);
  //     }
  //     console.log(elasticlunrWithNonAccentsSE.documentStore);
  // }});



  const canvasCtx = $("#search-engine");
  const chart1 = new Chart(canvasCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: "Measured perform searching took time in milliseconds",
          data: [],
          fill: true,
          backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],"borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
          barThickness: 50,
          maxBarThickness: 80,
          minBarLength: 20,
        }]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function(value, index) {
                if(index === 0)
                  return value + "(ms)";
                return value;
              }
            }
          }]
      }
    }
  });

  const canvasCtxResults = $("#search-engine-results");
  const chart2 = new Chart(canvasCtxResults, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: "Count number of search results",
          data: [],
          fill: true,
          backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],"borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
          barThickness: 50,
          maxBarThickness: 80,
          minBarLength: 20,
        }]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }]
      }
    }
  });

  let searchProductsInput = $("#search-product");
  let searchProductsBtn = $("#search-product-btn");
  let displaySE1Results = $("#results-se1");

  searchProductsBtn.on("click", function () {
    // chart1.data.labels.pop();
    // chart1.data.datasets.forEach((dataset) => {
    //   dataset.data.pop();
    // });
    // chart1.update();
    //
    // chart2.data.labels.pop();
    // chart2.data.datasets.forEach((dataset) => {
    //   dataset.data.pop();
    // });
    // chart2.update();
    //
    // displaySE1Results.empty();

    let keyword = searchProductsInput.val();

  });
});

import MiniSearch from "minisearch";

const elasticlunr = require("elasticlunr");
const lunr = require("lunr");
const {hofMeasuredExecutionTime} = require("./utils");

$(document).ready(function () {
  const keywords = ["Trà", "Trà Đào", "Trà Đà", "trà đ", "Tra Dao", "tra dao", "tra da", "tra ", "tr"];
  const fields = ["VariantName", "ProductName"];

  const searchEngine1 = elasticlunr(function () {
    this.setRef("VariantId");
    for (let idx in fields) {
      this.addField(fields[idx]);
    }
  });

  for(let i in window.products){
    searchEngine1.addDoc(window.products[i]);
  }

  const t0 = performance.now();
  for (let idx in keywords) {
    let idxResults = searchEngine1.search(keywords[idx], {});
    let results = idxResults.map(idx => searchEngine1.documentStore.docs[idx.ref]);
    console.log("Results for ",keywords[idx] , results);
  }
  const t1 = performance.now();
  const searchEngine1Result = t1 - t0;
  console.log(`Query search took ${t1 - t0} milliseconds.`);

  elasticlunr.tokenizer = function (str) {
    if (!arguments.length || str === null || str === undefined) return [];
    if(Array.isArray(str)) {
      var arr = str.filter(function(token) {
        return !(token === null || token === undefined);


      });

      arr = arr.map(function (t) {
        return elasticlunr.utils.toString(t).toLowerCase();
      });

      var out = [];
      arr.forEach(function(item) {
        var tokens = item.match(/.{1,3}/g);
        out = out.concat(tokens);
      }, this);

      return out;
    }
    return str.toString().trim().toLowerCase().match(/.{1,3}/g);
  };

  const searchEngine2 = elasticlunr(function () {
    this.setRef("VariantId");
    for (let idx in fields) {
      this.addField(fields[idx]);
    }
  });

  for(let i in window.products){
    searchEngine2.addDoc(window.products[i]);
  }

  const miniSearchEngine = new MiniSearch({
    idField: ["VariantId"],
    fields: ["VariantName", "ProductName"],
    storeFields: ["VariantName", "ProductName"]
  });

  miniSearchEngine.addAll(window.products);

  const t3 = performance.now();
  for (let idx in keywords) {
    let idxResults = searchEngine1.search(keywords[idx], {});
    let results = idxResults.map(idx => searchEngine1.documentStore.docs[idx.ref]);
    console.log("Results for ",keywords[idx] , results);
  }
  const t4 = performance.now();
  console.log(`Query search took ${t4 - t3} milliseconds.`);
  const searchEngine2Result = t4 - t3;
  const canvasCtx = $("#comparison-engine");
  new Chart(canvasCtx, {
    type: 'bar',
    data: {
      labels: ["searchEngine1", "searchEngine2"],
      datasets: [
        {
          label: "Measured perform searching took time in milliseconds",
          data: [searchEngine1Result, searchEngine2Result],
          fill: true,
          backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)"],
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
              callback: function(value, index, values) {
                if(index === 0)
                  return value + "(ms)";
                return value;
              }
            }
          }]
      }
    }
  });

  let searchProductsInput = $("#search-product");
  let searchProductsBtn = $("#search-product-btn");
  let displaySE1Results = $("#results-se1");
  let displaySE2Results = $("#results-se2");
  let displaySE3Results = $("#results-se3");
  searchProductsBtn.on("click", function () {
    displaySE1Results.empty();
    displaySE2Results.empty();
    displaySE3Results.empty();
    let keyword = searchProductsInput.val();

    let execResult1 = hofMeasuredExecutionTime(() => searchEngine1.search(keyword, {}));
    let results1 = execResult1.result.map(r => searchEngine1.documentStore.docs[r.ref]);
    results1.slice(0, 10).forEach(r => displaySE1Results.append($("<li/>").text(r.VariantName)));

    let execResult2 = hofMeasuredExecutionTime(() => searchEngine2.search(keyword, {}));
    let results2 = execResult2.result.map(r => searchEngine2.documentStore.docs[r.ref]);
    results2.slice(0, 10).forEach(r => displaySE2Results.append($("<li/>").text(r.VariantName)));

   let execResult3 = hofMeasuredExecutionTime(() => miniSearchEngine.search(keyword));
    let results3 = execResult3.result;
    results3.slice(0, 10).forEach(r => displaySE3Results.append($("<li/>").text(r.VariantName)));

    const canvasCtx = $("#search-engine");
    new Chart(canvasCtx, {
      type: 'bar',
      data: {
        labels: ["searchEngine1", "searchEngine2", "MiniSearch"],
        datasets: [
          {
            label: "Measured perform searching took time in milliseconds",
            data: [execResult1.executionTime, execResult2.executionTime, execResult3.executionTime],
            fill: true,
            backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)"],
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
                callback: function(value, index, values) {
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
    new Chart(canvasCtxResults, {
      type: 'bar',
      data: {
        labels: ["searchEngine1", "searchEngine2", "MiniSearch"],
        datasets: [
          {
            label: "Count number of search results",
            data: [results1.length, results2.length, results3.length],
            fill: true,
            backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)"],
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


  });
});

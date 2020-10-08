var elasticlunr = require("elasticlunr");

$(document).ready(function () {
  //init indexedDB
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  } else {
    let DatabaseSetting = {
      name: "TestSearchEngine",
      version: 1,
      tables: [{
        tableName: "products",
        keyPath: "seq",
        autoIncrement: true,
        index: ["VariantId", "ProductId", "VariantName", "ProductName", "Sku", "Barcode"],
        unique: [false, false, false, false, false, false]
      }]
    }

    let searchEngine = elasticlunr(function () {
      for (let idx in DatabaseSetting.tables[0].index) {
        this.addField(idx);
        this.setRef(idx);
      }
    });

    ! function() {
      console.log("indexeDB init");

      var req = indexedDB.open(DatabaseSetting.name, DatabaseSetting.version);

      req.onsuccess = function(event) {
        console.log("indexedDB open success");
      };

      req.onerror = function(event) {
        console.log("indexed DB open fail");
      };

      //callback run init or versionUp
      req.onupgradeneeded = function(event) {
        console.log("init onupgradeneeded indexedDB ");
        let db = event.target.result;

        for (let i in DatabaseSetting.tables) {
          let OS = db.createObjectStore(DatabaseSetting.tables[i].tableName, {
            keyPath: DatabaseSetting.tables[i].keyPath,
            autoIncrement: DatabaseSetting.tables[i].autoIncrement
          });

          for (let j in DatabaseSetting.tables[i].index) {
            OS.createIndex(DatabaseSetting.tables[i].index[j], DatabaseSetting.tables[i].index[j], {
              unique: DatabaseSetting.tables[i].unique[j]
            });
          }
        }
      }
    }();

    var IDBFuncSet = {
      //write
      addData: function(table, data) {
        var req = indexedDB.open(DatabaseSetting.name, DatabaseSetting.version);

        req.onsuccess = function(event) {
          try {
            console.log("addData indexedDB open success");
            var db = req.result;
            var transaction = db.transaction([table], "readwrite");
            var objectStore = transaction.objectStore(table);
            searchEngine.addDoc(data);
            var objectStoreRequest = objectStore.add(data);
          } catch (e) {
            console.log("addDataFunction table or data null error");
            console.log(e);
          }

          objectStoreRequest.onsuccess = function(event) {
            //console.log("Call data Insert success");
          }
          objectStoreRequest.onerror = function(event) {
            console.log("addData error");
          }
        };

        req.onerror = function(event) {
          console.log("addData indexed DB open fail");
        };
      }
    }

    for(var i in window.products){
      IDBFuncSet.addData("products",window.products[i]);
    }

    let searchProductsInput = $("#search-product");

    searchProductsInput.autocomplete({
      source: function (request, response) {
        response(searchEngine.search(request.term));
      }
    });
  }
});

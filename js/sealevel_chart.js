export default function createSeaLevelChart(){
    $.getJSON("data/sealeveldata.json", function(json) {
    //console.log(json); 
    //json = json.filter(a => a.year>1980);
    for (var i = 0; i < json.length; i++) {
      json[i].year = json[i].year.toString();
      console.log(json[i]) ;
  }
  
  let spec4 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": "700",
    "height": "400",
    "title": {"text":"Sea Level Over Time",
    "font": "'Kulim Park', sans-serif"},
    "data": {
      //"url": "data/TempData.3json",
      "values": json,
      //"format": {"parse": {"Year": "string"}}
    },
    "encoding": {
        "x": {"timeUnit": "yearmonth", "field": "year", "type": "temporal", "title":"Year"},
        "y": {"aggregate": "sum", "field": "33", "type": "quantitative", "title":"Adjusted Sea Level (In)"}
    },
    "layer": [{
      "selection": {
        "brush": {
          "type": "interval",
          "encodings": ["x"]
        }
      },
      "mark": "area"},{ 
      "transform": [
        {"filter": {"selection": "brush"}}
      ],
<<<<<<< HEAD
<<<<<<< HEAD
      "mark": {"type": "area", "color": "deepblue"}
=======
      "mark": {"type": "area", "color": "lightblue", "tooltip":true}
>>>>>>> 62af6f1126f9bbb4793128fc2f6fec5e4e8142b4
=======
      "mark": {"type": "area", "color": "deepblue", "tooltip":true}
>>>>>>> 63ceed69706cdf34beed54c9f960501f445b16a4
    }]
  }
  vegaEmbed('#sealevel-area', spec4);
  });
  };
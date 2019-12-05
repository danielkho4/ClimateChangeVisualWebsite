export default function createGlacierChart() {
  $.getJSON("data/glacierdata.json", function(json) {
    //console.log(json); 
    //json = json.filter(a => a.year>1980);
    for (var i = 0; i < json.length; i++) {
      json[i].year = json[i].year.toString();
      console.log(json[i]) ;
  }

  let spec3 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": "700",
    "height": "400",
    "title": {"text":"Average Cumulative Mass Balance Glaciers Worldwide",
    "font": "'Kulim Park', sans-serif"},
    "data": {
      //"url": "data/TempData.3json",
      "values": json,
      //"format": {"parse": {"Year": "string"}}
    },
    "mark": {
      "type": "area",
      "line": {
        "color": "lightblue",
      "tooltip":true
      },
      "color": {
        "x1": 1,
        "y1": 1,
        "x2": 1,
        "y2": 0,
        "gradient": "linear",
        "stops": [
          {
            "offset": 0,
            "color": "white"
          },
          {
            "offset": 1,
            "color": "lightblue"
          }
        ]
      }
    },
    "encoding": {
      "x": {"field": "year", "type": "temporal",
      "axis": {
        "labelPadding": "4",
        "title":"Year"
      }},
      "y": {"field": "22", "type": "quantitative",
    "title":"Average Cunulative Mass of Glaciers Globally (Inches)"}
    }
  }
  vegaEmbed('#glacier-area', spec3);
  });
};
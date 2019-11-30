import createTreemap from "./country_line_graph.js";
import create_US_map from "./US_map.js";
import createGlacierChart from "./glacier_chart.js";

export default function createLineChart() {
  $.getJSON("data/TempData.json", function(json) {
    console.log(json); 
    json = json.filter(a => a.Year>1980);
    for (var i = 0; i < json.length; i++) {
      json[i].Year = json[i].Year.toString();
  }

let spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "400",
  "height": "400",
  "title": {"text":"World Temperature Anomalies by Year",
  "font": "'Kulim Park', sans-serif"},
  "data": {
    //"url": "data/TempData.3json",
    "values": json,
    //"format": {"parse": {"Year": "string"}}

  },

  "mark": {"type":"point", "tooltip":{"field":"Source", "type":"ordinal"}},
  "encoding": {
    "x": {"field": "Year", "type": "temporal",
    "axis": {
      "labelPadding": "4",
      "bandPosition": 0.5,
      "tickCount":9
    }},
    "y": {"field": "Mean", "type": "quantitative",
  "title":"Mean Temperature Anomalies (Degrees C)"},
  "color": {
    "condition": {"test": "datum.Source === 'GCAG'", "value": "black"},
    "value": "blue"
  }

  }
}
vegaEmbed('#chart-area', spec);
});
$.getJSON("data/Carbon_emissions.json", function(json) {
  console.log(json); 
  for (var i = 0; i < json.length; i++) {
    json[i].year = json[i].year.toString();
}
let spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "400",
  "height": "400",
  "title": {"text" : "World Carbon Emissions by Year", 
  "font": "'Kulim Park', sans-serif"},
  "data": {"values": json},
  //"transform": [{"filter": "datum.symbol==='GOOG'"}],
  "mark": {"type":"point","tooltip":true},
  "encoding": {
    "x": {"field": "year", "type": "temporal",
    "axis": {
      "labelPadding": "4",
      "title":"Year",
      "bandPosition": 0.5,
      "tickCount":9
    }},
    "y": {"field": "mean", "type": "quantitative",
    "scale": {"domain": [250,450]},
    "title":"Mean CO2 (micromol)"
  }
  }
}
vegaEmbed('#CO2area', spec2);
});

};
createLineChart();

createTreemap();

create_US_map();

createGlacierChart();


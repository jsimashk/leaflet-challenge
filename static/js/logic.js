  
  //var mapboxurl = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
  //var mapattribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";
  //var grayscale = L.tileLayer(mapboxurl, {id: 'MapID', attribution: mapattribution}),
  //  streets   = L.tileLayer(mapboxurl, {id: 'MapID', attribution: mapattribution});

  // Add a tile layer
  var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  }); //.addTo(myMap);

  var darkLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }); //.addTo(myMap);

  var lightLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }); //.addTo(myMap);

  var outdoorsLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  }); //.addTo(myMap);
  
// Only one base layer can be shown at a time
var baseMaps = {
    Satellite: satelliteLayer,
    Light: lightLayer,
    Dark: darkLayer,
    Outdoors: outdoorsLayer
  };
  
 // An array which will be used to store created earthquakeMarkers
 var earthquakeMarkers = [];


  function markerSize(magnitude) {
    return magnitude*6;
  };

  function markerColor(magnitude){
      if (magnitude < 1)
        return "#2e7f18";
      if (magnitude >= 1 && magnitude < 2)
        return "#45731e";
      if (magnitude >= 2 && magnitude < 3)
        return "#675e24";
      if (magnitude >= 3 && magnitude < 4)
        return "#8d472b";
      if (magnitude >= 4 && magnitude < 5)
        return "#b13433";
      if (magnitude >= 5)
        return "#c82538";
  }

  d3.json("static/data/earthquakes.json").then(function(data) {
    //console.log(data.names);
    //console.log(data.metadata);
    //console.log(data.metadata[0].id);
    //console.log(data.samples);
    //console.log(data.samples[0].otu_ids.slice(0,10));
    //console.log(data.samples[0].sample_values.slice(0,10));
    //console.log(data.samples[0].otu_labels.slice(0,10));
    console.log(data.features[0]);
    console.log(data.features[0].properties.mag);
    console.log(data.features[0].geometry.coordinates[0]);
    console.log(data.features[0].geometry.coordinates[1]);
    //plotGaugeGraph(data, 0);
    
    console.log(data.features.length);


    // Loop through the locations array and create one marker for each city, bind a popup containing its name and population add it to the map
    for (var i = 0; i < data.features.length; i++) {
        var magnitude = data.features[i].properties.mag;
        var title = data.features[i].properties.title;
        var coordinates = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]];
        //console.log(coordinates)
        //console.log(markerSize(magnitude));

        //L.marker(coordinates)
        //  .bindPopup("<h1>Magnitude: " + magnitude + "</h1> <hr> <h3>Population " + title + "</h3>")
        //  .addTo(myMap);

        //earthquakeMarkers.push(
            L.circleMarker(coordinates, {
            fillOpacity: 0.75,
            color: markerColor(magnitude), //"red",
            fillColor: markerColor(magnitude), //"red",
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its magnitude
            radius: markerSize(magnitude)
          }).bindPopup("<h1>Magnitude: " + magnitude + "</h1> <hr> <h3>Population " + title + "</h3>")
          .addTo(myMap);
     }
    
});

//console.log(earthquakeMarkers);

// Add all the earthquakeMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
var earthquakeLayer = L.layerGroup(earthquakeMarkers);

// Overlays that may be toggled on or off
var overlayMaps = {
    Earthquakes: earthquakeLayer,
    FaultLines: earthquakeLayer
  };

  
  // Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightLayer, earthquakeLayer]
  });

  
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
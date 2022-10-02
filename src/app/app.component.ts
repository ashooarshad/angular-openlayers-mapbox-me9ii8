import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Map, View } from 'ol';
import { MVT } from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileJSON from 'ol/source/TileJSON';
import OSM from 'ol/source/OSM';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style';
import stylefunction from 'ol-mapbox-style/stylefunction';
import olms, {applyStyle, applyBackground} from 'ol-mapbox-style';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css']
})
export class AppComponent implements AfterViewInit {
  public ngAfterViewInit() {
    var styleAddress = "https://raw.githubusercontent.com/IsraelHikingMap/VectorMap/master/Styles/il-MTB.json";

    var areas = new VectorTileLayer({
      source: new VectorTileSource({
        url: "https://cors-anywhere.herokuapp.com/http://31.154.215.180:8080/data/openmaptiles/{z}/{x}/{y}.pbf",
        format: new MVT(),
        maxZoom: 14
      }),
      declutter: true
    });

    var features = new VectorTileLayer({
      source: new VectorTileSource({
        url: "https://cors-anywhere.herokuapp.com/http://31.154.215.180:8080/data/openmaptiles/{z}/{x}/{y}.pbf",
        format: new MVT(),
        maxZoom: 14
      }),
      declutter: true
    });

    var hillShading = new TileLayer({
      source: new TileJSON({
        url: 'https://klokantech.tilehosting.com/data/hillshades.json?key=tXme5cuqgrCqdPoZHqyn',
        crossOrigin: 'anonymous'
      }),
      opacity: 0.5
    });

    var contours = new VectorTileLayer({
      source: new VectorTileSource({
        url: 'https://maps.tilehosting.com/data/contours/{z}/{x}/{y}.pbf?key=nVg9DfrAC6Re6fZF6k7k',
        format: new MVT(),
        maxZoom: 14
      })
    });
    
    var map = new Map({
      interactions: defaultInteractions().extend([
          new DragRotateAndZoom()
        ]),
	    layers: [],
      target: 'map',
      view: new View({
        center: [3922053.76073612, 3734120.9705496263],
        zoom: 16
      })
    });

    map.on("moveend", (e) => {console.log(e.map.getView().getCenter())});


    fetch(styleAddress).then((response) => {
    response.json().then((glStyle) => {
      applyBackground(map, glStyle);
      applyStyle(areas, glStyle, 'Areas-IHM').then(() => {
        map.addLayer(areas);
        map.addLayer(hillShading);
          applyStyle(contours, glStyle, 'contours').then(() => {
            map.addLayer(contours);
            applyStyle(features, glStyle, 'Features-IHM').then(() => {
              map.addLayer(features);
            });
          });
        });
      });
    });
  }
}



/* eslint-disable */
const mapboxgl = require('mapbox-gl');
require('mapbox-gl/dist/mapbox-gl.css');

const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW1yLWV6emF0IiwiYSI6ImNsYTQ1ZjVjYjB3eGczd21vbTE1cGhoNGcifQ.kF7J4A2IEjuvkg3SiQSfhA';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/amr-ezzat/cla49xazk001d14o4rbc17mon', // style URL
    scrollZoom: false,
    // center: [-118.113491, 34.111745], // starting position [lng, lat]
    // zoom: 9, // starting zoom
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker'; // from styles.css file.

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .setPopup(
        new mapboxgl.Popup({
          offset: 30,
        }).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      )
      .addTo(map);

    // Add popup
    // new mapboxgl.Popup({
    //   offset: 30,
    // })
    //   .setLngLat(loc.coordinates)
    //   .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    //   .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

module.exports = { displayMap };

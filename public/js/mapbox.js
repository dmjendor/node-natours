/* eslint-disable */
const mapElement = document.getElementById('map');

export const displayMap = (locations) => {
  if (mapElement) {
    const locations = JSON.parse(mapElement.dataset.locations);
    mapboxgl.accessToken = mapElement.dataset.mapboxToken;

    const geojson = {
      type: 'FeatureCollection',
      features: locations.map((location) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coordinates,
        },
        properties: {
          description: location.description,
          day: location.day,
        },
      })),
    };

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/dmjendor/cmmtdf0rn00ep01qt8r718qys',
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    geojson.features.forEach(function (marker) {
      var el = document.createElement('div');
      el.className = 'marker';

      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      new mapboxgl.Popup({
        offset: 30,
        closeOnClick: false,
      })
        .setLngLat(marker.geometry.coordinates)
        .setHTML(
          `<p>Day ${marker.properties.day}: ${marker.properties.description}</p>`
        )
        .addTo(map);

      bounds.extend(marker.geometry.coordinates);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 50,
        right: 50,
      },
    });

    map.on('load', function () {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: locations.map((location) => location.coordinates),
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#55c57a',
          'line-opacity': 0.6,
          'line-width': 3,
        },
      });
    });
  }
};

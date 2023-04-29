
export const displayMap = (locations) => {

  mapboxgl.accessToken = 'pk.eyJ1IjoiamFja3lqYWNreSIsImEiOiJjbGdrMG1yY2UwNDMwM3JsZnNnMmNjdm5nIn0.IEZ-GrppirMkAR8zVDb-UA';
    
  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
      // center: [...lng, lat],
      // zoom: 10,
      // interactive: false
    });

  // create map bounds object
  const bounds = new mapboxgl.LngLatBounds();

  // Create markers
  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    // Add markers
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
      
      // Extend map bounds to include currently location
      bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds);
};
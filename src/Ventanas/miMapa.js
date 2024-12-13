import React, { useEffect } from "react";
import SubirImagen from "../Componentes/subirImagen";

const MiMapa = () => {
  useEffect(() => {
    // Asegúrate de que OpenLayers esté disponible  
    if (window.OpenLayers) {
      const map = new window.OpenLayers.Map("mapdiv");
      map.addLayer(new window.OpenLayers.Layer.OSM());

      const lonLat = new window.OpenLayers.LonLat(-4.4780512, 36.7150865).transform(
        new window.OpenLayers.Projection("EPSG:4326"), // Transformar desde WGS 1984
        map.getProjectionObject() // A proyección esférica de Mercator
      );

      const markers = new window.OpenLayers.Layer.Markers("Markers");
      markers.addMarker(new window.OpenLayers.Marker(lonLat));

      map.addLayer(markers);

      const zoom = 16;
      map.setCenter(lonLat, zoom);
    }
  }, []); // [] asegura que el efecto sólo se ejecute al montar el componente

  return <div id="mapdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default MiMapa;

"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button, TextField, Stack } from "@mui/material";

// Fix marker icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon-2x.png") : "",
  iconUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon.png") : "",
  shadowUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-shadow.png") : "",
});

interface Props {
  onSave: (location: { name: string; lat: number; lng: number }) => void;
}

const LocationPicker: React.FC<Props> = ({ onSave }) => {
  const [markerPos, setMarkerPos] = useState<[number, number]>([31.9539, 35.9106]); // Default to Amman
  const [locationName, setLocationName] = useState("");

  // Detect current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("Auto-detected Latitude:", latitude);
          console.log("Auto-detected Longitude:", longitude);
          setMarkerPos([latitude, longitude]);

          // Reverse geocode to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            console.log("Reverse Geocode Result:", data);
            if (data.display_name) {
              setLocationName(data.display_name);
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
          }
        },
        () => {
          console.warn("User denied geolocation, using default position.");
        }
      );
    }
  }, []);

  // Prevent "map already initialized" on re-open
  useEffect(() => {
    const existing = document.getElementById("leaflet-map");
    if (existing && (existing as any)._leaflet_id) {
      (existing as any)._leaflet_id = null;
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarkerPos([e.latlng.lat, e.latlng.lng]);
        console.log("Marker moved to Latitude:", e.latlng.lat);
        console.log("Marker moved to Longitude:", e.latlng.lng);
      },
    });
    return null;
  };

  const handleSubmit = () => {
    if (!locationName) return;
    console.log("Saved Location Latitude:", markerPos[0]);
    console.log("Saved Location Longitude:", markerPos[1]);
    onSave({
      name: locationName,
      lat: markerPos[0],
      lng: markerPos[1],
    });
  };

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="Location Name"
        fullWidth
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />
      <div style={{ height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
        <MapContainer
          id="leaflet-map"
          center={markerPos}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler />
          <Marker position={markerPos} />
        </MapContainer>
      </div>
      <Button variant="contained" onClick={handleSubmit}>
        Save Location
      </Button>
    </Stack>
  );
};

export default LocationPicker;

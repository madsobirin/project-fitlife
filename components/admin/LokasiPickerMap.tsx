"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";

interface Props {
  lat: string;
  lng: string;
  onChange: (lat: string, lng: string, address?: string) => void;
  height?: string;
}

interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export default function LokasiPickerMap({ lat, lng, onChange, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Custom emerald pin icon
  const customIcon = L.divIcon({
    html: `<div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    className: "custom-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialLat = parseFloat(lat) || -6.2;
    const initialLng = parseFloat(lng) || 106.816;

    const map = L.map(containerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }).addTo(map);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Labels &copy; Esri',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Marker and Map View with external coordinates changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const currentLat = parseFloat(lat);
    const currentLng = parseFloat(lng);

    if (isNaN(currentLat) || isNaN(currentLng)) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    const latlng = L.latLng(currentLat, currentLng);

    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      markerRef.current = L.marker(latlng, {
        icon: customIcon,
        draggable: true,
      }).addTo(mapRef.current);

      // Handle dragend to update coordinates
      markerRef.current.on("dragend", async (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        const newLat = position.lat.toFixed(6);
        const newLng = position.lng.toFixed(6);
        
        // Fetch reverse geocode address
        const address = await reverseGeocode(position.lat, position.lng);
        onChange(newLat, newLng, address);
      });
    }

    // Keep map centered if change is external (e.g. from GPS button)
    const mapCenter = mapRef.current.getCenter();
    const isSignificantlyDifferent = 
      Math.abs(mapCenter.lat - currentLat) > 0.005 || 
      Math.abs(mapCenter.lng - currentLng) > 0.005;

    if (isSignificantlyDifferent) {
      mapRef.current.setView(latlng, 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, mapReady]);

  // Click on map to place/move marker and geocode
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      const formattedLat = clickLat.toFixed(6);
      const formattedLng = clickLng.toFixed(6);

      const address = await reverseGeocode(clickLat, clickLng);
      onChange(formattedLat, formattedLng, address);
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [mapReady, onChange]);

  // Reverse geocode helpers
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "Accept-Language": "id",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.display_name || "";
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return "";
  };

  // Search places using OSM Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=5&countrycodes=id`,
        {
          headers: {
            "Accept-Language": "id",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const selectedLat = parseFloat(result.lat);
    const selectedLng = parseFloat(result.lon);

    if (mapRef.current) {
      mapRef.current.setView([selectedLat, selectedLng], 16);
    }

    onChange(
      selectedLat.toFixed(6),
      selectedLng.toFixed(6),
      result.display_name
    );

    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  return (
    <div className="space-y-2 relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi di peta (contoh: Polindra)..."
            className="w-full px-3 py-2 pr-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-xs transition-all"
          />
          {searching && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
            </span>
          )}
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 bg-[#22c55e] text-white rounded-xl font-bold text-xs hover:bg-[#16a34a] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          Cari
        </button>
      </form>

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 z-[1000] bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto mt-1 divide-y divide-gray-50">
          {searchResults.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelectResult(result)}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-xs text-gray-700 transition-colors block truncate"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={containerRef} 
        className="w-full rounded-2xl overflow-hidden border border-gray-100 relative z-10"
        style={{ height: height || "220px", minHeight: height || "220px" }}
      />
      
      <p className="text-[10px] text-gray-400">
        Klik di peta atau seret pin untuk memindahkan posisi.
      </p>
    </div>
  );
}

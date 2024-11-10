import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useMemo, useCallback } from "react";
import "./MapView.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MapView = () => {
  // Initial view state configuration for the map
  const [viewState, setViewState] = useState({
    longitude: -8.6317803,
    latitude: 40.6419645,
    zoom: 18,
    pitch: 60,
  });

  // Tracks the current location index for navigation purposes
  const [currentIndex, setCurrentIndex] = useState(0);

  // Manages the current search query in the location input field
  const [searchQuery, setSearchQuery] = useState("");

  // Controls visibility of the dropdown list of filtered locations
  const [showDropdown, setShowDropdown] = useState(false);

  // Tracks the active index in the dropdown, highlighting selected items
  const [activeIndex, setActiveIndex] = useState(-1);

  // List of predefined locations with coordinates
  const locations: { [key: string]: { latitude: number; longitude: number } } =
    useMemo(
      () => ({
        Portugal: { latitude: 40.64199521504551, longitude: -8.63178967710328 },
        Spain: { latitude: 40.359607538579745, longitude: -3.6821318323286754 },
        Mozambique: {
          latitude: -25.952198177765005,
          longitude: 32.592926415365056,
        },
        Hogwarts: { latitude: 57.546979, longitude: -5.815523 },
        MonicasApartment: { latitude: 40.732306, longitude: -73.994218 },
        PortAventuraPark: { latitude: 41.086686, longitude: 1.154858 },
        SpainCasaDeMoeda: { latitude: 40.413774, longitude: -3.707398 },
      }),
      []
    );

  // List of location keys, derived from locations object
  const locationKeys: string[] = useMemo(
    () => Object.keys(locations),
    [locations]
  );

  // Changes the view state to the specified location by index
  const goToLocation = useCallback(
    (index: number) => {
      const locationKey = locationKeys[index];
      const location = locations[locationKey];
      if (location) {
        setViewState({
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 18,
          pitch: 60,
        });
        setCurrentIndex(index);
      }
    },
    [locations, locationKeys]
  );

  // Moves to the next location in the list
  const goToNextLocation = () => {
    if (currentIndex < locationKeys.length - 1) {
      goToLocation(currentIndex + 1);
    }
  };

  // Moves to the previous location in the list
  const goToPreviousLocation = () => {
    if (currentIndex > 0) {
      goToLocation(currentIndex - 1);
    }
  };

  // Handles search input changes, updates search query and dropdown visibility
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
    setActiveIndex(-1);
  };

  // Navigates to the selected location and closes the dropdown
  const handleLocationSelect = (key: string) => {
    const index = locationKeys.indexOf(key);
    goToLocation(index);
    setSearchQuery(key);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  // Filters locations based on the current search query
  const filteredLocations = useMemo(
    () =>
      locationKeys.filter((key) =>
        key.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, locationKeys]
  );

  // Handles keyboard navigation and selection within the dropdown
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (filteredLocations.length > 0) {
      if (event.key === "ArrowDown") {
        // Move selection down
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % filteredLocations.length
        );
      } else if (event.key === "ArrowUp") {
        // Move selection up
        setActiveIndex((prevIndex) =>
          prevIndex <= 0 ? filteredLocations.length - 1 : prevIndex - 1
        );
      } else if (event.key === "Enter") {
        // Select the active item
        if (activeIndex >= 0 && activeIndex < filteredLocations.length) {
          handleLocationSelect(filteredLocations[activeIndex]);
        }
      }
    }
  };

  return (
    <div className="mapDashboard">
      {/* Map container */}
      <div className="mapContainer">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          attributionControl={false}
          hash
          style={{ width: "calc(100vw - 120px)", height: "calc(100vh - 22px)" }}
          mapStyle="https://wms.wheregroup.com/tileserver/style/osm-liberty.json"
        >
          {/* Renders markers for each location */}
          {locationKeys.map((key) => {
            const { latitude, longitude } = locations[key];
            return (
              <Marker
                key={key}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <div className="markerIcon">📍</div>
                <div className="markerLabel">Wavecom {key}</div>
              </Marker>
            );
          })}
        </Map>
      </div>

      {/* Search input with dropdown for selecting locations */}
      <div className="selectContainer">
        <label htmlFor="locationSearch">Search Location: </label>
        <input
          type="text"
          id="locationSearch"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          placeholder="Type a location..."
        />
        {showDropdown && (
          <div className="dropdown">
            {/* Renders dropdown items for filtered locations */}
            {filteredLocations.map((key, index) => (
              <button
                key={key}
                className={`dropdownItem ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleLocationSelect(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLocationSelect(key);
                  }
                }}
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation buttons to cycle through locations */}
      <div className="navigationContainer">
        <button
          onClick={goToPreviousLocation}
          disabled={currentIndex === 0}
          title="Go to previous location"
        >
          <ArrowBackIcon
            className={currentIndex === 0 ? "disabled" : "backIcon"}
          />
        </button>
        <button
          onClick={goToNextLocation}
          disabled={currentIndex === locationKeys.length - 1}
          title="Go to next location"
        >
          <ArrowForwardIcon
            className={
              currentIndex === locationKeys.length - 1
                ? "disabled"
                : "forwardIcon"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default MapView;

import Map, { Marker, ViewStateChangeEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { memo, useState, useMemo, useCallback } from "react";
import "./MapView.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MapView = () => {
  const [viewState, setViewState] = useState({
    longitude: -8.6317803,
    latitude: 40.6419645,
    zoom: 18,
    pitch: 60,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const locations: { [key: string]: { latitude: number; longitude: number } } =
    useMemo(
      () => ({
        Portugal: { latitude: 40.64199521504551, longitude: -8.63178967710328 },
        Spain: { latitude: 40.359607538579745, longitude: -3.6821318323286754 },
        Mozambique: {
          latitude: -25.952198177765005,
          longitude: 32.592926415365056,
        },
      }),
      []
    );

  const locationKeys: string[] = useMemo(
    () => Object.keys(locations),
    [locations]
  );

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

  const goToNextLocation = () => {
    if (currentIndex < locationKeys.length - 1) {
      goToLocation(currentIndex + 1);
    }
  };

  const goToPreviousLocation = () => {
    if (currentIndex > 0) {
      goToLocation(currentIndex - 1);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowDropdown(true);
    setActiveIndex(-1);
  };

  const handleLocationSelect = (key: string) => {
    const index = locationKeys.indexOf(key);
    goToLocation(index);
    setSearchQuery(key);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const filteredLocations = useMemo(
    () =>
      locationKeys.filter((key) =>
        key.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, locationKeys]
  );

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (filteredLocations.length > 0) {
      if (event.key === "ArrowDown") {
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % filteredLocations.length
        );
      } else if (event.key === "ArrowUp") {
        setActiveIndex((prevIndex) =>
          prevIndex <= 0 ? filteredLocations.length - 1 : prevIndex - 1
        );
      } else if (event.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < filteredLocations.length) {
          handleLocationSelect(filteredLocations[activeIndex]);
        }
      }
    }
  };

  const handleMapMove = useCallback((evt: ViewStateChangeEvent) => {
    const next = evt.viewState;
    setViewState({
      longitude: next.longitude,
      latitude: next.latitude,
      zoom: next.zoom,
      pitch: next.pitch,
    });
  }, []);

  const markers = useMemo(
    () =>
      locationKeys.map((key) => {
        const { latitude, longitude } = locations[key];
        return (
          <Marker key={key} longitude={longitude} latitude={latitude} anchor="bottom">
            <div className="markerIcon">📍</div>
            <div className="markerLabel">Wavecom {key}</div>
          </Marker>
        );
      }),
    [locationKeys, locations]
  );

  return (
    <div className="mapDashboard">
      <div className="mapContainer">
        <Map
          {...viewState}
          onMove={handleMapMove}
          attributionControl={false}
          hash
          style={{ width: "calc(100vw - 120px)", height: "calc(100vh - 22px)" }}
          mapStyle="https://wms.wheregroup.com/tileserver/style/osm-liberty.json"
        >
          {markers}
        </Map>
      </div>

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

export default memo(MapView);

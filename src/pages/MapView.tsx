import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useMemo, useCallback } from "react";
import "./MapView.css";

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

  //WaveCom locations
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
  };

  const handleLocationSelect = (key: string) => {
    const index = locationKeys.indexOf(key);
    goToLocation(index);
    setSearchQuery(key);
    setShowDropdown(false);
  };

  const filteredLocations = useMemo(
    () =>
      locationKeys.filter((key) =>
        key.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, locationKeys]
  );

  return (
    <div className="mapDashboard">
      <div className="mapContainer">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          attributionControl={false}
          hash
          style={{ width: "calc(100vw - 120px)", height: "calc(100vh - 22px)" }}
          mapStyle="https://wms.wheregroup.com/tileserver/style/osm-liberty.json"
        >
          {locationKeys.map((key) => {
            const { latitude, longitude } = locations[key];
            return (
              <Marker
                key={key}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <div style={{ color: "red", fontSize: "24px" }}>📍</div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    marginTop: "5px",
                    textAlign: "center",
                  }}
                >
                  {key}
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>
      <div className="selectContainer">
        <div className="dropdownContainer">
          <label htmlFor="locationSearch">Search Location: </label>
          <input
            type="text"
            id="locationSearch"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Type a location..."
          />
          {showDropdown && (
            <div className="dropdown">
              {filteredLocations.map((key) => (
                <div
                  key={key}
                  className="dropdownItem"
                  onClick={() => handleLocationSelect(key)}
                >
                  {key}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="navigationContainer">
        <button onClick={goToPreviousLocation} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          onClick={goToNextLocation}
          disabled={currentIndex === locationKeys.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MapView;

import { useState, useEffect, useRef } from "react";

const ZONES = [
  { id: 1, name: "Riverside", lat: 45.7892, lng: 13.2156, unlocked: true, shared: true },
  { id: 2, name: "Old Town", lat: 45.7910, lng: 13.2180, unlocked: true, shared: false },
  { id: 3, name: "Market Square", lat: 45.7875, lng: 13.2140, unlocked: false, shared: false },
  { id: 4, name: "Park District", lat: 45.7920, lng: 13.2120, unlocked: false, shared: false },
  { id: 5, name: "Harbor Walk", lat: 45.7860, lng: 13.2170, unlocked: false, shared: false },
  { id: 6, name: "Cathedral Hill", lat: 45.7935, lng: 13.2195, unlocked: false, shared: false },
  { id: 7, name: "University Zone", lat: 45.7850, lng: 13.2130, unlocked: false, shared: false },
];

export default function Map({ userPlan }) {
  const mapRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const missionZone = ZONES.find(
    (z) => z.name === (userPlan?.missionZone || "Riverside")
  );

  useEffect(() => {
    // Obtiene ubicación real del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Si no hay permiso, usa ubicación por defecto (Friuli)
          setUserLocation({ lat: 45.7892, lng: 13.2156 });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initBuddyGoMap`;
    script.async = true;
    script.defer = true;

    window.initBuddyGoMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      });

      // Dibuja hexágonos por zona
      ZONES.forEach((zone) => {
        const hexPath = getHexPath(zone.lat, zone.lng, 0.003);
        const hex = new window.google.maps.Polygon({
          paths: hexPath,
          strokeColor: zone.unlocked ? "#E85D04" : "#9C8B70",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: zone.shared
            ? "#FFD166"
            : zone.unlocked
            ? "#E85D04"
            : "#D4C5B0",
          fillOpacity: zone.unlocked ? 0.35 : 0.15,
        });

        hex.setMap(map);
        hex.addListener("click", () => setSelectedZone(zone));

        // Pulso animado en la zona de misión activa
        if (missionZone && zone.id === missionZone.id) {
          const circle = new window.google.maps.Circle({
            center: { lat: zone.lat, lng: zone.lng },
            radius: 180,
            strokeColor: "#E85D04",
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: "#E85D04",
            fillOpacity: 0.08,
          });
          circle.setMap(map);
        }
      });

      // Marcador del usuario
      new window.google.maps.Marker({
        position: userLocation,
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#E85D04",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
        title: "You are here",
      });

      setMapLoaded(true);
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
      delete window.initBuddyGoMap;
    };
  }, [userLocation]);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Your city map</h2>
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {ZONES.filter((z) => z.unlocked).length}
            </span>
            <span style={styles.statLabel}>unlocked</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>{ZONES.length}</span>
            <span style={styles.statLabel}>total zones</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {ZONES.filter((z) => z.shared).length}
            </span>
            <span style={styles.statLabel}>with buddy</span>
          </div>
        </div>
      </div>

      {/* MISIÓN ACTIVA */}
      {missionZone && (
        <div style={styles.missionBanner}>
          <span style={styles.missionBannerIcon}>🎯</span>
          <div>
            <div style={styles.missionBannerLabel}>ACTIVE MISSION</div>
            <div style={styles.missionBannerName}>{userPlan?.missionTitle || "Explore the riverside"}</div>
            <div style={styles.missionBannerZone}>📍 {missionZone.name}</div>
          </div>
        </div>
      )}

      {/* MAPA */}
      <div style={styles.mapWrapper}>
        {!mapLoaded && (
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapPlaceholderIcon}>🗺️</div>
            <p style={styles.mapPlaceholderText}>Loading your city map...</p>
          </div>
        )}
        <div
          ref={mapRef}
          style={{
            ...styles.mapContainer,
            opacity: mapLoaded ? 1 : 0,
          }}
        />
      </div>

      {/* LEYENDA */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: "#E85D04" }} />
          <span style={styles.legendLabel}>Unlocked</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: "#FFD166" }} />
          <span style={styles.legendLabel}>Shared with buddy</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: "#D4C5B0" }} />
          <span style={styles.legendLabel}>Locked</span>
        </div>
      </div>

      {/* DETALLE DE ZONA SELECCIONADA */}
      {selectedZone && (
        <div style={styles.zoneDetail}>
          <div style={styles.zoneDetailHeader}>
            <div>
              <div style={styles.zoneDetailName}>{selectedZone.name}</div>
              <div style={styles.zoneDetailStatus}>
                {selectedZone.unlocked
                  ? selectedZone.shared
                    ? "🟡 Explored with buddy"
                    : "🟠 Explored"
                  : "🔒 Not yet explored"}
              </div>
            </div>
            <button
              style={styles.zoneDetailClose}
              onClick={() => setSelectedZone(null)}
            >
              ✕
            </button>
          </div>
          {!selectedZone.unlocked && (
            <p style={styles.zoneDetailHint}>
              Complete this week's mission to unlock this zone and earn +25 BP.
            </p>
          )}
          {selectedZone.id === missionZone?.id && (
            <div style={styles.zoneDetailMission}>
              🎯 This is your active mission zone
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Genera los 6 puntos de un hexágono dado un centro y radio
function getHexPath(lat, lng, size) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    points.push({
      lat: lat + size * Math.cos(angle),
      lng: lng + size * Math.sin(angle) * 1.5,
    });
  }
  return points;
}

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f0e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5c4a2a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
    paddingBottom: 24,
  },
  header: {
    padding: "24px 20px 16px",
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 12,
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: 800,
    color: "#E85D04",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: 11,
    color: "#9C8B70",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  statDivider: {
    width: 1,
    height: 28,
    background: "rgba(232,93,4,0.15)",
  },
  missionBanner: {
    margin: "0 16px 12px",
    background: "#1A3C2B",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  missionBannerIcon: { fontSize: 24, flexShrink: 0 },
  missionBannerLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#FFD166",
    marginBottom: 2,
  },
  missionBannerName: {
    fontSize: 14,
    fontWeight: 700,
    color: "white",
    marginBottom: 2,
  },
  missionBannerZone: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  mapWrapper: {
    margin: "0 16px",
    borderRadius: 16,
    overflow: "hidden",
    height: 340,
    position: "relative",
    border: "1px solid rgba(232,93,4,0.1)",
  },
  mapPlaceholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
  },
  mapPlaceholderIcon: { fontSize: 48, marginBottom: 12 },
  mapPlaceholderText: { fontSize: 14, color: "#9C8B70" },
  mapContainer: {
    width: "100%",
    height: "100%",
    transition: "opacity 0.5s ease",
  },
  legend: {
    display: "flex",
    gap: 16,
    padding: "12px 20px",
    justifyContent: "center",
  },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  legendLabel: { fontSize: 11, color: "#9C8B70" },
  zoneDetail: {
    margin: "0 16px",
    background: "white",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  zoneDetailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  zoneDetailName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: 4,
  },
  zoneDetailStatus: { fontSize: 13, color: "#5C4A2A" },
  zoneDetailClose: {
    background: "none",
    border: "none",
    fontSize: 16,
    color: "#9C8B70",
    cursor: "pointer",
    padding: 4,
  },
  zoneDetailHint: {
    fontSize: 13,
    color: "#5C4A2A",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  zoneDetailMission: {
    fontSize: 13,
    color: "#E85D04",
    fontWeight: 600,
  },
};

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import io from "socket.io-client";

// Use environment variable for backend API URL
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const socket = io(`${BASE_URL}`);


// Fix Leaflet marker issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Component to update map center dynamically
const UpdateMapCenter = ({ location }) => {
    const map = useMap();

    useEffect(() => {
        if (location) {
            console.log("Setting map center to:", location.latitude, location.longitude);
            map.setView([location.latitude, location.longitude], 15, { animate: true });
        }
    }, [location, map]);

    return null;
};

const RealtimeMap = ({ userId, username }) => {
    const [location, setLocation] = useState(null);
    const [nearbyUsers, setNearbyUsers] = useState([]);

    useEffect(() => {
        if (!userId) {
            console.log("Waiting for userId to be available...");
            return;
        }
        console.log("UserId available:", userId);

        if ("geolocation" in navigator) {
            const geoWatch = navigator.geolocation.watchPosition(
                async (position) => {
                    if (position.coords.accuracy > 50) {
                        console.log("Ignoring inaccurate position:", position.coords);
                        return;
                    }

                    const { latitude, longitude } = position.coords;
                    console.log("User location (accurate):", latitude, longitude);
                    setLocation({ latitude, longitude });

                    try {
                        await axios.post(`${BASE_URL}/api/location`, {
                            userId,
                            username,
                            latitude,
                            longitude,
                        });

                        socket.emit("updateLocation", { id: userId, username, latitude, longitude });
                    } catch (error) {
                        console.error("Error updating location:", error);
                    }
                },
                (error) => console.error("Geolocation error:", error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0, // Forces fresh location data
                }
            );

            return () => navigator.geolocation.clearWatch(geoWatch);
        }
    }, [userId, username]);

    useEffect(() => {
        const fetchNearbyUsers = async () => {
            if (!userId) return;

            try {
                console.log("Fetching nearby users for userId:", userId);
                const { data } = await axios.get(`${BASE_URL}/api/location/nearby`, {
                    params: { userId },
                    withCredentials: true,
                });

                console.log("Received nearby users:", data);
                setNearbyUsers(data);
            } catch (error) {
                console.error("Error fetching nearby users:", error);
            }
        };

        fetchNearbyUsers();
        const interval = setInterval(fetchNearbyUsers, 10000);

        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        socket.on("userLocationUpdated", (updatedUser) => {
            setNearbyUsers((prevUsers) => {
                const existingUser = prevUsers.find((user) => user.userId === updatedUser.userId);
                if (existingUser) {
                    return prevUsers.map((user) =>
                        user.userId === updatedUser.userId
                            ? { ...user, latitude: updatedUser.latitude, longitude: updatedUser.longitude }
                            : user
                    );
                } else {
                    return [...prevUsers, updatedUser];
                }
            });
        });

        return () => {
            socket.off("userLocationUpdated");
        };
    }, []);

    return (
        <div>
            <h3>Live Map</h3>
            <MapContainer
                center={location ? [location.latitude, location.longitude] : [28.7041, 77.1025]}
                zoom={14}
                style={{ width: "100%", height: "500px" }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution=' x Kampuss'
                />

                {location && <UpdateMapCenter location={location} />}

                {/* User's Marker */}
                {location && (
                    <Marker position={[location.latitude, location.longitude]} icon={defaultIcon}>
                        <Popup>You</Popup>
                    </Marker>
                )}

                {/* Nearby Users' Markers */}
                {nearbyUsers.map((user) => (
                    <Marker key={user.userId} position={[user.latitude, user.longitude]} icon={defaultIcon}>
                        <Popup>{user.username}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default RealtimeMap;

import React, { useEffect, useState } from "react";
import {
    GoogleMap,
    Marker,
    useJsApiLoader
} from "@react-google-maps/api";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const apiBase = "http://localhost:5000";

const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "14px"
};

const CustomerTrack = ({ orderId }) => {
    const [deliveryBoy, setDeliveryBoy] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "YOUR_GOOGLE_MAP_API_KEY"
    });

    const fetchTracking = async () => {
        const res = await fetch(`${apiBase}/api/orders/track/${orderId}`);
        const data = await res.json();
        if (data.success) {
            setDeliveryBoy(data.deliveryBoy);
        }
    };

    useEffect(() => {
        fetchTracking();

        const interval = setInterval(() => {
            fetchTracking(); // auto-refresh every 5 seconds
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Get customer location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCustomerLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            () => console.log("Customer location blocked")
        );
    }, []);

    if (!isLoaded) return <p>Loading Map...</p>;
    if (!deliveryBoy) return <p>Fetching live location...</p>;

    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>
                Track your Order
            </Typography>

            {/* MAP */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                    deliveryBoy.location || customerLocation || {
                        lat: 28.61,
                        lng: 77.23,
                    }
                }
                zoom={15}
            >
                {/* Delivery Boy Marker */}
                {deliveryBoy.location && (
                    <Marker
                        position={{
                            lat: deliveryBoy.location.lat,
                            lng: deliveryBoy.location.lng,
                        }}
                        icon={{
                            url: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                    />
                )}

                {/* Customer Marker */}
                {customerLocation && (
                    <Marker
                        position={customerLocation}
                        icon={{
                            url: "https://cdn-icons-png.flaticon.com/512/482/482059.png",
                            scaledSize: new window.google.maps.Size(38, 38),
                        }}
                    />
                )}
            </GoogleMap>

            {/* INFO CARD */}
            <Card sx={{ mt: 2, borderRadius: 3 }}>
                <CardContent>
                    <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                        Delivery Partner
                    </Typography>

                    <Typography sx={{ mt: 0.6, fontSize: 15 }}>
                        {deliveryBoy.name}
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        📞 {deliveryBoy.phone}
                    </Typography>

                    <Chip
                        label="On the way"
                        color="success"
                        sx={{ mt: 1, fontSize: 12 }}
                    />

                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<LocalShippingIcon />}
                            onClick={() =>
                                window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${deliveryBoy.location.lat},${deliveryBoy.location.lng}`,
                                    "_blank"
                                )
                            }
                        >
                            Direction
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<RoomIcon />}
                            onClick={() =>
                                window.location.href = `tel:${deliveryBoy.phone}`
                            }
                        >
                            Call
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CustomerTrack;

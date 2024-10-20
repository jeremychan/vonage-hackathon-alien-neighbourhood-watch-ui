import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import axios from 'axios';
import AlienSightingMap from './AlienSightingMap';

const AlienSightingForm = () => {
    const [alienType, setAlienType] = useState('');
    const [alienCount, setAlienCount] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    setSnackbar({
                        open: true,
                        message: `Error getting location: ${error.message}`,
                        severity: 'error'
                    });
                }
            );
        } else {
            setSnackbar({
                open: true,
                message: 'Geolocation is not supported by your browser.',
                severity: 'error'
            });
        }
    }, []);

    const handleMarkerDragEnd = (newPosition) => {
        setLocation(newPosition);
    };

    const handleSubmit = () => {
        if (!alienType || !alienCount || !location.latitude || !location.longitude) {
            setSnackbar({
                open: true,
                message: 'Please select alien type, count, and ensure location is fetched.',
                severity: 'warning'
            });
            return;
        }

        const data = {
            "type": alienType,
            "number": alienCount,
            "latitude": location.latitude,
            "longitude": location.longitude
        };

        axios.post('https://neru-15fde20f-sample-javasdk-spring-dev.euw1.runtime.vonage.cloud/sendAlienLocation', data)
            .then((response) => {
                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: 'Alien sighting has been broadcast to neighbors!',
                        severity: 'success'
                    });
                }
            })
            .catch((error) => {
                setSnackbar({
                    open: true,
                    message: 'Failed to report sighting. Please try again.',
                    severity: 'error'
                });
                console.error(error);
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                gap: 2,
                maxWidth: 500,
                margin: 'auto',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Alien Neighbourhood Watch
            </Typography>

            {/* Alien Type Buttons */}
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Button
                        variant={alienType === 'Type 1' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienType('Type 1')}
                    >
                        Type 1 👾
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant={alienType === 'Type 2' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienType('Type 2')}
                    >
                        Type 2 👽
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant={alienType === 'Type 3' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienType('Type 3')}
                    >
                        Type 3 🤖
                    </Button>
                </Grid>
            </Grid>

            {/* Alien Count Buttons */}
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Button
                        variant={alienCount === 'small' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienCount('small')}
                        sx={{ height: '56px' }}>
                        👥
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant={alienCount === 'medium' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienCount('medium')}
                        sx={{ height: '56px' }}>
                        👥👥👥
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant={alienCount === 'large' ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => setAlienCount('large')}
                        sx={{ height: '56px' }} >
                        👥👥👥👥👥👥👥👥👥👥
                    </Button>
                </Grid>
            </Grid>

            {/* Mini-map showing the user's current location */}
            {location.latitude && location.longitude ? (
                <AlienSightingMap
                    latitude={location.latitude}
                    longitude={location.longitude}
                    onMarkerDragEnd={handleMarkerDragEnd}
                />
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Fetching location...
                </Typography>
            )}

            {/* Submit Button */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<LocationOn />}
                onClick={handleSubmit}
                fullWidth
                sx={{ marginTop: 2 }}
            >
                Alert Neighbours
            </Button>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AlienSightingForm;
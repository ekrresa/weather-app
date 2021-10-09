import { toast } from 'react-hot-toast';

export const geoPosition = (
  position: GeolocationPosition,
  callback: (arg: any) => void
) => {
  const latitudeSign = position.coords.latitude < 0 ? '' : '+';
  const longitudeSign = position.coords.longitude < 0 ? '' : '+';

  callback({
    lat: latitudeSign + String(position.coords.latitude),
    long: longitudeSign + String(position.coords.longitude),
  });
};

export const geoPositionError = (error: GeolocationPositionError) => {
  if (error.code === 1 || error.code === 3) {
    toast.error(
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        Please enable your location and refresh the page to view weather details for it.
      </span>
    );
  }

  if (error.code === 0 || error.code === 2) {
    toast.error(
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        Unable to access your location. Please check your internet connection.
      </span>
    );
  }
};

import { useEffect, useState } from "react";

export const useLoadGoogleMaps = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);

  return loaded;
};

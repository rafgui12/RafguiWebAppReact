import { useEffect } from "react";
import { useLocation } from "react-router";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, "page_view", {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default AnalyticsTracker;

import React, {useState} from "react";

export const useMedia = (query) => {
    const [matches, setMatches] = useState(false);
    const [firstTime, setFirstTime] = useState(false);

    const runMedia = (x) => {
        if (x.matches) {
            setMatches(true);
        } else {
            setMatches(false);
        }
    };

    const media = window.matchMedia(query);
    media.addListener(runMedia);

    if (!firstTime) {
        runMedia(media);
        setFirstTime(true);
    }

    return {
        matches,
    };
};

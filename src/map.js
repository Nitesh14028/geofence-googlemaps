import React, { useEffect, useState } from "react";
import Spinner from "./spinner";
import { Box } from "@mui/material";
import LoadMap from "./loadmap";
import { apiKey } from "./helper";

const Map = (props) => {
  const { onSubmit, fences = [] } = props;
  const [googeMap, setGoogleMap] = useState();
  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`
    )
      .then((res) => res.text())
      .then((res) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = res;
        document.head.appendChild(script);
        setGoogleMap(window.google);
      });
  }, []);

  return (
    <Box width={"100%"}>
      {googeMap ? (
        <LoadMap googeMap={googeMap} onSubmit={onSubmit} fences={fences} />
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default Map;

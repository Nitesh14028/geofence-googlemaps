import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { mainContainer } from "./styles";
import { initializeButtons } from "./layout";
import { checkForUserLocation } from "./helper";

let mapOptions;
let map;
let google;
let drawingManager;

let shapesList = [];
let multiPolygon = [];
let selectedShape;

const initializeMap = (location = {}) => {
  const { lat, lng } = location;
  const center = new google.maps.LatLng(lat, lng);
  mapOptions = {
    zoom: 15,
    center,
    mapTypeId: google.maps.MapTypeId.RoadMap,
  };
  map = new google.maps.Map(
    document.getElementById("google-map-container"),
    mapOptions
  );
  shapesList = [];
  multiPolygon = [];
  selectedShape = null;
};

const showApprovedGeofence = (fences = []) => {
  fences.forEach((polygon) => {
    const userPolygon = new google.maps.Polygon({
      paths: polygon,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "blue",
      fillOpacity: 0.35,
    });
    userPolygon.setMap(map);
  });
};

const getPolygonCoordinate = function (newShape) {
  const newPolygon = [];
  const len = newShape.getPath().getLength();
  for (let i = 0; i < len; i++) {
    const lat = newShape.getPath().getAt(i).lat();
    const lng = newShape.getPath().getAt(i).lng();
    newPolygon.push({ lat, lng });
  }
  multiPolygon.push(newPolygon);
};

const initializeDrawingManager = () => {
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      clickable: true,
      draggable: true,
      editable: true,
      strokeWeight: 3,
      fillColor: "#ffff00",
      fillColor: "#ADFF2F",
      fillOpacity: 0.5,
      zIndex: 1,
    },
  });
  drawingManager.setMap(map);

  function clearSelection() {
    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape = null;
    }
  }

  function stopDrawing() {
    drawingManager.setMap(null);
  }

  function setSelection(shape) {
    clearSelection();
    stopDrawing();
    selectedShape = shape;
    shape && shape.setEditable(true);
  }

  google.maps.event.addListener(
    drawingManager,
    "polygoncomplete",
    function (event) {
      google.maps.event.addListener(
        event,
        "dragend",
        getPolygonCoordinate(event)
      );
    }
  );

  google.maps.event.addListener(
    drawingManager,
    "overlaycomplete",
    function (event) {
      if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        drawingManager.setDrawingMode(null);
        let newShape = event.overlay;
        newShape.type = event.type;
        setSelection(newShape);
      }
    }
  );
};

const isUserLocationUpdated = (prevLoc = {}, newLoc = {}) => {
  if (
    (prevLoc.lat && newLoc.lat && prevLoc.lat !== newLoc.lat) ||
    (prevLoc.lng && newLoc.lng && prevLoc.lng !== newLoc.lng)
  ) {
    return true;
  }
  return false;
};

const Map = (props) => {
  const [userLocation, updateUserLocation] = useState({
    lat: 28.620585,
    lng: 77.228609,
  });
  const setUserLocation = (newLocation) => {
    if (isUserLocationUpdated(userLocation, newLocation)) {
      updateUserLocation({ ...newLocation });
    }
  };

  const { googeMap, onSubmit, fences } = props;
  google = googeMap;

  const onClearClick = () => {
    if (selectedShape) {
      shapesList.forEach((shape) => shape.setMap(null));
      shapesList = [];
      multiPolygon = [];
      selectedShape.setMap(null);
    }
    drawingManager.setMap(map);
  };

  const onAddClick = () => {
    if (selectedShape) {
      shapesList.push(selectedShape);
      selectedShape.setEditable(false);
    }
    drawingManager.setMap(map);
  };

  const onSubmitClick = () => {
    showApprovedGeofence(multiPolygon);
    if (onSubmit) {
      onSubmit({ fences: multiPolygon });
    }
  };

  const buttonList = [
    { label: "Clear", onClick: onClearClick },
    { label: "Add", onClick: onAddClick },
    { label: "Submit", onClick: onSubmitClick },
  ];

  useEffect(() => {
    initializeMap(userLocation);
    initializeDrawingManager();
    initializeButtons(buttonList, map, google);
    showApprovedGeofence(fences);
    checkForUserLocation(setUserLocation);
  }, [userLocation]);

  return <Box id="google-map-container" sx={mainContainer}></Box>;
};

export default Map;

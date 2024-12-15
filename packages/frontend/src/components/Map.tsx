import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import Cluster from "ol/source/Cluster"; // Import the Cluster source

const MapComponent = ({ coordinates }) => {
	const mapRef = useRef();
	const [hoveredFeature, setHoveredFeature] = useState(null);

	useEffect(() => {
		const vectorSource = new VectorSource();
		const markerFeatures = [];

		coordinates.forEach(({ lat, lng, label }) => {
			const marker = new Feature({
				geometry: new Point(fromLonLat([lng, lat])),
				name: label || "No label provided",
			});

			marker.setStyle(
				new Style({
					image: new Icon({
						anchor: [0.5, 1],
						src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Custom icon URL
						scale: 0.1, // Adjust scale for better visibility
					}),
				})
			);

			vectorSource.addFeature(marker);
			markerFeatures.push(marker);
		});

		// Create a cluster source
		const clusterSource = new Cluster({
			distance: 40,
			source: vectorSource,
		});

		const vectorLayer = new VectorLayer({
			source: clusterSource,
			style: function (feature) {
				// Apply different styles for clusters and individual markers
				const size = feature.get("features")
					? feature.get("features").length
					: 1;
				if (size === 1) {
					// Return the custom icon for individual markers
					return new Style({
						image: new Icon({
							anchor: [0.5, 1],
							src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Custom icon URL
							scale: 0.1,
						}),
					});
				} else {
					// Optionally, apply a different style for clusters (e.g., a circle)
					return new Style({
						image: new Icon({
							anchor: [0.5, 1],
							src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Cluster icon, or you can apply a circle or another icon
							scale: 0.1, // Adjust scale for better visibility
						}),
					});
				}
			},
		});

		const map = new Map({
			target: mapRef.current,
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
				vectorLayer,
			],
			view: new View({
				center: fromLonLat([72.5714, 23.0225]),
				zoom: 6,
			}),
		});

		// Tooltip setup for displaying names
		const tooltip = new Overlay({
			element: document.createElement("div"),
			positioning: "bottom-center",
			offset: [0, -20],
		});

		map.addOverlay(tooltip);

		// Handle hover event for tooltips
		map.on("pointermove", (event) => {
			const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);

			if (feature) {
				const cluster = feature.get("features");
				if (cluster) {
					const names = cluster
						.map((f) => f.get("name"))
						.filter((name, index, self) => self.indexOf(name) === index) // Unique names
						.join(", ");
					tooltip.getElement().innerHTML = names;
					tooltip.setPosition(event.coordinate);
					tooltip.getElement().style.display = "block";
				}
			} else {
				tooltip.getElement().style.display = "none";
			}
		});

		return () => map.setTarget(null);
	}, [coordinates]);

	return (
		<div
			ref={mapRef}
			style={{ height: "50vh", width: "100%" }}
		/>
	);
};

export default MapComponent;

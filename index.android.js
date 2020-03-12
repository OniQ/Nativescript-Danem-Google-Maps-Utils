"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var ClusterItem = com.google.maps.android.clustering.ClusterItem;
var ClusterManager = com.google.maps.android.clustering.ClusterManager;
var DefaultClusterRenderer = com.google.maps.android.clustering.view.DefaultClusterRenderer;
let clusterManager = {};
let _mapView = {};
const imageSourceModule = require("tns-core-modules/image-source");
const Image = require('@nativescript/core/ui/image');

var CustomClusterItem = java.lang.Object.extend({
    interfaces: [ClusterItem],
    marker: null,
    init: function () { },
    getMarker: function () {
        return this.marker;
    },
    getPosition: function () {
        return this.marker.position.android;
    },
    getTitle: function () {
        return this.marker.title;
    },
    getSnippet: function () {
        return this.marker.snippet;
    },
});

function moveCamera(latitude, longitude) {
    try {
        var cameraUpdate = new com.google.android.gms.maps.CameraUpdateFactory.newLatLng(new com.google.android.gms.maps.model.LatLng(latitude, longitude))
        _mapView.gMap.animateCamera(cameraUpdate)
    } catch (e) {
        console.log(e)
    }
}
exports.moveCamera = moveCamera;

function clearMap() {
    _mapView.gMap.clear()
}
exports.clearMap = clearMap;

/*,
        OnClusterInfoWindowClickListener: function (clusterItem){

        }, 
        OnClusterItemInfoWindowClickListener: function (clusterItem){

        }, */

function setupMarkerCluster(mapView, markers, icon) {
    _mapView = mapView
    const CustomClusterRenderer = DefaultClusterRenderer.extend({
        init: function () { },
        onBeforeClusterItemRendered: function (item, markerOptions) {
            var mIcon = Image;
            mIcon.imageSource = imageSourceModule.fromResource(item.getMarker().infoWindowTemplate);
            var androidIcon = com.google.android.gms.maps.model.BitmapDescriptorFactory.fromBitmap(mIcon.imageSource.android);
            markerOptions.icon(androidIcon);
        }
    });
    clusterManager = new ClusterManager(utils.ad.getApplicationContext(), mapView.gMap);
    var renderer = new CustomClusterRenderer(utils.ad.getApplicationContext(), mapView.gMap, clusterManager);
    clusterManager.mapView = mapView;
    if (mapView.gMap.setOnCameraIdleListener) {
        mapView.gMap.setOnCameraIdleListener(clusterManager);
    }
    else if (mapView.gMap.setOnCameraChangeListener) {
        mapView.gMap.setOnCameraChangeListener(clusterManager);
    }
    clusterManager.setRenderer(renderer);
    mapView.gMap.setOnInfoWindowClickListener(clusterManager);
    mapView.gMap.setOnMarkerClickListener(clusterManager);
    clusterManager.setOnClusterItemClickListener(new ClusterManager.OnClusterItemClickListener({
        onClusterItemClick: function (gmsMarker) {
            var marker = mapView.findMarker(function (marker) {
                if (marker.android.getId) {
                    return marker.android.getId() === gmsMarker.getId();
                }
                return marker.title === gmsMarker.getTitle() && marker.snippet === gmsMarker.getSnippet() && marker.position.android.equals(gmsMarker.getPosition());
            });
            marker && mapView.notifyMarkerTapped(marker);
            return false;
        }
    }));
    markers.forEach(function (marker) {
        var markerItem = new CustomClusterItem();
        markerItem.marker = marker;
        clusterManager.addItem(markerItem);
        mapView._markers.push(marker);
    });
    clusterManager.cluster();
}
exports.setupMarkerCluster = setupMarkerCluster;

function setupHeatmap(mapView, positions, config) {
    /*
    */
}
exports.setupHeatmap = setupHeatmap;
//# sourceMappingURL=index.android.js.map
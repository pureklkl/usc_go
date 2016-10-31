'use strict';
/* eslint no-console: 0 */

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
	AppRegistry,
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView
} from 'react-native';
import {mapboxpk} from './mapboxkey';
import {Button, Icon} from 'native-base';
const accessToken = mapboxpk;
Mapbox.setAccessToken(accessToken);

export class MapExample extends Component {
	state = {
		center: {
			latitude: 34.0184288025,
			longitude: -118.2835159302
		},
		zoom: 11,
		userTrackingMode: Mapbox.userTrackingMode.none
	};

	onRegionDidChange = (location) => {
		this.setState({ currentZoom: location.zoomLevel });
		console.log('onRegionDidChange', location);
	};
	onRegionWillChange = (location) => {
		console.log('onRegionWillChange', location);
	};
	onUpdateUserLocation = (location) => {
		console.log('onUpdateUserLocation', location);
	};
	onOpenAnnotation = (annotation) => {
		console.log('onOpenAnnotation', annotation);
	};
	onRightAnnotationTapped = (e) => {
		console.log('onRightAnnotationTapped', e);
	};
	onLongPress = (location) => {
		console.log('onLongPress', location);
	};
	onTap = (location) => {
		console.log('onTap', location);
	};
	onChangeUserTrackingMode = (userTrackingMode) => {
		this.setState({ userTrackingMode });
		console.log('onChangeUserTrackingMode', userTrackingMode);
	};

	componentWillMount() {
		this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
			console.log('offline pack progress', progress);
		});
		this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
			console.log('offline max allowed tiles', tiles);
		});
		this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
			console.log('offline error', error);
		});
	}

	componentWillUnmount() {
		this._offlineProgressSubscription.remove();
		this._offlineMaxTilesSubscription.remove();
		this._offlineErrorSubscription.remove();
	}

	addNewMarkers = () => {
    // Treat annotations as immutable and create a new one instead of using .push()
    this.setState({
    	annotations: [ ...this.state.annotations, {
    		coordinates: [40.73312,-73.989],
    		type: 'point',
    		title: 'This is a new marker',
    		id: 'foo'
    	}, {
    		'coordinates': [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
    		'type': 'polygon',
    		'fillAlpha': 1,
    		'fillColor': '#000000',
    		'strokeAlpha': 1,
    		'id': 'new-black-polygon'
    	}]
    });
};

updateMarker2 = () => {
    // Treat annotations as immutable and use .map() instead of changing the array
    this.setState({
    	annotations: this.state.annotations.map(annotation => {
    		if (annotation.id !== 'marker2') { return annotation; }
    		return {
    			coordinates: [40.714541341726175,-74.00579452514648],
    			'type': 'point',
    			title: 'New Title!',
    			subtitle: 'New Subtitle',
    			annotationImage: {
    				source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
    				height: 25,
    				width: 25
    			},
    			id: 'marker2'
    		};
    	})
    });
};

removeMarker2 = () => {
	this.setState({
      //annotations: this.state.annotations.filter(a => a.id !== 'marker2')
  });
};

render() {
	StatusBar.setHidden(true);
	return (
		<View style={styles.container}>
		<MapView
		ref={map => { this._map = map; }}
		style={styles.map}
		initialCenterCoordinate={this.state.center}
		initialZoomLevel={this.state.zoom}
		initialDirection={0}
		rotateEnabled={true}
		scrollEnabled={true}
		zoomEnabled={true}
		showsUserLocation={false}
		styleURL={Mapbox.mapStyles.dark}
		userTrackingMode={this.state.userTrackingMode}
		annotations={this.state.annotations}
		annotationsAreImmutable
		onChangeUserTrackingMode={this.onChangeUserTrackingMode}
		onRegionDidChange={this.onRegionDidChange}
		onRegionWillChange={this.onRegionWillChange}
		onOpenAnnotation={this.onOpenAnnotation}
		onRightAnnotationTapped={this.onRightAnnotationTapped}
		onUpdateUserLocation={this.onUpdateUserLocation}
		onLongPress={this.onLongPress}
		onTap={this.onTap}
		/>

		<ScrollView style={styles.scrollView}>
		{this._renderButtons()}

		</ScrollView>

		
		</View>
		);
}

_renderButtons() {
	return (
		<View>
		<Button large transparent
		onPress={()=>
			this.map&&this._map.setCenterCoordinateZoomLevel(35.68829, 139.77492, 14)
		}>
		<Icon name='md-person'/>
		</Button>
		<Text onPress={() => this._map && this._map.setDirection(0)}>
		Set direction to 0
		</Text>
		<Text onPress={() => this._map && this._map.setZoomLevel(6)}>
		Zoom out to zoom level 6
		</Text>
		<Text onPress={() => this._map && this._map.setCenterCoordinate(48.8589, 2.3447)}>
		Go to Paris at current zoom level {parseInt(this.state.currentZoom)}
		</Text>
		<Text onPress={() => this._map && this._map.setCenterCoordinateZoomLevel(35.68829, 139.77492, 14)}>
		Go to Tokyo at fixed zoom level 14
		</Text>
		<Text onPress={() => this._map && this._map.easeTo({ pitch: 30 })}>
		Set pitch to 30 degrees
		</Text>
		
		</View>
		);
}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch'
	},
	map: {
		flex: 1
	},
	scrollView: {
		flex: 1
	}
});



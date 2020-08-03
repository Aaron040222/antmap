$("#areameasure_btn").click(function(){
	 areaMeasure.destory();
     areaMeasure.init();
  });

  $("#distanceMeasure_btn").click(function(){
	 distanceMeasure.destory();
     distanceMeasure.init();
  });

  $("#clear_btn").click(function(){
	 distanceMeasure.destory();
	 areaMeasure.destory();
  });

   var deleteIcon = L.icon({
          iconUrl: "shanchu.png",
          iconSize: [16, 16],
   });

  var areaMeasure = {
		points:[],
		color: "red",
		layers: L.layerGroup(),
		polygon: null,
		marker:null,
		init:function(){
			areaMeasure.points = [];
			areaMeasure.polygon = null;
			areaMeasure.marker = null;
			map.on('click', areaMeasure.click).on('dblclick', areaMeasure.dblclick);
		},
		close:function(latlng){
			areaMeasure.marker = L.marker(latlng, { icon: deleteIcon }).addTo(map).on("click", function (e) {
 				if(areaMeasure.polygon)
				   map.removeLayer(areaMeasure.polygon);

				if(areaMeasure.marker)
				  areaMeasure.marker.remove();
			});

		},
		click:function(e){    
			map.doubleClickZoom.disable();

			areaMeasure.points.push(e.latlng);

			map.on('mousemove', areaMeasure.mousemove);
		},
		mousemove:function(e){
			areaMeasure.points.push(e.latlng);
			if(areaMeasure.polygon)
				map.removeLayer(areaMeasure.polygon);
			areaMeasure.polygon = L.polygon(areaMeasure.points,{showMeasurements: true, color: 'red'});

			areaMeasure.polygon.addTo(areaMeasure.layers);
			areaMeasure.layers.addTo(map);
			areaMeasure.points.pop();
		},
		dblclick:function(e){
			console.log('doubleclick to end',e);
			areaMeasure.polygon.addTo(areaMeasure.layers);
			areaMeasure.close(e.latlng);

			map.off('click', areaMeasure.click).off('mousemove', areaMeasure.mousemove).off('dblclick', areaMeasure.dblclick);
		},
		destory:function(){	
			if(areaMeasure.polygon)
				   map.removeLayer(areaMeasure.polygon);

			if(areaMeasure.marker)
				  areaMeasure.marker.remove();
		}
	}


  var distanceMeasure = {
		points:[],

		color: "red",
		layers: L.layerGroup(),
		polyline: null,
		marker:null,
		init:function(){
			distanceMeasure.points = [];
			distanceMeasure.polyline = null;
			distanceMeasure.marker = null;
			map.on('click', distanceMeasure.click).on('dblclick', distanceMeasure.dblclick);
		},
		close:function(latlng){
			distanceMeasure.marker = L.marker(latlng, { icon: deleteIcon }).addTo(map).on("click", function (e) {

				if(distanceMeasure.polyline)
				   map.removeLayer(distanceMeasure.polyline);

				if(distanceMeasure.marker)
				  distanceMeasure.marker.remove();
			});


		},
		click:function(e){    
			map.doubleClickZoom.disable();

			distanceMeasure.points.push(e.latlng);

			map.on('mousemove', distanceMeasure.mousemove);
		},
		mousemove:function(e){
			distanceMeasure.points.push(e.latlng);
			if(distanceMeasure.polyline)
				map.removeLayer(distanceMeasure.polyline);
			distanceMeasure.polyline = L.polyline(distanceMeasure.points,{showMeasurements: true, color: 'red'});
			distanceMeasure.polyline.addTo(distanceMeasure.layers);
			distanceMeasure.layers.addTo(map);
			distanceMeasure.points.pop();
		},
		dblclick:function(e){ 
			console.log('doubleclick to end',e);
			distanceMeasure.polyline.addTo(distanceMeasure.layers);
			distanceMeasure.close(e.latlng);
			map.off('click', distanceMeasure.click).off('mousemove', distanceMeasure.mousemove).off('dblclick', distanceMeasure.dblclick);
		},
		destory:function(){	
			if(distanceMeasure.polyline)
				   map.removeLayer(distanceMeasure.polyline);

			if(distanceMeasure.marker)
				  distanceMeasure.marker.remove();
		}
	}

map.on('pm:drawstart', e => {
     if(geojsonLayer){
		 map.removeLayer(geojsonLayer);
		 geojsonLayer = null;
	 }
  });
  map.on('pm:create', e => {
	//console.log(e);
	geojsonLayer = e.layer;
	geojsonLayer.addTo(map);
	e.layer.unbindPopup();
	var elements = '<span>名称:</span><input type="text" id="estate_num" /></br><span>备注:</span><input type="text" id="holder_nam" /></br><button type="button" id="addBtn">新增</button>';
	e.layer.on('popupopen', function(e){
		$("#addBtn").click(function(){
		  if(geojsonLayer){
			  //构造polygon 
			  var polygon = '';
			  var data = geojsonLayer.toGeoJSON().geometry.coordinates[0];
			  for(var i=0;i<data.length;i++){
				  var item = data[i];
				  polygon += item[0] + ',' + item[1] + ' ' ;
			  }
			  polygon += data[0][0] + ',' + data[0][1];
			  addLayers(polygon,$("#estate_num").val(),$("#holder_nam").val(),callbackAddLayersWFSService);
		  }
		});		
	});
    e.layer.bindPopup(elements).openPopup(e.latlng);
  });
 
  /*图层新增
   *@method addLayers
   *@param polygon 图形
   *@param fieldValue1 字段1值
   *@param fieldValue2 字段2值
   *@return callback
   */
  function addLayers(polygon,fieldValue1,fieldValue2, callback){
	var xml = '<wfs:Transaction service="WFS" version="1.0.0"    xmlns:opengis="http://antmap.com"    xmlns:wfs="http://www.opengis.net/wfs"    xmlns:ogc="http://www.opengis.net/ogc"   xmlns:gml="http://www.opengis.net/gml"   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    xsi:schemaLocation="http://www.opengis.net/wfs   http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">';
    xml += '<wfs:Insert handle="Antmapgis">';
    xml += '<opengis:testLayer>';
    xml += '<opengis:the_geom>';
	xml += '<gml:MultiPolygon srsName="EPSG:4326">';
	xml += '<gml:polygonMember>'; 
	xml += '<gml:Polygon>';
    xml += '<gml:outerBoundaryIs>';
    xml += '<gml:LinearRing>';
    xml += '<gml:coordinates decimal="." cs="," ts=" ">' + polygon + '</gml:coordinates>';
    xml += '</gml:LinearRing>';
    xml += '</gml:outerBoundaryIs>';
    xml += '</gml:Polygon>';
	xml += '</gml:polygonMember>';
	xml += '</gml:MultiPolygon>';
    xml += '</opengis:the_geom>';
    xml += '<opengis:estate_num>' + fieldValue1 + '</opengis:estate_num>';
    xml += '<opengis:holder_nam>' + fieldValue2 + '</opengis:holder_nam>';
    xml += '</opengis:testLayer>';
    xml += '</wfs:Insert>';
    xml += '</wfs:Transaction>';
       

	$.ajax({
		url: geoserverUrl+'/wfs',
		async: true,
		data:xml,
		type:'Post',
		contentType: 'text/xml',
		success(result) {
			callback(result);
		},
		error(err) {
			console.log(err);
		}
	})
  }
  /*
   * 图层新增回调函数
   */
  function callbackAddLayersWFSService(data){
	 console.log('data',data);
	 //刷新图层
	 if(geojsonLayer){
		 map.removeLayer(geojsonLayer);
		 geojsonLayer = null;
	 }
	 wmsLayer.setParams({
		layers: 'Antmapgis:testLayer',
		transparent: true,
		maxZoom: 20,
		format: 'image/png'
	});
  }
  /*
   * 地图点击事件
   */
  function onClickMap(e){
    //console.log('地图点击事件',e);
	latlng = e.latlng;
	var point = e.latlng.lng+','+e.latlng.lat;
	queryByPoint(point,'testLayer',callbackLastQueryWFSService);
  }

  /*点查图层
   *@method queryByPoint
   *@param point 点查
   *@param typeName 图层名称
   *@return null
   */
  function queryByPoint(point, typeName, callback){
	var filter =
      '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">';
    filter += '<Intersects>';
    filter += '<PropertyName>the_geom</PropertyName>';
    filter += '<gml:Point>';
    filter += '<gml:coordinates>' + point + '</gml:coordinates>';
    filter += '</gml:Point>';
    filter += '</Intersects>';
    filter += '</Filter>';
    var urlString = geoserverUrl + '/ows';
    var param = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: typeName,
      outputFormat: 'application/json',
      filter: filter
    };
    var geojsonUrl = urlString + L.Util.getParamString(param, urlString);
	$.ajax({
		url: geojsonUrl,
		async: true,
		type:'GET',
		dataType: 'json',
		success(result) {
			callback(result);
		},
		error(err) {
			console.log(err);
		}
	})
  }
  /*
   * 点查图层回调函数
   */
  function callbackLastQueryWFSService(data){
	 console.log('data',data);
	 if (data && data.features.length > 0) {
		var properties = data.features[0].properties;
		var elements = '名称:'+properties.estate_num+'</br>备注:'+properties.holder_nam;
		map.openPopup(elements,latlng);
     }
  }

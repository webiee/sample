var _baseMapHost = "http://www.onemap.sg/ArcGIS/rest/services/";
var _baseMapURL = _baseMapHost + "basemap/MapServer";
var tileHost1 = "http://t1.onemap.sg/ArcGIS/rest/services/"
var tileHost2 = "http://t2.onemap.sg/ArcGIS/rest/services/"
var _baseMapURL1;
var _baseMapURL2;
var _Map, _ArcGISDynamicMapServiceLayer, _TiledMapServiceLayer, _SpatialReference, _Extent, _TileInfo, _GraphicsLayer, _ArcGISTiledMapServiceLayer, _PictureMarkerSymbol,
    _Point, _Graphic, _SimpleLineSymbol, _SimpleFillSymbol, _SimpleMarkerSymbol, _Polyline, _Polygon, _GeometryService, _InfoTemplate, _QueryTask, _Query, _Draw, _Navigation, _esriConfig, _Ready, _Multipoint, _BufferParameters;
function GetOneMap(divName, baseMap, optionalProps) {
  init();
    var i = 1;
    try { var center = optionalProps.center; } catch (err) { }
    try { var level = optionalProps.level; } catch (err) { }
    try { var layer = optionalProps.layer; } catch (err) { }

    if (baseMap.toUpperCase() == "SM") {
        _baseMapURL = _baseMapHost + "basemap" + "/MapServer";
        _baseMapURL1 = tileHost1 + "basemap" + "/MapServer";
        _baseMapURL2 = tileHost2 + "basemap" + "/MapServer";
    }
    else if (baseMap.toUpperCase() == "LL") {
        _baseMapURL = _baseMapHost + "LOT_VIEW" + "/MapServer";
        _baseMapURL1 = tileHost1 + "LOT_VIEW" + "/MapServer";
        _baseMapURL2 = tileHost2 + "LOT_VIEW" + "/MapServer";
    }
    else if (baseMap.toUpperCase() == "MND") {
        _baseMapURL = _baseMapHost + "MND_Towncouncil" + "/MapServer";
        _baseMapURL1 = tileHost1 + "MND_Towncouncil" + "/MapServer";
        _baseMapURL2 = tileHost2 + "MND_Towncouncil" + "/MapServer";
    }
    else {
        _baseMapURL = _baseMapHost + baseMap + "/MapServer";
        _baseMapURL1 = tileHost1 + baseMap + "/MapServer";
        _baseMapURL2 = tileHost2 + baseMap + "/MapServer";
    }

    NewOneMap = this;
    _OneMapDiv = divName;
	var tileFormat="JPEG";
	var imageFormat="jpg";
	
		if (baseMap.toUpperCase() == "MND") {
		  tileFormat="PNG32";
		  imageFormat="png";
		  }



    NewOneMap.Ready = _Ready;
        
    dojo.addOnLoad(function () {
        
        var OneMap3;
        var startExtent = getExtentForLevelnCenter(center, level)
        var OneMap3 = new _Map(_OneMapDiv, { extent: startExtent, logo: false, 
            sliderStyle: "large"
        });


        ////////////////added to get tiles from AWS//////////////////

        dojo.declare("OM.CustomTileServiceLayer", _TiledMapServiceLayer, {
            constructor: function () {
                this.spatialReference = new _SpatialReference({ wkid: 3414 });
                this.initialExtent = (this.fullExtent = new _Extent(-4589.0529981345, 8065.64251572593, 96370.1129604966, 57234.9694430107, this.spatialReference));
                this.tileInfo = new _TileInfo({
                    "rows": 256,
                    "cols": 256,
                    "dpi": 96,
                    "format": tileFormat,
                    "origin": {
                        "x": -5878011.89743302,
                        "y": 10172511.897433
                    },
                    "spatialReference": {
                        "wkid": 3414
                    },
                    "lods": [
                          { "level": 0, "resolution": 76.4372195411057, "scale": 288896 },
                          { "level": 1, "resolution": 38.2186097705529, "scale": 144448 },
                          { "level": 2, "resolution": 19.1093048852764, "scale": 72224 },
                          { "level": 3, "resolution": 9.55465244263822, "scale": 36112 },
                          { "level": 4, "resolution": 4.77732622131911, "scale": 18056 },
                          { "level": 5, "resolution": 2.38866311065955, "scale": 9028 },
                          { "level": 6, "resolution": 1.19433155532978, "scale": 4514 },
                          { "level": 7, "resolution": 0.597165777664889, "scale": 2257 },
                          { "level": 8, "resolution": 0.298450596901194, "scale": 1128 }
                        ]
                });

                this.loaded = true;
                this.onLoad(this);
            },

            getTileUrl: function (level, row, col) {
                //var URL = "";
                if (baseMap.toUpperCase() == "SM") {
                    var URL = "http://e1.onemap.sg/basemap/Layers/_alllayers/";
                }
                else if (baseMap.toUpperCase() == "MND") {
                    var URL = "http://e1.onemap.sg/MND_Towncouncil/Layers/_alllayers/";
                }

                return URL +
                            "L" + dojo.string.pad(level, 2, '0') + "/" +
                            "R" + dojo.string.pad(row.toString(16), 8, '0') + "/" +
                            "C" + dojo.string.pad(col.toString(16), 8, '0') + "." +
                            imageFormat;
            }
        });
        ////////////////added to get tiles from AWS/////////////////////////////

        if (baseMap.toUpperCase() == "SM" || baseMap.toUpperCase() == "MND"  ) {
            OneMap3.addLayer(new OM.CustomTileServiceLayer());
        }
        else {
			var tiledMapServiceLayer = new _ArcGISTiledMapServiceLayer(_baseMapURL, { tileServers: [_baseMapURL1, _baseMapURL2] });
            OneMap3.addLayer(tiledMapServiceLayer);
            //TiledMapServiceLayer
        }
        ////////////////added to get tiles from AWS/////////////////////////////

        //OneMap3.addLayer(tiledMapServiceLayer);

        XYGraphicsLayer = new _GraphicsLayer();

        if ((layer != undefined) || (layer != null))
            OneMap3.addLayer(layer);
        NewOneMap.map = OneMap3;

        //custom methods
        NewOneMap.showLocation = showLocation;
        NewOneMap.mashupTheme = mashupTheme;
        NewOneMap.overlayKML = overlayKML;
        NewOneMap.clearGraphics = clearGraphics;
        NewOneMap.GetMultipleInfo = GetMultipleInfo;
        NewOneMap.onOneMapExtentChange = extentChangeAction;


        //Added by Rabindar
        //Exposing ESRI modules to onemap object
        NewOneMap.GraphicsLayer = _GraphicsLayer;
        NewOneMap.TiledMapServiceLayer = _TiledMapServiceLayer;
        NewOneMap.SpatialReference = _SpatialReference;
        NewOneMap.Extent = _Extent;
        NewOneMap.TileInfo = _TileInfo;
        NewOneMap.GraphicsLayer = _GraphicsLayer;
        NewOneMap.ArcGISTiledMapServiceLayer = _ArcGISTiledMapServiceLayer;
        NewOneMap.PictureMarkerSymbol = _PictureMarkerSymbol;
        NewOneMap.Point = _Point;
        NewOneMap.Graphic = _Graphic;
        NewOneMap.SimpleLineSymbol = _SimpleLineSymbol;
        NewOneMap.SimpleFillSymbol = _SimpleFillSymbol;
        NewOneMap.Polyline = _Polyline;
        NewOneMap.Polygon = _Polygon;
        NewOneMap.GeometryService = _GeometryService;
        NewOneMap.InfoTemplate = _InfoTemplate;
        NewOneMap.QueryTask = _QueryTask;
        NewOneMap.Query = _Query;
        NewOneMap.SimpleMarkerSymbol = _SimpleMarkerSymbol;
        NewOneMap.ArcGISDynamicMapServiceLayer = _ArcGISDynamicMapServiceLayer;
        NewOneMap.Draw = _Draw;
        NewOneMap.Navigation = _Navigation;
        NewOneMap.BufferParameters = _BufferParameters

        //dojo.connect(OneMap3, "onLoad", function() {

       

        var t = $('#' + OneMap3.id + '_root').position().top;
        var l = $('#' + OneMap3.id + '_root').position().left;
        var ht = parseInt(document.getElementById(OneMap3.id).style.height.replace('px', ''))
       
        // });
    }); //Dojo onLoad


}
function init() {
    ////esri/tasks/QueryTask
    require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/TiledMapServiceLayer",
        "esri/SpatialReference", "esri/geometry/Extent", "esri/layers/TileInfo", "esri/layers/GraphicsLayer",
        "esri/layers/ArcGISTiledMapServiceLayer", "esri/symbols/PictureMarkerSymbol", "esri/geometry/Point",
        "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/tasks/GeometryService", "esri/InfoTemplate",
        "esri/tasks/QueryTask", "esri/tasks/query", "esri/toolbars/draw", "esri/toolbars/navigation", "esri/config", "esri/geometry/Multipoint", "esri/tasks/BufferParameters", "dojo/domReady!"],
        function (Map, ArcGISDynamicMapServiceLayer, TiledMapServiceLayer, SpatialReference,Extent, TileInfo, GraphicsLayer, ArcGISTiledMapServiceLayer,
            PictureMarkerSymbol, Point, Graphic, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Polyline, Polygon,
            GeometryService, InfoTemplate, QueryTask, Query, Draw, Navigation, esriConfig, Multipoint, BufferParameters, Ready) {
            //Added by Rabindar
            _Map = Map;
            _ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
            _TiledMapServiceLayer = TiledMapServiceLayer;
            _SpatialReference = SpatialReference;
            _Extent = Extent;
            _TileInfo = TileInfo;
            _GraphicsLayer = GraphicsLayer;
            _ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
            _PictureMarkerSymbol = PictureMarkerSymbol;
            _Point = Point;
            _Graphic = Graphic;
            _SimpleLineSymbol = SimpleLineSymbol;
            _SimpleFillSymbol = SimpleFillSymbol;
            _SimpleMarkerSymbol = SimpleMarkerSymbol;
            _Polyline = Polyline;
            _Polygon = Polygon;
            _GeometryService = GeometryService;
            _InfoTemplate = InfoTemplate;
            _QueryTask = QueryTask;
            _Query = Query;
            _Draw = Draw;
            _Ready = Ready;
            _Navigation = Navigation;
            _Multipoint = Multipoint;
            _BufferParameters = BufferParameters;
        });     // End requires
}
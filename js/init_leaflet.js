var geoJsonObject;

$(document).ready(function() {

    // Create the D3 map on leaflet
    map = new L.Map('mapcanvas', {
        attributionControl: false,
        minZoom: 7.5
    });

    var winwidth = parseInt(d3.select('#mapcanvas').style('width'))

    var osm = new L.TileLayer('');
    map.setView(new L.LatLng(40.058, -74.4057), 7.5);
    map.addLayer(osm);
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");


    // The tooltip
    var div = d3.select("#mapcanvas").append("div")
        .attr("class", "tooltip")
        .html("<h3>Loading...</h3>")
        .style("top", "0px")
        .style("left", winwidth - 180 + "px")




    // Queue up the json and csv files
    queue()
        .defer(d3.json, "js/nj_munis.json")
        .defer(d3.csv, "data/njelection_results.csv")
        .await(makemap);




    // Run function to create map   
    function makemap(error, us, data) {

        var prez_dem = {};
        var prez_rep = {};
        var others = {};

        var muni_code = {};

        var town_name = {};

        var dem_per = {};

        var rep_per = {};
        var others_per = {};
        var margin_vic = {};
        var the_winner = {};

        var total_votes = {};



        data.forEach(function(d) {

            prez_dem[d.MUNI_CODE] = +d.prez_dem;
            dem_per[d.MUNI_CODE] = +d.prez_dem_per;
            prez_rep[d.MUNI_CODE] = +d.prez_rep;
            rep_per[d.MUNI_CODE] = +d.prez_rep_per;
            others[d.MUNI_CODE] = +d.others_total;
            others_per[d.MUNI_CODE] = +d.others_per;
            margin_vic[d.MUNI_CODE] = +d.margin_victory;
            the_winner[d.MUNI_CODE] = d.winner;
            muni_code[d.MUNI_CODE] = d.MUNI_CODE;
            town_name[d.MUNI_CODE] = d.Municipality;
            total_votes[d.MUNI_CODE] = d.total_votes;




        });

        //Create the legend
        var legend_width = 250,
            divisions = 8;


        var svgleg = d3.select("#legend").append("svg")
        var legend = svgleg.append("g").attr("transform", "translate(5,25)")


        var EqualColor = "#f7f7f7",
            TrumpColorMax = "#a50f15",
            ClintonColorMax = "#08519c";
        PercentMax = 55;

        // Create the color scales for both map and legend
        var TrumpColor = d3.scale.linear()
            .range([EqualColor, TrumpColorMax])
            .domain([0, PercentMax])
            .interpolate(d3.interpolateLab);
        var ClintonColor = d3.scale.linear()
            .range([EqualColor, ClintonColorMax])
            .domain([0, PercentMax])
            .interpolate(d3.interpolateLab);

        var fakeData = [];
        var rectWidth = Math.floor(legend_width / divisions);


        for (var i = 0; i < legend_width / 2; i += rectWidth) {
            fakeData.push(i);
        }


        var TrumpScaleLegend = d3.scale.linear()
            .domain([0, fakeData.length - 1])
            .interpolate(d3.interpolateLab)
            .range([EqualColor, TrumpColorMax]);
        var ClintonScaleLegend = d3.scale.linear()
            .domain([fakeData.length - 1, 0])
            .interpolate(d3.interpolateLab)
            .range([EqualColor, ClintonColorMax]);

        var TrumpLegend = legend.append("g").attr("class", "TrumpLegend").attr("transform", "translate(" + (legend_width / 2) + ",0)");
        var ClintonLegend = legend.append("g").attr("class", "ClintonLegend");



        TrumpLegend.selectAll("rect")
            .data(fakeData)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return d;
            })
            .attr("y", 10)
            .attr("height", 10)
            .attr("width", rectWidth)
            .attr("fill", function(d, i) {
                return TrumpScaleLegend(i)
            });

        ClintonLegend.selectAll("rect")
            .data(fakeData)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return d;
            })
            .attr("y", 10)
            .attr("height", 10)
            .attr("width", rectWidth)
            .attr("fill", function(d, i) {
                return ClintonScaleLegend(i)
            });

        legend.append("text").text("MARGIN OF VICTORY").attr("transform", "translate(" + legend_width / 3 + ",60)").style('font-weight', 'bold');
        legend.append("text").text("CLINTON").attr("transform", "translate(" + (0) + ",0)");
        legend.append("text").text("TRUMP").attr("transform", "translate(" + (legend_width - 15) + ",0)");
        legend.append("text").text(function() {
            return "0%";
        }).attr("transform", "translate(" + (legend_width / 2) + ",35)");
        legend.append("text").text(function() {
            return "+" + (PercentMax * 1).toFixed(0) + "%";
        }).attr("transform", "translate(0,35)");
        legend.append("text").text(function() {
            return "+" + (PercentMax * 1).toFixed(0) + "%";
        }).attr("transform", "translate(" + (legend_width) + ",35)");




        //Remove the hourglass animation
        $(".waiting").remove();




        //Call in the shapefile
        collection = topojson.feature(us, us.objects.nj_munis)


        var transform = d3.geo.transform({
                point: projectPoint
            }),
            path = d3.geo.path().projection(transform);
        path2 = d3.geo.path().projection(transform);
        var feature = g.selectAll("path")
            .data(collection.features)
            .enter().append("path")
            .attr('class', 'njmunis')
            .attr('id', function(d) {
                return d.properties.mun_code;
            })
            .attr('d', path)
            .on("mouseover", mousemove)
            .on("mousemove", mousemove)
            .on("click", mousemove)
            .on("mouseout", function(d) {

                feature.style({
                    'stroke-opacity': 0.6,
                    'stroke': '#BA6227',
                    "stroke-width": 0.3
                });
                div.style("opacity", 0)
            });




        // Reset the map when panning and zooming
        map.on("viewreset", reset);
        reset();

        function reset() {
            var bounds = path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];
            svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");
            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
            feature.attr("d", path);
        }

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }



        // Add the default loading tooltip

        div.html("<h3>Hover over for more info</h3>")



        // Change the color based on winners and votes
        feature.style("fill", function(d) {


                if (the_winner[d.id] == 'prez_rep' && margin_vic[d.id] != 0) {
                    return TrumpColor(margin_vic[d.id])

                } else if (the_winner[d.id] == 'prez_dem' && margin_vic[d.id] != 0) {

                    return ClintonColor(margin_vic[d.id])

                } else if (the_winner[d.id] == 'tie' && margin_vic[d.id] == 0) {



                    return "#FFF";
                } else if (the_winner[d.id] == 'none') {



                    return "#333";
                }

            })
            .style("stroke", "#AD5113")
            .style("stroke-opacity", 0.6)
            .style("stroke-width", 0.3)
            .style("fill-opacity", 0.88)


        function mousemove(d) {

            feature.style({
                'stroke-opacity': 0.6,
                'stroke': '#AD5113',
                "stroke-width": 0.3
            })



            d3.select(this.parentNode.appendChild(this))
                .style({
                    'stroke-opacity': 1,
                    'stroke': '#5C5C5C',
                    "stroke-width": 1.5
                });
            div.style("opacity", .95)
                .style("left", (mobileoffset(d3.event.pageX) + 10) + "px")
                .style("z-index", 1400)
                .style("top", (d3.event.pageY) + "px")
                .html("<h2 class='" + the_winner[d.id] + "'>" + town_name[d.id] + "</h2><div id='infobox'><table class='muni_elex'><tr><th></th><th></th><th></th></tr><tr><td class='name clinton'>CLINTON</td><td>" + dem_per[d.id].toFixed(1) + "%</td><td>" + prez_dem[d.id].toLocaleString() + " votes</td></tr><tr><td class='name trump'>TRUMP</td><td class='trump'>" + rep_per[d.id].toFixed(1) + "%</td><td class='trump'>" + prez_rep[d.id].toLocaleString() + " votes</td></tr><tr><td class='name others'>OTHERS</td><td>" + others_per[d.id].toFixed(1) + "%</td><td>" + others[d.id].toLocaleString() + " votes</td></tr></table>")




            function mobileoffset(d) {

                var xoff = winwidth - d;
                var xper = xoff / winwidth;



                if (winwidth < 400 && xper < 0.55) {

                    return d - winwidth / 2;
                } else {
                    return d;
                }

            }




            if (the_winner[d.id] == 'prez_rep') {
                div.selectAll(".name").filter('.trump')
                    .html("TRUMP &#10003;")
                    .style({
                        'color': '#67000d'
                    })
            } else if (the_winner[d.id] == 'prez_dem' && margin_vic[d.id] != 0) {

                div.selectAll(".name").filter('.clinton')
                    .html("CLINTON &#10003;")
                    .style({
                        'color': '#08306b'
                    })

            } else if (the_winner[d.id] == 'tie' && margin_vic[d.id] == 0) {


            }



        }




    }

    var pymChild = new pym.Child();




});
var peers = [];
function peerToGroup(name) {
    if($.inArray(name,peers) === -1) {
        peers.push(name);
    }
    return $.inArray(name,peers);
}
function thrukFormatToForceGraph(d) {
    var r = {"nodes":[],"links":[]};
    for(var x=0; x < d.length; ++x){
        r.nodes.push({"id":d[x].host_name,"group": peerToGroup(d[x].peer_name)});
        for(var parent in d[x].parents) {
            r.links.push({"source": d[x].host_name, "target": d[x].parents[parent], "value": 1});
        }
    }
    return r;
}

$(document).ready(function() {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    $.ajax({
        url: "data.json",
        data: {},
        success: function(data) {

            var graph = thrukFormatToForceGraph(data);

            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                    .attr("r", 5)
                    .attr("fill", function(d) { return color(d.group); })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended))
                    .on('mouseover', function(d) {

                        var html = [];
                        html.push($("<div/>").text(d.id));
                        html.push(
                            $("<div/>").text(peers[d.group])
                            .css("color", color(d.group))
                        );

                        $("#detailview").html(html);
                    });

            node.append("title")
                .text(function(d) { return d.id; });

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked)

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            }
        },
        dataType: "json"
    });
})

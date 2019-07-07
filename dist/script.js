var width = 1060;
var height = 900;

const svg = d3
  .select("#graph")
  .append("svg")
  .attr("class", "svg")
  .attr("width", width)
  .attr("height", height);

const chart = svg.append("g").attr("class", "links");

d3.json(
  "https://raw.githubusercontent.com/ellacodecamp/contiguity/master/countries.json",
  (err, data) => {
    if (err) {
      console.log(err);
    }

    var nodes = data.nodes;
    var links = data.links;

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");

    var simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width/2, height/2))    
            .force("x", d3.forceX(width/2))
      .force("y", d3.forceY(height/2))
               .force("link", d3.forceLink(links).distance(50))
               .on("tick", ticked);

    function mouseOverHandler(d) {
      tooltip.style("opacity", 1);
      tooltip
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + "px")
        .html("<p>" + d.country + "</p>");
    }

    function mouseOutHandler() {
      tooltip.style("opacity", 0);
    }
    var link = chart
        .append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "white")
        .attr("stroke-width", "1px");

      var node = d3
        .select(".nodes")        
        .selectAll("img")
        .data(nodes)
        .enter()
        .append("img");
      
      node
        .attr("class", function(d) {
          return "flag flag-" + d.code;
        })
        .on("mouseover", mouseOverHandler)
        .on("mouseout", mouseOutHandler)
        .call(d3.drag()
                .on("start",dragStarted)
                .on("drag",dragging)
                .on("end",dragEnded))
     
      function dragStarted(d){
        if(!d3.event.active)
          simulation.alphaTarget(0.2).restart()
        d.fx=d.x;
        d.fy=d.y;
        console.log(d.fx,d.fy)
      }
    
     function dragging(d){
       d.fx=d3.event.x;
       d.fy=d3.event.y;
     }
           
    function dragEnded(d){
      if(!d3.event.active)
        simulation.alphaTarget(0);
      d.fx=null;
        d.fy=null;
    }
              
              
    function ticked() {
      link
        .attr("x1", d => {
          return d.source.x;
        })
        .attr("y1", d => {
          return d.source.y;
        })
        .attr("x2", d => {
          return d.target.x;
        })
        .attr("y2", d => {
          return d.target.y;
        });

      node
        .style("left", d => {
          return d.x + "px";
        })
        .style("top", d => {
          return d.y + "px";
        });
    }
  }
);
// app.js
const input = document.getElementById('input');
const parseButton = document.getElementById('parse');
const output = document.getElementById('output');
const toggleInputButton = document.getElementById('toggle-input');
const inputContainer = document.getElementById('input-container');


parseButton.addEventListener('click', () => {
  try {
    // Parse the OWL input into a graph data structure
    const graph = parseOwl(input.value);

    // Render the graph using D3
    renderGraph(graph);
  } catch (error) {
    console.error(error);
    alert(`An error occurred while parsing the OWL input: ${error.message}. See the console for details.`);
  }
});

toggleInputButton.addEventListener('click', () => {
  inputContainer.classList.toggle('hidden');
});

/*function parseOwl(input) {
  // Parse the OWL input into an RDF graph
  const store = rdfExt.default.dataset();
  rdfExt.default.parse(input, { baseIRI: 'http://example.org/ontology#' }, store);

  // Convert the RDF graph into a graph data structure
  const graph = { nodes: [], edges: [] };
  store.forEach((quad) => {
    // Add a node for each subject and object
    const subjectNode = { id: quad.subject.value, label: quad.subject.value };
    const objectNode = { id: quad.object.value, label: quad.object.value };
    graph.nodes.push(subjectNode);
    graph.nodes.push(objectNode);

    // Add an edge for each predicate
    const edge = {
      source: subjectNode.id,
      target: objectNode.id,
      label: quad.predicate.value,
    };
    graph.edges.push(edge);
  });

  return graph;
}*/

function parseOwl(input) {
  // Parse the OWL input into an RDF graph
  const store = rdfExt.default.dataset();
  rdfExt.default.parse(input, { baseIRI: 'http://example.org/ontology#' }, store);

  // Convert the RDF graph into a graph data structure
  const graph = { nodes: [], edges: [] };
  store.forEach((quad) => {
    // Add a node for each subject and object
    const subjectNode = { id: quad.subject.value, label: quad.subject.value };
    const objectNode = { id: quad.object.value, label: quad.object.value };
    graph.nodes.push(subjectNode);
    graph.nodes.push(objectNode);

    // Add an edge for each predicate
    const edge = {
      source: subjectNode.id,
      target: objectNode.id,
      label: quad.predicate.value,
    };
    graph.edges.push(edge);
  });

  return graph;
}

function renderGraph(graph) {
  // Set the dimensions of the canvas
  const width = 800;
  const height = 600;

  // Set the force simulation properties
  const simulation = d3.forceSimulation(graph.nodes)
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink(graph.edges).distance(100));

  // Set the colors for the nodes and edges
  const nodeColor = 'lightblue';
  const edgeColor = 'gray';

  // Add the edges to the canvas
  const edges = d3.select('#output')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .selectAll('line')
    .data(graph.edges)
    .enter()
    .append('line')
    .attr('stroke', edgeColor)
    .attr('stroke-width', 2);

  // Add the nodes to the canvas
  const nodes = d3.select('#output')
    .select('svg')
    .selectAll('circle')
    .data(graph.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', nodeColor);

  // Add labels to the nodes
  const labels = d3.select('#output')
    .select('svg')
    .selectAll('text')
    .data(graph.nodes)
    .enter()
    .append('text')
    .text((d) => d.label)
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle');

  // Add labels to the edges
  const edgeLabels = d3.select('#output')
    .select('svg')
    .selectAll('edgeLabel')
    .data(graph.edges)
    .enter()
    .append('text')
    .text((d) => d.label)
    .attr('font-size', 10)
    .attr('text-anchor', 'middle');

  // Update the positions of the elements on each tick of the simulation
  simulation.on('tick', () => {
    edges.attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    nodes.attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    labels.attr('x', (d) => d.x)
      .attr('y', (d) => d.y);

    edgeLabels.attr('x', (d) => (d.source.x + d.target.x) / 2)
      .attr('y', (d) => (d.source.y + d.target.y) / 2);
  });
}


import {RoomHandle} from "./types/RoomHandle";
import {IntersectionDirection} from "./types/IntersectionDirection";
import {Pipe} from "./Pipe";

export type Graph = {
	start: Node
	distance: number[][],
	previous: (Node | null)[][]
};
export type Node = {
	x: number,
	y: number
}

/*
 1  function Dijkstra(Graph, source):
 2
 3      for each vertex v in Graph.Vertices:
 4          dist[v] ← INFINITY
 5          prev[v] ← UNDEFINED
 6          add v to Q
 7      dist[source] ← 0
 8
 9      while Q is not empty:
10          u ← vertex in Q with min dist[u]
11          remove u from Q
12
13          for each neighbor v of u still in Q:
14              alt ← dist[u] + Graph.Edges(u, v)
15              if alt < dist[v]:
16                  dist[v] ← alt
17                  prev[v] ← u
18
19      return dist[], prev[]
*/
export function dijkstraGraph(roomHandles: RoomHandle[][], start: Node): Graph {
	function neighbours(node: Node): Node[] {
		function outOfBounds(node: Node): boolean {
			return node.y < 0 || node.y >= roomHandles.length || node.x < 0 || node.x >= roomHandles[node.y].length;
		}

		let neighbours = [];
		// Left
		if (!outOfBounds({x: node.x - 1, y: node.y})) {
			if (
				roomHandles[node.y][node.x].data.intersectionStates[IntersectionDirection.Left]
				&& roomHandles[node.y][node.x - 1].data.intersectionStates[IntersectionDirection.Right]
				&& roomHandles[node.y][node.x - 1].data.rightPipeCapacity > 0
			) {
				neighbours.push({x: node.x - 1, y: node.y})
			}
		}
		// Right
		if (!outOfBounds({x: node.x + 1, y: node.y})) {
			if (
				roomHandles[node.y][node.x].data.intersectionStates[IntersectionDirection.Right]
				&& roomHandles[node.y][node.x + 1].data.intersectionStates[IntersectionDirection.Left]
				&& roomHandles[node.y][node.x].data.rightPipeCapacity > 0
			) {
				neighbours.push({x: node.x + 1, y: node.y})
			}
		}
		// Up
		if (!outOfBounds({x: node.x, y: node.y - 1})) {
			if (
				roomHandles[node.y][node.x].data.intersectionStates[IntersectionDirection.Top]
				&& roomHandles[node.y - 1][node.x].data.intersectionStates[IntersectionDirection.Bottom]
				&& roomHandles[node.y - 1][node.x].data.bottomPipeCapacity > 0
			) {
				neighbours.push({x: node.x, y: node.y - 1})
			}
		}
		// Down
		if (!outOfBounds({x: node.x, y: node.y + 1})) {
			if (
				roomHandles[node.y][node.x].data.intersectionStates[IntersectionDirection.Bottom]
				&& roomHandles[node.y + 1][node.x].data.intersectionStates[IntersectionDirection.Top]
				&& roomHandles[node.y][node.x].data.bottomPipeCapacity > 0
			) {
				neighbours.push({x: node.x, y: node.y + 1})
			}
		}
		return neighbours;
	}

	function edgeWeight(from: Node, to: Node) {
		return 1; // Edge weight of 1 makes it BFST
	}

	function compareByDistance(a: Node, b: Node) {
		return distance[b.y][b.x] - distance[a.y][a.x];
	}

	const distance: number[][] = roomHandles.map(row => row.map(_ => Number.POSITIVE_INFINITY));
	const previous: (Node | null)[][] = roomHandles.map(row => row.map(_ => null));
	const queue: Node[] = [];
	for (let y = 0; y < roomHandles.length; y++)
		for (let x = 0; x < roomHandles[y].length; x++) {
			queue.push({x, y});
		}
	distance[start.y][start.x] = 0;
	while (queue.length > 0) {
		// u ← vertex in Q with min dist[u]
		// remove u from Q
		const node: { x: number, y: number } = queue.sort(compareByDistance).pop();

		// for each neighbor v of u still in Q:
		for (const neighbour of neighbours(node)) {
			if (!queue.some(n => n.x === neighbour.x && n.y === neighbour.y)) continue;

			// alt ← dist[u] + Graph.Edges(u, v)
			const proposedDistance = distance[node.y][node.x] + edgeWeight(node, neighbour);
			// if alt < dist[v]:
			if (proposedDistance < distance[neighbour.y][neighbour.x]) {
				// dist[v] ← alt
				distance[neighbour.y][neighbour.x] = proposedDistance;
				// prev[v] ← u
				previous[neighbour.y][neighbour.x] = node;
			}
		}
	}
	return {start, distance, previous};
}

// 1  S ← empty sequence
// 2  u ← target
// 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
// 4      while u is defined:                       // Construct the shortest path with a stack S
// 5          insert u at the beginning of S        // Push the vertex onto the stack
// 6          u ← prev[u]                           // Traverse from target to source
export function dijkstraPath(graph: Graph, to: Node) {
	// 1  S ← empty sequence
	const path: Pipe[] = []
	// 2  u ← target
	let node: Node | null = to;
	// 3  if prev[u] is defined or u = source:
	if (
		graph.previous[node.y][node.x] != null
		|| (to.x == graph.start.x && to.y == graph.start.y)
	) {
		// 4      while u is defined:
		while (node != null) {
			// 5          insert u at the beginning of S
			const nextNode = node;
			// 6          u ← prev[u]
			node = graph.previous[node.y][node.x];
			const prevNode = node;

			if (prevNode != null) {
				const nodeThatHasPipe = (
					nextNode.y == prevNode.y - 1
					|| nextNode.x == prevNode.x - 1
				) ? nextNode : prevNode;
				path.push({
					x: nodeThatHasPipe.x,
					y: nodeThatHasPipe.y,
					vertical: nextNode.y != prevNode.y
				});
			}
		}
	}

	return path.reverse();
}

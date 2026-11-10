# Hand-back step-03-grid-edges r1
Step file: handoff/steps/step-03-grid-edges.md
Base commit: 9c540c9c180faec867e9d98dda4d4960072dc54c     Head commit: d1579f604ea0df2e3ccfe0cdab6693086ba073de     Branch: step/step-03-grid-edges-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/core/grid/grid.ts
A	src/core/grid/index.ts
A	src/core/grid/types.ts
A	src/core/notice.ts
A	tests/core/edges.test.ts
A	tests/core/grid.test.ts
A	tests/fixtures/maps/grid-4x3.json
A	tests/fixtures/maps/grid-6x9.json

## Green
npm test: 47/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Notice codes, in this order: wrapEdgesIgnored ("wrapEdges is ignored") only when the option is true; floorMissing ("no floor tile type"); terrainLength ("terrain length does not match the map"); unknownTerrain ("unknown terrain", with at) per bad cell in row-major order; edgeOffMap ("edge off the map", with at); then per object objectOffMap ("object off the map") or footprintIgnored ("footprint plays 1x1"). A duplicate wall has no notice. A missing terrain cell is floor and does not add unknownTerrain.
- The synthetic floor is registered as id "floor", so a palette entry of that id does not also warn unknownTerrain. If two tile types share an id, the later one is used. tileTypeAt off the map returns that floor and adds no notice. index and sqAt do not check bounds. A non-integer c or r is out of bounds.
- Walls are a per-cell mask: n=1, e=2, s=4, w=8. An edge sets its bit and the opposite bit on the on-map neighbour. Objects use a second mask, set only when blocks is true. Reachable is a FIFO breadth-first search expanded in DIRS order n, e, s, w; the first visit wins. A cell at exactly maxSteps is kept and not expanded. If isBlocked(from) is true, or from is off the map, the result is empty.
- map.paths and map.logic.lanes are not read, and there is no notice. createGrid throws RangeError "createGrid: cols and rows must be integers >= 1". grid-6x9.json is an open 6 by 9 floor with no edges and no objects.
- Diff excluding the lockfile, handback and the two JSON fixtures is 353 insertions. No Change Notice came with this step.

## Kit files used
- handoff/steps/step-03-grid-edges.md (origin/main) 132d24626f30629c7670d99701f3be18bd727e3272c49eb5132979f3a1857a0f
- BUILD_GUIDE.md (base 9c540c9, §2 laws 2 and 10, M8, §4) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20
- src/types/core-types.ts (base, read only) f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23

## Next step (optional proposal)
- step-04-units-occupancy. The grid does not look at units; canForceInto stops on edges and closed cells only.

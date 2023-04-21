import { Point } from "./types/point.js";

let size = 50;
export const maze: number[][] = [];

function removeWallFromMap(point: Point): void {
  maze[point.y][point.x] = 0;
}

function getRandomNum(limit: number) : number {
  return Math.floor(Math.random() * limit)
}

function isAvailableCell(point: Point): boolean {
  return maze[point.y][point.x] === 0
}


function generateMap(): void {
  for (let i = 0; i < size; i++) {
    maze[i] = [];
      for (let q = 0; q < size; q++) {
        maze[i][q] = 1;
      }
  }

  const point: Point = { x: getRandomNum(size), y: getRandomNum(size)}
  removeWallFromMap(point)

  const walls: Point[] = []
  if (point.y - 6 >= 0) walls.push({ x: point.x, y: point.y - 6 })
  if (point.y + 6 < size) walls.push({ x: point.x, y: point.y + 6 })
  if (point.x - 6 >= 0) walls.push({ x: point.x - 6, y: point.y })
  if (point.x + 6 < size) walls.push({ x: point.x + 6, y: point.y })

  while (walls.length > 0) {
      const index = getRandomNum(walls.length)

      const cell: Point = walls[index]
      const x: number = cell.x
      const y: number = cell.y

      if (isAvailableCell(cell)) {
          walls.splice(index, 1)
          continue;
      }

      removeWallFromMap(cell)
      walls.splice(index, 1)

      let directions: Direction[] = [Direction.up, Direction.down, Direction.left, Direction.right]
      while (directions.length > 0) {
          const index = getRandomNum(directions.length)

          switch (directions[index]) {
              case Direction.up:
                  if (y - 6 >= 0 && isAvailableCell({ x: x, y: y - 6 })) {
                    removeWallFromMap({ x: x, y: y - 2 })
                    removeWallFromMap({ x: x, y: y - 3 })
                    removeWallFromMap({ x: x, y: y - 1 })
                    removeWallFromMap({ x: x, y: y - 4 })
                    removeWallFromMap({ x: x, y: y - 5 })
                    directions.splice(0, directions.length)
                  }
                  break

              case Direction.down:
                  if (y + 6 < size && isAvailableCell({ x: x, y: y + 6 })) {
                      removeWallFromMap({ x: x, y: y + 2})
                      removeWallFromMap({ x: x, y: y + 3})
                      removeWallFromMap({ x: x, y: y + 1})
                      removeWallFromMap({ x: x, y: y + 4})
                      removeWallFromMap({ x: x, y: y + 5})
                      directions.splice(0, directions.length)
                  }
                  break

              case Direction.left:
                  if (x - 6 >= 0 && isAvailableCell({ x: x - 6, y: y })) {
                    removeWallFromMap({ x: x - 5, y: y})
                    removeWallFromMap({ x: x - 4, y: y})
                    removeWallFromMap({ x: x - 3, y: y})

                      removeWallFromMap({ x: x - 2, y: y})
                      removeWallFromMap({ x: x - 1, y: y})
                      directions.splice(0, directions.length)
                  }
                  break

              case Direction.right:
                  if (x + 6 < size && isAvailableCell({ x: x + 6, y: y })) {
                    removeWallFromMap({ x: x + 5, y: y})
                    removeWallFromMap({ x: x + 4, y: y})
                    removeWallFromMap({ x: x + 2, y: y})
                    removeWallFromMap({ x: x + 3, y: y})
                    removeWallFromMap({ x: x + 1, y: y})
                    directions.splice(0, directions.length)

                  }
                  break
          }
          directions.splice(index, 1)
      }

      if (y - 6 >= 0 && !isAvailableCell({ x: x, y: y - 6 })) {
          walls.push({ x: x, y: y - 6 })
      }

      if (x + 6 < size && !isAvailableCell({ x: x + 6, y: y })) {
          walls.push({ x: x + 6, y: y })
      }

      if (y + 6 < size && !isAvailableCell({ x: x, y: y + 6 })) {
          walls.push({ x: x, y: y + 6 })
      }

      if (x - 6 >= 0 && !isAvailableCell({ x: x - 6, y: y })) {
          walls.push({ x: x - 6, y: y })
      }
  }
}

export enum Direction {
  up,
  left,
  down,
  right
}


generateMap();


var currentImage = 0;
var imageUrls = [
  "https://download.unsplash.com/photo-1428278953961-a8bc45e05f72",
  "https://download.unsplash.com/photo-1433959352364-9314c5b6eb0b",
  "https://download.unsplash.com/photo-1433838552652-f9a46b332c40",
  "https://download.unsplash.com/photo-1430916273432-273c2db881a0",
  "https://download.unsplash.com/photo-1430866880825-336a7d7814eb",
  "https://download.unsplash.com/photo-1430126833726-4a091c572f3c",
  "https://download.unsplash.com/photo-1430760814266-9c81759e5e55",
  "https://download.unsplash.com/photo-1428865798880-73444f4cbefc",
  "https://download.unsplash.com/photo-1422207134147-65fb81f59e38"
];

function nextImage() {
  currentImage += 1;
  var tiles = document.querySelectorAll(".tiles>.tile");
  for (var i = 0; i < tiles.length; i += 1) {
    tiles[i].style.backgroundImage = "url(" + imageUrls[currentImage] + ")";
  }
}

function reveal() {
  var tiles = document.querySelectorAll(".tiles>.tile");
  for (var i = 0; i < tiles.length; i += 1) {
    var tile = tiles[i];
    swapClass(tile, "position-", "position-" + findClass(tile, "tile-").substr(5));
  }
}

function unreveal() {
  var order = currentOrder();
  if (!order) { return; }
  var tiles = document.querySelectorAll(".tiles>.tile");
  for (var i = 0; i < tiles.length; i += 1) {
    var tile = tiles[i];
    var position = positionForOrder(order[i]);
    swapClass(tile, "position-", "position-" + position.row + "-" + position.column);
  }
}

function newOrder() {
  return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].sort(function() { return 0.5 - Math.random(); });
}

var currentOrder = (function() {
  var value;

  return function(newValue) {
    if (arguments.length > 0) {
      value = newValue;
    }

    return value;
  };
}());

function positionForOrder(order) {
  return {
    row: Math.floor(order / 4) + 1,
    column: order % 4 + 1
  };
}

function shuffleTiles() {
  setMoves(0);
  var order = currentOrder(newOrder());
  for (var i = 0; i < order.length; i += 1) {
    var tileNumber = positionForOrder(i);
    var tile = document.querySelector(".tiles>.tile-" + tileNumber.row + "-" + tileNumber.column);
    var position = positionForOrder(order[i]);
    swapClass(tile, "position-", "position-" + position.row + "-" + position.column);
  }
}

function removeClass(element, targetClassName) {
  element.className = element.className.split(" ").filter(function(className) {
    return !className.match(targetClassName);
  }).join(" ");
}

function addClass(element, className) {
  element.className += " " + className;
}

function findClass(element, targetClassName) {
  return element.className.split(" ").filter(function(className) {
    return className.match(targetClassName);
  })[0] || "";
}

function swapClass(element, from, to) {
  removeClass(element, from);
  addClass(element, to);
}

function swapTiles(tileA, tileB) {
  var tileAPosition = findClass(tileA, "position-");
  var tileBPosition = findClass(tileB, "position-");
  swapClass(tileA, "position-", tileBPosition);
  swapClass(tileB, "position-", tileAPosition);
}

function position(tile) {
  var positionClassName = findClass(tile, "position-");
  return { row: parseInt(positionClassName.substr(9, 1), 10), column: parseInt(positionClassName.substr(11, 1), 10) };
}

function adjacent(tileA, tileB) {
  var tileAPosition = position(tileA);
  var tileBPosition = position(tileB);
  return (
    (tileAPosition.row === tileBPosition.row && (tileAPosition.column === tileBPosition.column - 1 || tileAPosition.column === tileBPosition.column + 1)) ||
    (tileAPosition.column === tileBPosition.column && (tileAPosition.row === tileBPosition.row - 1 || tileAPosition.row === tileBPosition.row + 1))
  );
}

function all(xs, f) {
  for (var i = 0; i < xs.length; i += 1) {
    if (!f(xs[i])) {
      return false;
    }
  }

  return true;
}

function tileInPosition(tile) {
  return findClass(tile, "tile-").substr(5) === findClass(tile, "position-").substr(9);
}

function isInOrder() {
  return all(document.querySelectorAll(".tiles>.tile"), tileInPosition);
}

function moves() {
  var moveCount = document.querySelector(".move-count");
  return parseInt(moveCount.textContent, 10);
}

function setMoves(n) {
  var moveCount = document.querySelector(".move-count");
  moveCount.textContent = n;
}

function incrementMoves() {
  setMoves(moves() + 1);
}

function swapWithEmpty(tile) {
  var empty = document.querySelector(".tiles>.tile.empty");
  if (adjacent(tile, empty)) {
    swapTiles(tile, empty);
    incrementMoves();
    if (isInOrder()) {
      alert("Yay!");
    }
  } else {
    addClass(tile, "shake");
    setTimeout(function() {
      removeClass(tile, "shake");
    }, 300);
  }
}

function makeSwapWithEmpty(tile) {
  return function() {
    swapWithEmpty(tile);
  };
}

var tiles = document.querySelectorAll(".tiles>.tile");
for (var i = 0; i < tiles.length; i += 1) {
  var tile = tiles[i];
  tile.addEventListener("click", makeSwapWithEmpty(tile));
}

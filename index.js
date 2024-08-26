function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function triple(cell, fallback) {
    return tripleOrDivide(cell, fallback, true);
}
function divide(cell, fallback) {
    return tripleOrDivide(cell, fallback, false);
}
function tripleOrDivide(cell, fallback, doTriple) {
    var numericValue = Math.round((typeof cell.value == 'number' ? cell.value : fallback) * (doTriple ? 3 : 1 / 3));
    if (numericValue < 1) {
        numericValue = 1;
    }
    cell.value = numericValue;
    if (numericValue >= 6561) {
        cell.div.className = 'cell value-big';
    } else {
        cell.div.className = "cell value-".concat(numericValue);
    }
    cell.div.textContent = numericValue.toFixed();
    cell.div.classList.remove('created');
    cell.div.offsetHeight;
    cell.div.classList.add('created');
    return numericValue;
}
function updatePosition(cell, row, col) {
    cell.div.style.top = "calc(var(--spacing) * (".concat(row + 1, ") + var(--length) * ").concat(row, ")");
    cell.div.style.left = "calc(var(--spacing) * (".concat(col + 1, ") + var(--length) * ").concat(col, ")");
}
function remove(cell) {
    cell.div.remove();
}
function create(value, row, col) {
    var tile = document.createElement('div');
    if (typeof value == 'string') {
        tile.className = "cell created ".concat(value);
        var icon = document.getElementById(value).cloneNode(true);
        icon.style.removeProperty('display');
        tile.append(icon);
    } else {
        tile.className = "cell created value-".concat(value);
        tile.textContent = value.toFixed();
    }
    box === null || box === void 0 ? void 0 : box.append(tile);
    var cell = {
        div: tile,
        value: value
    };
    updatePosition(cell, row, col);
    field[row][col] = cell;
}
function restart() {
    for(var r = 0; r < SIZE; r++){
        for(var c = 0; c < SIZE; c++){
            var cell = field[r][c];
            if (cell != undefined) {
                remove(cell);
            }
            field[r][c] = undefined;
        }
    }
    hasWon = false;
    score = 0;
    document.getElementById('score').textContent = score.toFixed();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = document.getElementsByClassName('message')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var msg = _step.value;
            msg.style.display = 'none';
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    spawnNewTile();
    spawnNewTile();
    spawnNewTile();
}
// ~~ STRUCTURES ~~
function weightedRandom(items, probabilities) {
    // Generate a random number between 0 and 1
    var random = Math.random();
    // Accumulate probabilities
    var cumulativeProbability = 0;
    for(var i = 0; i < items.length; i++){
        cumulativeProbability += probabilities[i];
        if (random < cumulativeProbability) {
            return items[i];
        }
    }
    // In case of rounding errors, return the last item as a fallback
    return items[items.length - 1];
}
function matches(a, b, c) {
    var AB = a.value == b.value;
    var AC = a.value == c.value;
    var BC = b.value == c.value;
    if (AB && (c.value == 'wildcard' || AC)) {
        return true;
    }
    if (AC && (b.value == 'wildcard' || BC)) {
        return true;
    }
    if (BC && (a.value == 'wildcard' || AC)) {
        return true;
    }
    return false;
}
var field = [
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ],
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ],
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ],
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ],
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ],
    [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ]
];
var box;
var score = 0;
var hasWon = false;
var SIZE = 6;
window.onload = function() {
    if (isMobileDevice()) {
        document.getElementById('dpad').style.display = 'block';
    }
    box = document.getElementById('box');
    for(var r = 0; r < SIZE; r++){
        for(var c = 0; c < SIZE; c++){
            var placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            placeholder.style.left = "calc(var(--spacing) * (".concat(c + 1, ") + var(--length) * ").concat(c, ")");
            placeholder.style.top = "calc(var(--spacing) * (".concat(r + 1, ") + var(--length) * ").concat(r, ")");
            box.append(placeholder);
        }
    }
    spawnNewTile();
    spawnNewTile();
    spawnNewTile();
};
window.onkeydown = function(ev) {
    if (ev.key == 'ArrowUp' || ev.key == 'w' || ev.key == 'i') {
        move(0, 1);
    } else if (ev.key == 'ArrowDown' || ev.key == 's' || ev.key == 'k') {
        move(0, -1);
    } else if (ev.key == 'ArrowLeft' || ev.key == 'a' || ev.key == 'j') {
        move(1, 0);
    } else if (ev.key == 'ArrowRight' || ev.key == 'd' || ev.key == 'l') {
        move(-1, 0);
    }
};
window.onmousedown = swipeStart;
window.ondragstart = swipeStart;
window.onpointerdown = swipeStart;
window.onmouseup = swipeEnd;
window.ondragend = swipeEnd;
window.onpointerup = swipeEnd;
var touchStart = {
    x: 0,
    y: 0
};
function swipeStart(ev) {
    ev.preventDefault();
    var x = _instanceof(ev, TouchEvent) ? ev.targetTouches[0].clientX : ev.pageX;
    var y = _instanceof(ev, TouchEvent) ? ev.targetTouches[0].clientY : ev.pageY;
    if (!document.elementsFromPoint(x, y).includes(box)) {
        return;
    }
    touchStart.x = x;
    touchStart.y = y;
}
function swipeEnd(ev) {
    ev.preventDefault();
    var x = _instanceof(ev, TouchEvent) ? ev.targetTouches[0].clientX : ev.pageX;
    var y = _instanceof(ev, TouchEvent) ? ev.targetTouches[0].clientY : ev.pageY;
    if (!document.elementsFromPoint(x, y).includes(box)) {
        return;
    }
    var dx = x - touchStart.x;
    var dy = y - touchStart.y;
    var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (dist < 150) {
        return;
    }
    var angle = Math.atan2(dy, dx);
    var margin = Math.PI / 16;
    if (Math.abs(angle - Math.PI) < margin || Math.abs(angle + Math.PI) < margin) {
        move(1, 0);
    } else if (Math.abs(angle) < margin) {
        move(-1, 0);
    } else if (Math.abs(angle + Math.PI / 2) < margin) {
        move(0, 1);
    } else if (Math.abs(angle - Math.PI / 2) < margin) {
        move(0, -1);
    }
}
function spawnNewTile(pos) {
    var row;
    var col;
    var allowedSpaces = [];
    var totalValue = 0;
    var nonNullSpaces = 0;
    for(var r = 0; r < SIZE; r++){
        for(var c = 0; c < SIZE; c++){
            var cell = field[r][c];
            if (cell == undefined) {
                allowedSpaces.push([
                    r,
                    c
                ]);
            } else {
                nonNullSpaces += 1;
                if (typeof cell.value == 'number') {
                    totalValue += cell.value;
                } else {
                    totalValue += 9;
                }
            }
        }
    }
    if (pos == undefined) {
        if (allowedSpaces.length == 0) {
            return true;
        }
        var ref;
        ref = _sliced_to_array(allowedSpaces[Math.floor(Math.random() * allowedSpaces.length)], 2), row = ref[0], col = ref[1], ref;
    } else {
        var ref1;
        ref1 = _sliced_to_array(pos, 2), row = ref1[0], col = ref1[1], ref1;
    }
    var cellValue;
    var averageValue = totalValue / nonNullSpaces;
    if (nonNullSpaces == 0) {
        cellValue = 1;
    } else if (averageValue < 3) {
        cellValue = weightedRandom([
            1,
            3
        ], [
            0.9,
            0.1
        ]);
    } else if (averageValue < 5) {
        cellValue = weightedRandom([
            1,
            3,
            9,
            'wildcard'
        ], [
            0.8,
            0.1,
            0.05,
            0.05
        ]);
    } else if (averageValue < 7) {
        cellValue = weightedRandom([
            1,
            3,
            9,
            'wildcard',
            'times-three'
        ], [
            0.7,
            0.15,
            0.05,
            0.05,
            0.05
        ]);
    } else if (averageValue < 9) {
        cellValue = weightedRandom([
            1,
            3,
            9,
            'wildcard',
            'times-three',
            'bomb'
        ], [
            0.65,
            0.15,
            0.07,
            0.05,
            0.05,
            0.03
        ]);
    } else if (averageValue < 10) {
        cellValue = weightedRandom([
            1,
            3,
            9,
            'wildcard',
            'times-three',
            'bomb',
            'nuke'
        ], [
            0.65,
            0.15,
            0.07,
            0.05,
            0.04,
            0.01
        ]);
    } else {
        cellValue = weightedRandom([
            1,
            3,
            9,
            'wildcard',
            'times-three',
            'bomb',
            'nuke',
            'divide-three'
        ], [
            0.6,
            0.15,
            0.07,
            0.05,
            0.04,
            0.01,
            0.05
        ]);
    }
    create(cellValue, row, col);
    return allowedSpaces.length == 0;
}
function move(dx, dy) {
    var alongColumn = dy != 0;
    var nonZero = dx == 0 ? dy : dx;
    var start = nonZero > 0 ? 0 : SIZE - 1;
    var end = nonZero > 0 ? SIZE - 1 : 0;
    for(var major = 0; major < SIZE; major++){
        var slice = [];
        for(var minor = start; minor * nonZero <= end * nonZero; minor += nonZero){
            var col = alongColumn ? major : minor;
            var row = alongColumn ? minor : major;
            if (field[row][col] != undefined) {
                slice.push(field[row][col]);
            }
        }
        for(var i = 0; i < slice.length; i++){
            var first = slice[i];
            var second = slice[i + 1];
            var third = slice[i + 2];
            if (second != undefined && third != undefined && matches(first, second, third)) {
                score += triple(first, second.value);
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
                remove(slice[i + 2]);
                slice[i + 2] = undefined;
            } else if (first.value == 'nuke') {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = slice[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var cell = _step.value;
                        if (cell != undefined) {
                            remove(cell);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                slice = [];
                break;
            } else if (first.value == 'bomb' && second != undefined || (second === null || second === void 0 ? void 0 : second.value) == 'bomb') {
                remove(slice[i]);
                slice[i] = undefined;
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
                i--;
            } else if (first.value == 'times-three' && typeof (second === null || second === void 0 ? void 0 : second.value) == 'number') {
                score += triple(first, second.value);
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
            } else if ((second === null || second === void 0 ? void 0 : second.value) == 'times-three' && typeof first.value == 'number') {
                slice[i] = second;
                slice[i + 1] = first;
                score += triple(second, first.value);
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
            } else if (first.value == 'divide-three' && typeof (second === null || second === void 0 ? void 0 : second.value) == 'number') {
                score += divide(first, second.value);
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
            } else if ((second === null || second === void 0 ? void 0 : second.value) == 'divide-three' && typeof first.value == 'number') {
                slice[i] = second;
                slice[i + 1] = first;
                score += divide(second, first.value);
                remove(slice[i + 1]);
                slice[i + 1] = undefined;
            }
            slice = slice.filter(function(e) {
                return e != undefined;
            });
        }
        for(var minor1 = start, i1 = 0; minor1 * nonZero <= end * nonZero; minor1 += nonZero, i1++){
            var col1 = alongColumn ? major : minor1;
            var row1 = alongColumn ? minor1 : major;
            field[row1][col1] = slice[i1];
            if (slice[i1] != undefined) {
                updatePosition(slice[i1], row1, col1);
            }
        }
    }
    var isFieldFull = spawnNewTile();
    var isGameOver = isFieldFull;
    if (isFieldFull) {
        outer: for(var i2 = 0; i2 < SIZE; i2++){
            for(var r = 0; r < SIZE - 1; r++){
                var first1 = field[r][i2];
                var second1 = r + 1 < field.length ? field[r + 1][i2] : undefined;
                var third1 = r + 2 < field.length ? field[r + 2][i2] : undefined;
                if (typeof (first1 === null || first1 === void 0 ? void 0 : first1.value) == 'string' && first1.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof (second1 === null || second1 === void 0 ? void 0 : second1.value) == 'string' && second1.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof (third1 === null || third1 === void 0 ? void 0 : third1.value) == 'string' && third1.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (first1 != undefined && second1 != undefined && third1 != undefined && matches(first1, second1, third1)) {
                    isGameOver = false;
                    break outer;
                }
            }
            for(var c = 0; c < SIZE - 1; c++){
                var first2 = field[i2][c];
                var second2 = field[i2][c + 1];
                var third2 = field[i2][c + 2];
                if (typeof (first2 === null || first2 === void 0 ? void 0 : first2.value) == 'string' && first2.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof (second2 === null || second2 === void 0 ? void 0 : second2.value) == 'string' && second2.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof (third2 === null || third2 === void 0 ? void 0 : third2.value) == 'string' && third2.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (first2 != undefined && second2 != undefined && third2 != undefined && matches(first2, second2, third2)) {
                    isGameOver = false;
                    break outer;
                }
            }
        }
    }
    if (isGameOver) {
        document.getElementById('you-lost').style.display = 'flex';
    }
    document.getElementById('score').textContent = score.toFixed();
    if (!hasWon) {
        var won = field.some(function(e) {
            return e.some(function(e) {
                return (e === null || e === void 0 ? void 0 : e.value) == 6561;
            });
        });
        if (won) {
            document.getElementById('you-won').style.display = 'flex';
        }
    }
}


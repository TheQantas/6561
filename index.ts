type ThreeValue = 1 | 3 | 9 | 27 | 81 | 243 | 729 | 2187 | 6561;
type PowerUp = 'times-three' | 'divide-three' | 'bomb' | 'nuke' | 'wildcard';

interface ICell {
    readonly div: HTMLDivElement,
    value: ThreeValue | PowerUp,
}

function isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function triple(cell: ICell,fallback: ThreeValue): number {
    return tripleOrDivide(cell,fallback,true);
}
function divide(cell: ICell,fallback: ThreeValue): number {
    return tripleOrDivide(cell,fallback,false);
}
function tripleOrDivide(cell: ICell,fallback: ThreeValue,doTriple: boolean): number {
    let numericValue = Math.round( (typeof cell.value == 'number' ? cell.value : fallback) * (doTriple ? 3 : 1/3) ) as ThreeValue;
    if (numericValue < 1) {
        numericValue = 1;
    }
    cell.value = numericValue;
    if (numericValue >= 6561) {
        cell.div.className = 'cell value-big';
    } else {
        cell.div.className = `cell value-${numericValue}`;
    }
    cell.div.textContent = numericValue.toFixed();
    cell.div.classList.remove('created');
    cell.div.offsetHeight;
    cell.div.classList.add('created');

    return numericValue;
}

function updatePosition(cell: ICell,row: number,col: number) {
    cell.div.style.top = `calc(var(--spacing) * (${row+1}) + var(--length) * ${row})`;
    cell.div.style.left = `calc(var(--spacing) * (${col+1}) + var(--length) * ${col})`;
}

function remove(cell: ICell) {
    cell.div.remove();
}
function create(value: PowerUp | ThreeValue,row: number,col: number) {
    const tile = document.createElement('div');
    if (typeof value == 'string') {
        tile.className = `cell created ${value}`;
        const icon = document.getElementById(value)!.cloneNode(true) as HTMLElement;
        icon.style.removeProperty('display');
        tile.append(icon);
    } else { //is number
        tile.className = `cell created value-${value}`;
        tile.textContent = value.toFixed();
    }
    box?.append(tile);
    let cell: ICell = {
        div: tile,
        value
    };
    updatePosition(cell,row,col);
    field[row][col] = cell;
}

function restart() { //from button
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = field[r][c];
            if (cell != undefined) {
                remove(cell);
            }
            field[r][c] = undefined;
        }
    }

    hasWon = false;
    score = 0;
    document.getElementById('score')!.textContent = score.toFixed();

    for (const msg of document.getElementsByClassName('message') as HTMLCollectionOf<HTMLElement>) {
        msg.style.display = 'none';
    }

    spawnNewTile();
    spawnNewTile();
    spawnNewTile();
}

// ~~ STRUCTURES ~~

function weightedRandom<T>(items: T[],probabilities: number[]): T {
    // Generate a random number between 0 and 1
    const random = Math.random();
    
    // Accumulate probabilities
    let cumulativeProbability = 0;
    
    for (let i = 0; i < items.length; i++) {
        cumulativeProbability += probabilities[i];
        if (random < cumulativeProbability) {
            return items[i];
        }
    }
    
    // In case of rounding errors, return the last item as a fallback
    return items[items.length - 1];
}

function matches(a: ICell,b: ICell,c: ICell): boolean {
    const AB = a.value == b.value;
    const AC = a.value == c.value;
    const BC = b.value == c.value;

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


type Fiver<T> = [T,T,T,T,T];

const field: Fiver<Fiver<ICell|undefined>> = [
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
];

let box: HTMLElement | null;
let score = 0;
let hasWon = false;
const SIZE = 5;

window.onload = () => {
    if (isMobileDevice()) {
        document.getElementById('dpad')!.style.display = 'block';
    }

    box = document.getElementById('box')!;

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            placeholder.style.left = `calc(var(--spacing) * (${c+1}) + var(--length) * ${c})`;
            placeholder.style.top = `calc(var(--spacing) * (${r+1}) + var(--length) * ${r})`;
            box.append(placeholder);
        }
    }

    spawnNewTile();
    spawnNewTile();
    spawnNewTile();
}

window.onkeydown = ev => {
    if (ev.key == 'ArrowUp' || ev.key == 'w' || ev.key == 'i') {
        move(0,1);
    } else if (ev.key == 'ArrowDown' || ev.key == 's' || ev.key == 'k') {
        move(0,-1);
    } else if (ev.key == 'ArrowLeft' || ev.key == 'a' || ev.key == 'j') {
        move(1,0);
    } else if (ev.key == 'ArrowRight' || ev.key == 'd' || ev.key == 'l') {
        move(-1,0);
    }
}

window.onmousedown = swipeStart;
window.ondragstart = swipeStart;
window.onpointerdown = swipeStart;

window.onmouseup = swipeEnd;
window.ondragend = swipeEnd;
window.onpointerup = swipeEnd;

const touchStart = {x:0,y:0};
function swipeStart(ev: TouchEvent | MouseEvent | DragEvent | PointerEvent) {
    ev.preventDefault();
    const x = ev instanceof TouchEvent ? ev.targetTouches[0].clientX : ev.pageX;
    const y = ev instanceof TouchEvent ? ev.targetTouches[0].clientY : ev.pageY;
    if (!document.elementsFromPoint(x,y).includes(box!)) {
        return;
    }
    touchStart.x = x;
    touchStart.y = y;
}
function swipeEnd(ev: TouchEvent | MouseEvent | DragEvent | PointerEvent) {
    ev.preventDefault();
    const x = ev instanceof TouchEvent ? ev.targetTouches[0].clientX : ev.pageX;
    const y = ev instanceof TouchEvent ? ev.targetTouches[0].clientY : ev.pageY;
    if (!document.elementsFromPoint(x,y).includes(box!)) {
        return;
    }
    const dx = x - touchStart.x;
    const dy = y - touchStart.y;
    const dist = Math.sqrt(dx**2 + dy**2);
    if (dist < 150) {
        return;
    }
    const angle = Math.atan2(dy,dx);
    const margin = Math.PI / 16;
    if (Math.abs(angle-Math.PI) < margin || Math.abs(angle+Math.PI) < margin) {
        move(1,0);
    } else if (Math.abs(angle) < margin) {
        move(-1,0);
    } else if (Math.abs(angle+Math.PI/2) < margin) {
        move(0,1);
    } else if (Math.abs(angle-Math.PI/2) < margin) {
        move(0,-1);
    }
}

function spawnNewTile(pos?: [number,number]): boolean {
    let row: number;
    let col: number;

    const allowedSpaces: [number,number][] = [];
    let totalValue = 0;
    let nonNullSpaces = 0;

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = field[r][c];
            if (cell == undefined) {
                allowedSpaces.push([r,c]);
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

        [row,col] = allowedSpaces[Math.floor(Math.random() * allowedSpaces.length)];
    } else {
        [row,col] = pos;
    }

    let cellValue: ThreeValue | PowerUp;
    const averageValue = totalValue / nonNullSpaces;
    if (nonNullSpaces == 0) {
        cellValue = 1;
    } else if (averageValue < 3) {
        cellValue = weightedRandom([1,3],[0.9,0.1]);
    } else if (averageValue < 5) {
        cellValue = weightedRandom([1,3,9,'wildcard'],[0.8,0.1,0.05,0.05]);
    } else if (averageValue < 7) {
        cellValue = weightedRandom([1,3,9,'wildcard','times-three'],[0.7,0.15,0.05,0.05,0.05]);
    } else if (averageValue < 9) {
        cellValue = weightedRandom([1,3,9,'wildcard','times-three','bomb'],[0.65,0.15,0.07,0.05,0.05,0.03]);
    } else if (averageValue < 10) {
        cellValue = weightedRandom([1,3,9,'wildcard','times-three','bomb','nuke'],[0.65,0.15,0.07,0.05,0.04,0.01]);
    } else {
        cellValue = weightedRandom([1,3,9,'wildcard','times-three','bomb','nuke','divide-three'],[0.6,0.15,0.07,0.05,0.04,0.01,0.05]);
    }

    create(cellValue,row,col);
    
    return allowedSpaces.length == 0;
}

type Direction = 1 | 0 | -1;

function move(dx: Direction,dy: Direction) {
    const alongColumn = dy != 0;
    const nonZero = dx==0 ? dy : dx;
    const start = nonZero>0 ? 0 : SIZE - 1;
    const end = nonZero>0 ? SIZE - 1 : 0;

    for (let major = 0; major < SIZE; major++) {
        let slice: (ICell|undefined)[] = [];

        for (let minor = start; minor * nonZero <= end * nonZero; minor += nonZero) {
            const col = alongColumn ? major : minor;
            const row = alongColumn ? minor : major;
            if (field[row][col] != undefined) {
                slice.push(field[row][col]);
            }
        }

        for (let i = 0; i < slice.length; i++) {
            const first = slice[i]!;
            const second = slice[i+1];
            const third = slice[i+2];

            if (second != undefined && third != undefined && matches(first,second,third)) { //merge cells
                score += triple(first,second.value as ThreeValue);
                remove(slice[i+1]!);
                slice[i+1] = undefined;
                remove(slice[i+2]!);
                slice[i+2] = undefined;
            } else if (first.value == 'nuke') { //nuke row/column
                for (const cell of slice) {
                    if (cell != undefined) {
                        remove(cell);
                    }
                }
                slice = [];
                break;
            } else if ((first.value == 'bomb' && second != undefined) || second?.value == 'bomb') {
                remove(slice[i]!);
                slice[i] = undefined;
                remove(slice[i+1]!);
                slice[i+1] = undefined;
                i--;
            } else if (first.value == 'times-three' && typeof second?.value == 'number') {
                score += triple(first,second.value);
                remove(slice[i+1]!);
                slice[i+1] = undefined;
            } else if (second?.value == 'times-three' && typeof first.value == 'number') {
                slice[i] = second;
                slice[i+1] = first;
                score += triple(second,first.value);
                remove(slice[i+1]!);
                slice[i+1] = undefined;
            } else if (first.value == 'divide-three' && typeof second?.value == 'number') {
                score += divide(first,second.value);
                remove(slice[i+1]!);
                slice[i+1] = undefined;
            } else if (second?.value == 'divide-three' && typeof first.value == 'number') {
                slice[i] = second;
                slice[i+1] = first; 
                score += divide(second,first.value);
                remove(slice[i+1]!);
                slice[i+1] = undefined;
            }

            slice = slice.filter(e => e != undefined);
        }

        for (let minor = start, i = 0; minor * nonZero <= end * nonZero; minor += nonZero, i++) {
            const col = alongColumn ? major : minor;
            const row = alongColumn ? minor : major;
            field[row][col] = slice[i];
            if (slice[i] != undefined) {
                updatePosition(slice[i]!,row,col);
            }
        }
    }

    const isFieldFull = spawnNewTile();
    let isGameOver = isFieldFull;

    if (isFieldFull) {
        outer: for (let i = 0; i < SIZE; i++) {
            for (let r = 0; r < SIZE - 1; r++) {
                const first = field[r][i];
                const second = r+1<field.length ? field[r+1][i] : undefined;
                const third = r+2<field.length ? field[r+2][i] : undefined;
                if (typeof first?.value == 'string' && first.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof second?.value == 'string' && second.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof third?.value == 'string' && third.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (first != undefined && second != undefined && third != undefined && matches(first,second,third)) {
                    isGameOver = false;
                    break outer;
                }
            }
            for (let c = 0; c < SIZE - 1; c++) {
                const first = field[i][c];
                const second = field[i][c+1];
                const third = field[i][c+2];
                if (typeof first?.value == 'string' && first.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof second?.value == 'string' && second.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (typeof third?.value == 'string' && third.value != 'wildcard') {
                    isGameOver = false;
                    break outer;
                }
                if (first != undefined && second != undefined && third != undefined && matches(first,second,third)) {
                    isGameOver = false;
                    break outer;
                }
            }
        }
    }

    if (isGameOver) {
        document.getElementById('you-lost')!.style.display = 'flex';
    }

    document.getElementById('score')!.textContent = score.toFixed();

    if (!hasWon) {
        const won = field.some(e => e.some(e => e?.value == 6561));
        if (won) {
            document.getElementById('you-won')!.style.display = 'flex';
        }
    }
}


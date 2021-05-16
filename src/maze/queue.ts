
// Dynamic array-based queue implementation.
export class Queue<T> {
    private _arr: T[];
    private entry: number;
    private exit: number;
    private _size: number;
    private _pops: number;

    // Constructor for an array-based implementation of a queue.
    constructor() {
        this._arr = [];
        this.entry = 0;
        this.exit = 0;
        this._size = 0;
        this._pops = 0;
    }

    // Pushes an item into the queue.
    push(val: T) {
        this._arr[this.entry] = val;
        this.entry++;
        this._size++;
    }

    // Pops the queue and returns the value.
    pop() {
        let ret: T = this._arr[this.exit];
        delete this._arr[this.exit];

        // Checks if the queue has been exhausted. Resets the entry and exit indexes if so.
        // Also resets the number of pop operations to prevent early shifting after resets.
        if (this.entry == this.exit && this.entry != 0) {
            this.entry = 0;
            this.exit = 0;
            this._pops = 0;
        } else {
            this.exit++;
        }
        this._size--;

        // Shift the array over after >20 pop operations to get rid of empty space at the start.
        if (this._pops++ > 20) {
            this.shift();
            this._pops = 0;
        }
        return ret;
    }

    // Removes blank space at the start of the array holding the queue.
    shift() {
        let shifted_arr = [];
        for (let i = 0; i < this._size; i++) {
            shifted_arr[i] = this._arr[i + this.exit];
        }
        this._arr = shifted_arr;
        this.entry = this._size;
        this.exit = 0;
    }

    // Returns the size of the queue.
    size() {
        return this._size;
    }
}

// Dynamic array-based queue implementation.
export class Queue<T> {
    private _arr: T[];
    private entry: number;
    private exit: number;
    private _size: number;

    // Constructor for an array-based implementation of a queue.
    constructor() {
        this._arr = [];
        this.entry = 0;
        this.exit = 0;
        this._size = 0;
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
        if (this.entry == this.exit && this.entry != 0) {
            this.entry = 0;
            this.exit = 0;
        } else {
            this.exit++;
        }

        this._size--;
        return ret;
    }

    // Returns the size of the queue.
    size() {
        return this._size;
    }
}
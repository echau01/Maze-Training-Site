/** 
 * Dynamic array-based queue implementation.
 */
export class Queue<T> {
    private _arr: T[];
    private entry: number;
    private exit: number;

    /**
     * Creates an empty queue.
     */
    constructor() {
        this._arr = [];
        this.entry = 0;
        this.exit = 0;
    }

    /**
     * Pushes an item onto the back of the queue.
     * 
     * @param val the item to push
     */
    push(val: T) {
        this._arr[this.entry] = val;
        this.entry++;
    }

    /**
     * Pops and returns the frontmost element of the queue.
     */
    pop(): T {
        if (this.size() == 0) {
            throw new Error("cannot call pop on an empty queue");
        }

        const ret: T = this._arr[this.exit];
        this.exit++;

        if (this.exit > this._arr.length / 2) {
            this._arr = this._arr.slice(this.exit);
            this.entry -= this.exit;
            this.exit = 0;
        }

        return ret;
    }

    /**
     * Returns the number of elements in the queue.
     */
    size(): number {
        return this.entry - this.exit;
    }
}
/**
 * Swaps the elements at index1 and index2 of the given array.
 * 
 * @param {any[]} arr the array to perform the swap on
 * @param {number} index1 the index of the first element to swap
 * @param {number} index2 the index of the second element to swap
 */
function swap(arr: any[], index1: number, index2: number): void {
    const temp: any = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

/**
 * Represents an element in a priority queue.
 */
export class PriorityQueueElement<T> {
    private data: T;
    private priority: number;

    /**
     * Create a priority queue element with the given priority that contains the given data.
     * 
     * @param {T} data the data this element contains
     * @param {number} priority the priority of the element
     */
    constructor(data: T, priority: number) {
        this.data = data;
        this.priority = priority;
    }

    /**
     * Returns the data stored in this priority queue element.
     */
    getData(): T {
        return this.data;
    }

    /**
     * Returns the priority of this priority queue element.
     */
    getPriority(): number {
        return this.priority;
    }
}

/**
 * A priority queue implemented as a 0-indexed binary minheap.
 */
export class PriorityQueue<T> {
    private heap: PriorityQueueElement<T>[]
    private _size: number;

    /**
     * Constructs a priority queue with the given PriorityQueueElements. If no parameter is passed
     * in to the constructor, an empty priority queue is created.
     *
     * @param {PriorityQueueElement<T>[]} [queueElements] the elements of the priority queue to be constructed
     */
    constructor(queueElements?: PriorityQueueElement<T>[]) {
        if (queueElements === undefined) {
            this.heap = [];
            this._size = 0;
        } else {
            this.heap = queueElements.slice();
            this._size = queueElements.length;

            this.buildHeap();
        }
    }

    /**
     * Inserts the given element with specified priority into the priority queue.
     *
     * @param {T} element the element to insert
     * @param {number} priority the priority of the element
     */
    insert(element: T, priority: number): void {
        this.heap.push(new PriorityQueueElement<T>(element, priority));
        this._size += 1;
        this.heapifyUp(this._size - 1);
    }

    /**
     * Removes and returns the element with minimum priority in the queue.
     */
    removeMin(): T {
        swap(this.heap, 0, this._size - 1);
        this._size -= 1;

        return this.heap.pop().getData();
    }

    /**
     * Returns the number of elements in this priority queue.
     */
    size(): number {
        return this._size;
    }

    /**
     * Converts this.heap to a binary minheap.
     */
    private buildHeap(): void {
        for (let i = Math.floor((this._size - 2) / 2); i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    private parent(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private leftChild(index: number): number {
        return 2 * index + 1;
    }

    private rightChild(index: number): number {
        return 2 * index + 2;
    }

    private heapifyUp(index: number): void {
        while (index !== 0) {
            const parent: number = this.parent(index);

            if (this.heap[index].getPriority() < this.heap[parent].getPriority()) {
                swap(this.heap, index, parent);
                index = parent;
            } else {
                break;
            }
        }
    }

    private heapifyDown(index: number): void {
        while (index <= Math.floor((this._size - 2) / 2)) {
            const leftIdx: number = this.leftChild(index);
            const rightIdx: number = this.rightChild(index);
            
            let minIdx: number;
            if (rightIdx < this._size) {
                if (this.heap[leftIdx].getPriority() < this.heap[rightIdx].getPriority()) {
                    minIdx = leftIdx;
                } else {
                    minIdx = rightIdx;
                }
            } else {
                minIdx = leftIdx;
            }

            if (this.heap[index].getPriority() > this.heap[minIdx].getPriority()) {
                swap(this.heap, index, minIdx);
                index = minIdx;
            } else {
                break;
            }
        }
    }
}

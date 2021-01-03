/**
 * Swaps the elements at index1 and index2 of this array.
 * 
 * @param {number} index1 the index of the first element to swap
 * @param {number} index2 the index of the second element to swap
 */
Array.prototype.swap = function(index1, index2) {
    const temp = this[index1];
    this[index1] = this[index2];
    this[index2] = temp;
}

/**
 * Represents an element in a priority queue.
 */
class PriorityQueueElement {
    /**
     * Create a priority queue element with the given priority that contains the given data.
     * 
     * @param {any} data the data this element contains
     * @param {number} priority the priority of the element
     */
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
}

/**
 * A priority queue implemented as a 0-based binary minheap.
 */
export default class PriorityQueue {
    /**
     * Constructs a priority queue with the given PriorityQueueElements. If no parameter is passed
     * in to the constructor, an empty priority queue is created.
     *
     * @param {PriorityQueueElement[]} [queueElements] the elements of the priority queue to be constructed
     */
    constructor(queueElements) {
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
     * @param {any} element the element to insert
     * @param {number} priority the priority of the element
     */
    insert(element, priority) {
        this.heap.push(new PriorityQueueElement(element, priority));
        this._size += 1;
        this.heapifyUp(this._size - 1);
    }

    /**
     * Removes and returns the element with minimum priority in the queue.
     */
    removeMin() {
        this.heap.swap(0, this._size - 1);
        this._size -= 1;

        return this.heap.pop().data;
    }

    /**
     * Returns the number of elements in this priority queue.
     */
    size() {
        return this._size;
    }

    /**
     * Converts this.heap to a binary minheap.
     */
    buildHeap() {
        for (let i = Math.floor((this._size - 2) / 2); i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChild(index) {
        return 2 * index + 1;
    }

    rightChild(index) {
        return 2 * index + 2;
    }

    heapifyUp(index) {
        while (index !== 0) {
            let parent = this.parent(index);
            if (this.heap[index].priority < this.heap[parent].priority) {
                this.heap.swap(index, parent);
                index = parent;
            } else {
                break;
            }
        }
    }

    heapifyDown(index) {
        while (index <= Math.floor((this._size - 2) / 2)) {
            let leftIdx = this.leftChild(index);
            let rightIdx = this.rightChild(index);

            let minIdx;
            if (rightIdx < _size) {
                minIdx = this.heap[leftIdx].priority < this.heap[rightIdx].priority ? leftIdx : rightIdx;
            } else {
                minIdx = leftIdx;
            }

            if (this.heap[index].priority > this.heap[minIdx].priority) {
                this.heap.swap(index, minIdx);
                index = minIdx;
            } else {
                break;
            }
        }
    }
}

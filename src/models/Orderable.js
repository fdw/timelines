export class Orderable {
  left () {}

  right () {}

  orderByStart (other) {
    return this.left().isBefore(other.left()) ? -1
      : this.left().isAfter(other.left()) ? 1
        : 0

  }
}


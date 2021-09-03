/** A very simple time-based in-memory cache. */
export class Memoized<T> {
  private data: T | undefined;
  private timestamp: number | undefined;

  /**
   * @param getData The function to memoize.
   * @param maxAgeSeconds The number of seconds to maintain its output for.
   */
  constructor(
    private readonly getData: () => Promise<T>,
    public readonly maxAgeSeconds: number,
  ) {}

  /**
   * Returns cached data if available and not older than `maxAgeSeconds`,
   * retrieves and returns fresh data otherwise.
   */
  async get(): Promise<T> {
    if (this.timestamp === undefined) {
      await this.refresh();
    }

    const diffMs = this.timestamp! - new Date().getTime();
    const diff = diffMs / 1000;

    if (diff > this.maxAgeSeconds) {
      await this.refresh();
    }

    return this.data!;
  }

  /** Retrieves fresh data and updates the internal timestamp. */
  async refresh() {
    this.data = await this.getData();
    this.timestamp = new Date().getTime();
  }
}

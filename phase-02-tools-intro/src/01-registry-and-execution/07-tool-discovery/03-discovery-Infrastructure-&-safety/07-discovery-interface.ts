// contract.ts

/**
 * Enterprise Rule Book for all discoverers.
 * Kal ko agar local disk se AWS S3 par bhi shift karein, toh contract same rahega.
 */
export interface IToolDiscoverer {
  /**
   * Is function ko path do, yeh bina fail hue tool files ke absolute paths ka array dega.
   */
  discover(dirPath: string): Promise<string[]>;
}

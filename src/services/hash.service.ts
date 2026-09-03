import bcrypt from 'bcrypt';

export class HashService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashes a plain text password using bcrypt.
   * @param password The plain text password to hash
   * @returns A promise that resolves to the hashed password string
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a hash.
   * @param password The plain text password
   * @param hash The hashed password from the database
   * @returns A promise that resolves to true if they match, false otherwise
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

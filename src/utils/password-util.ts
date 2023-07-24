import bcrypt from 'bcrypt';

export class PasswordUtil {
  static async hash(
    password: string,
    saltOnRounds: number = 10
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltOnRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
  }
}

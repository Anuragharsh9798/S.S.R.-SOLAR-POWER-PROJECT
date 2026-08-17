import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service {
  /**
   * Hashes plain text password using Argon2id algorithm.
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 iterations
      parallelism: 4,    // 4 threads
    });
  }

  /**
   * Verifies plain text password against Argon2id hash.
   */
  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}

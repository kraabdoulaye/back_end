import jwt from 'jsonwebtoken';

export class JwtHelper {
  private readonly secret: string;

  constructor(secret: string = "P@ssword0") {
    this.secret = secret;
  }

  createToken(payload: object, expiresIn: string | number = '1h'): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  authenticate(request: { headers: { authorization?: string } }): any {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Token manquant');

      const payload = this.verifyToken(token);
      return payload;
    } catch (error) {
      throw new Error('Non autorisé');
    }
  }

  
}


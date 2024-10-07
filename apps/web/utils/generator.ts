import { randomBytes } from 'crypto';

export function generateId() {
  const buffer = randomBytes(5); 
  const id = parseInt(buffer.toString('hex'), 16).toString().slice(0, 10);
  return id;
}
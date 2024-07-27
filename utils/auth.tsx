const DEVELOPER_TOKEN = process.env.DEVELOPER_TOKEN;

export function isDeveloper(token: string): boolean {
  if (typeof DEVELOPER_TOKEN !== 'string') {
    console.warn('DEVELOPER_TOKEN is not set or is not a string');
    return false;
  }
  return token === DEVELOPER_TOKEN;
}
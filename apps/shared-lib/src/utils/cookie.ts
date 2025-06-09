/**
 * Utility functions for managing cookies
 */

/**
 * Sets a cookie with the given name and value
 * @param name Cookie name
 * @param value Cookie value
 * @param maxAge Maximum age in seconds (optional)
 * @param path Cookie path (default: '/')
 * @param secure Whether the cookie should be secure (default: true in production)
 * @param sameSite SameSite attribute (default: 'Lax')
 */
export const setCookie = (
  name: string,
  value: string,
  maxAge?: number,
  path = '/',
  secure = import.meta.env.PROD,
  sameSite = 'Lax'
): void => {
  const expires = maxAge ? new Date(Date.now() + maxAge * 1000).toUTCString() : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${maxAge ? `; expires=${expires}` : ''}; path=${path}${secure ? '; secure' : ''}; samesite=${sameSite}`;
};

/**
 * Gets a cookie by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  
  if (!cookie) return null;
  
  return decodeURIComponent(cookie.split('=')[1]);
};

/**
 * Checks if a cookie exists
 * @param name Cookie name
 * @returns true if cookie exists, false otherwise
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Removes a cookie by name
 * @param name Cookie name
 * @param path Cookie path (default: '/')
 */
export const removeCookie = (name: string, path = '/'): void => {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Returns all cookies as an object
 * @returns Object with all cookies
 */
export const getAllCookies = (): Record<string, string> => {
  return document.cookie
    .split('; ')
    .reduce((acc: Record<string, string>, cookie: string) => {
      const [name, value] = cookie.split('=');
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {});
};

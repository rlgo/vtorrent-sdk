import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

export function createAxios({
  url,
  config,
  cookieJar,
}: {
  url: string;
  config?: any;
  cookieJar?: CookieJar;
}) {
  cookieJar = cookieJar ?? new CookieJar();
  const instance = axios.create({
    baseURL: url,
    jar: cookieJar,
    ...config,
  });
  return wrapper(instance);
}

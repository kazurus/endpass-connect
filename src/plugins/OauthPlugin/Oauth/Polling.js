// @ts-check
import queryStringToMap from '@endpass/utils/queryStringToMap';
import ConnectError from '@/class/ConnectError';

const { ERRORS } = ConnectError;
const replaceReg = /^#\/?/;
const CHECK_TIMEOUT = 500;

export default class Polling {
  static ALLOWED_FIELDS = ['state', 'error', 'code'];

  /**
   * @param {import('@/plugins/OauthPlugin/FrameStrategy').default} frame Frame Strategy for show frame
   */
  constructor(frame) {
    this.frame = frame;
    this.intervalId = null;
  }

  /**
   *
   * @param {string} url
   * @return {Promise<{state?: string, error?: string, code?: string}>}
   */
  getResult(url) {
    return new Promise((resolve, reject) => {
      this.intervalId = window.setInterval(() => {
        const { target } = this.frame;

        try {
          if (!target || target.closed !== false) {
            this.close();

            reject(ConnectError.create(ERRORS.OAUTH_POPUP_CLOSED));
            return;
          }

          if (
            target.location.href === url ||
            target.location.pathname === 'blank'
          ) {
            return;
          }

          const targetHash = target.location.hash.replace(replaceReg, '');
          const targetSearch = target.location.search.replace(replaceReg, '');

          const params = queryStringToMap(targetHash || targetSearch);

          const filteredParams = Object.keys(params)
            .filter(key => Polling.ALLOWED_FIELDS.includes(key))
            .reduce(
              (obj, key) => ({
                [key]: params[key],
                ...obj,
              }),
              {},
            );

          if (Object.keys(filteredParams).length === 0) {
            return;
          }

          resolve(filteredParams);
          this.close();
        } catch (error) {}
      }, CHECK_TIMEOUT);
    });
  }

  close() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.frame.close();
  }
}

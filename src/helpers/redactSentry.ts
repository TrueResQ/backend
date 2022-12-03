import { Event } from "@sentry/node";
import { redactEventData } from "@toruslabs/loglevel-sentry";

const reURL = /\/auth\/.*/i;

export default (event: Event): Event => {
  if (!event.request) return event;

  if (reURL.test(event.request.url)) {
    // Redact body for sensitive URLs.
    event.request.data = "***";
  }

  // Redact sensitive headers.
  event.request.headers = redactEventData(event.request.headers);

  return event;
};

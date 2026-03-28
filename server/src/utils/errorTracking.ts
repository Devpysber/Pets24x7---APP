// server/src/utils/errorTracking.ts

/**
 * Simple error tracking utility.
 * In a real production app, this would integrate with Sentry, LogRocket, or similar.
 */
export const trackError = (error: any, context?: any) => {
  // Log to console for now
  console.error('--- ERROR TRACKED ---');
  console.error('Message:', error.message || error);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  if (context) {
    console.error('Context:', JSON.stringify(context, null, 2));
  }
  
  // Example: Sentry.captureException(error, { extra: context });
};

export const initErrorTracking = () => {
  // Example: Sentry.init({ dsn: process.env.SENTRY_DSN });
  console.log('Error tracking initialized');
};

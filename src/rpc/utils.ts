import { Observable, of, throwError } from 'rxjs';
import { mergeMap, scan, catchError } from 'rxjs/operators';
import { getLogger } from '../Logger';

export const configureRetryOnError = (
    retryTimes: number = Number.POSITIVE_INFINITY,
    canRetry: (error: any) => Observable<any> | void,
) => (err$: Observable<any>) => {
    return err$.pipe(
        mergeMap(error => {
            const canRetry$ = canRetry(error);
            if (canRetry$) {
                return canRetry$;
            }
            return throwError(error);
        }),
        scan<any, { accumulator: number; error: any }>(
            (acc, error) => {
                const { accumulator } = acc;
                return {
                    accumulator: accumulator + 1,
                    error,
                };
            },
            { accumulator: 0, error: null },
        ),
        mergeMap(({ accumulator, error }) => {
            if (accumulator >= retryTimes) {
                return throwError(error);
            }
            return of(error);
        }),
        catchError(error => {
            return throwError(error);
        }),
    );
};

export const configureRetryOnTimeout = (retryTimes: number = Number.POSITIVE_INFINITY, notifier?: Observable<any>) => {
    return configureRetryOnError(retryTimes, error => {
        const val = error.name && error.name === 'TimeoutError';
        if (val) {
            getLogger().log('TimeoutError... Can Retry');
            return notifier ? notifier : of(val);
        }
    });
};

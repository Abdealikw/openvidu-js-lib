import { Observable } from 'rxjs';
export declare const configureRetryOnError: (
    retryTimes: number | undefined,
    canRetry: (error: any) => void | Observable<any>,
) => (err$: Observable<any>) => Observable<any>;
export declare const configureRetryOnTimeout: (
    retryTimes?: number,
    notifier?: Observable<any> | undefined,
) => (err$: Observable<any>) => Observable<any>;
//# sourceMappingURL=utils.d.ts.map

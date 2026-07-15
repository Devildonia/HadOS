/**
 * COMPUTE DEMO WORKER (process runtime, guest side)
 * Runs off the main thread. Uses the App Runtime SDK, which handles the IPC
 * protocol (ready, ping/pong, request routing) so this file only declares its
 * request handlers. Phase 1.x.
 *
 * `compute:primes` finds the first N primes (chunked with yields so the worker
 * keeps answering pings while computing). `compute:hang` blocks forever — used
 * to demonstrate the watchdog killing an unresponsive process.
 */

import { createWorkerRuntime } from '../sdk/appRuntime';

/** Chunked prime sieve that yields to the event loop so pings stay answered. */
async function firstNPrimes(n: number): Promise<number[]> {
    const primes: number[] = [];
    let candidate = 2;
    let sinceYield = 0;
    while (primes.length < n) {
        let isPrime = true;
        for (let i = 0; i < primes.length; i++) {
            const p = primes[i];
            if (p === undefined) break;
            if (p * p > candidate) break;
            if (candidate % p === 0) { isPrime = false; break; }
        }
        if (isPrime) primes.push(candidate);
        candidate++;
        if (++sinceYield >= 5_000) {
            sinceYield = 0;
            await new Promise<void>(r => setTimeout(r, 0)); // yield
        }
    }
    return primes;
}

createWorkerRuntime()
    .on('compute:primes', async (payload) => {
        const count = Math.max(1, Math.min(100_000, Number((payload as any)?.count) || 1000));
        const primes = await firstNPrimes(count);
        return { count: primes.length, last: primes[primes.length - 1] };
    })
    .on('compute:hang', () => {
        // Intentional infinite loop: never returns, never pongs → watchdog kills it.
        // eslint-disable-next-line no-constant-condition
        while (true) { /* block forever */ }
    })
    .start();

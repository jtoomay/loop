package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

var (
	generalLimiter *limiter.Limiter
)

func init() {
	store := memory.NewStore()

	// General rate limit: 100 requests per minute per IP (for all endpoints)
	generalLimiter = limiter.New(store, limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  100,
	})
}

// RateLimitHTTP is an HTTP middleware that rate limits requests
func RateLimitHTTP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get client IP
		ip := getClientIPFromRequest(r)

		// Check rate limit
		limiterCtx, err := generalLimiter.Get(r.Context(), ip)
		if err != nil {
			// Continue on error (don't block requests)
			next.ServeHTTP(w, r)
			return
		}

		if limiterCtx.Reached {
			w.Header().Set("X-RateLimit-Limit", "100")
			w.Header().Set("X-RateLimit-Remaining", "0")
			w.Header().Set("X-RateLimit-Reset", time.Unix(limiterCtx.Reset, 0).Format(time.RFC1123))
			w.Header().Set("Retry-After", time.Unix(limiterCtx.Reset, 0).Format(time.RFC1123))
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"errors":[{"message":"Rate limit exceeded. Please try again later.","extensions":{"code":"RATE_LIMIT_EXCEEDED"}}]}`))
			return
		}

		// Set rate limit headers
		w.Header().Set("X-RateLimit-Limit", "100")
		w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", limiterCtx.Remaining))

		next.ServeHTTP(w, r)
	})
}

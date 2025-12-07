package auth

import (
	"context"
	"crypto/rsa"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrNoAuthHeader = errors.New("no authorization header")
	ErrInvalidToken = errors.New("invalid or expired token")
)

type contextKey string

const (
	UserKey contextKey = "user"
	DBKey   contextKey = "db"
)

type User struct {
	ID string `json:"id"`
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

var (
	privateKey *rsa.PrivateKey
	publicKey  *rsa.PublicKey
)

func Init() {
	privateBytes, err := os.ReadFile("private.pem")
	if err != nil {
		log.Fatal("missing private.pem")
	}
	privateKey, err = jwt.ParseRSAPrivateKeyFromPEM(privateBytes)
	if err != nil {
		log.Fatal(err)
	}

	publicBytes, err := os.ReadFile("public.pem")
	if err != nil {
		log.Fatal("missing public.pem")
	}
	publicKey, err = jwt.ParseRSAPublicKeyFromPEM(publicBytes)
	if err != nil {
		log.Fatal(err)
	}
}

// GenerateAccessToken generates a short-lived access token (15-30 minutes)
func GenerateAccessToken(userID string) (string, error) {
	expiration := 15 * time.Minute // Short-lived for security
	if minutes := os.Getenv("JWT_ACCESS_EXPIRES_MINUTES"); minutes != "" {
		if m, err := strconv.Atoi(minutes); err == nil {
			expiration = time.Duration(m) * time.Minute
		}
	}

	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "loop-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return token.SignedString(privateKey)
}

func GetUserFromContext(ctx context.Context) (*User, error) {
	user, ok := ctx.Value(UserKey).(*User)
	if !ok || user == nil {
		return nil, ErrInvalidToken
	}
	return user, nil
}

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		// Expect "Bearer <token>"
		var tokenStr string
		if len(authHeader) > 7 && strings.ToLower(authHeader[:6]) == "bearer" {
			tokenStr = authHeader[7:]
		} else {
			tokenStr = authHeader
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
			return publicKey, nil
		})

		if err != nil || !token.Valid {
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), UserKey, nil)))
			return
		}

		user := &User{ID: claims.UserID}
		ctx := context.WithValue(r.Context(), UserKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

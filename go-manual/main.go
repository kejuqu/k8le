package main

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
    TokenUserInfo
    jwt.StandardClaims
}

type TokenUserInfo struct {
    TenantId   string `json:"tenant_id"`
    UserId     string `json:"user_id"`
    IsMainUser bool   `json:"is_main_user"`
}

var CustomSecret = []byte("console.xiaoduoai")
var TokenExpireDuration = 24 * 2 * time.Hour


func GenTenantToken(tenantId, userId string, isMainUser bool) (string, error) {
    c := CustomClaims{
       TokenUserInfo: TokenUserInfo{
          TenantId:   tenantId,
          UserId:     userId,
          IsMainUser: isMainUser,
       },
       StandardClaims: jwt.StandardClaims{
          ExpiresAt: time.Now().Add(TokenExpireDuration).Unix(),
          Issuer:    "xxx.xxx.com",
       },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
    return token.SignedString(CustomSecret)
}

func ParseCustomToken(tokenString string) (*CustomClaims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (i interface{}, err error) {
       return CustomSecret, nil
    })
    if err != nil {
       return nil, err
    }
    if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
       return claims, nil
    }
    return nil, errors.New("invalid token")
}

func main() {
    // Example usage
    token, _ := GenTenantToken("q-62331bf521774b174b35f079", "", true)

    fmt.Println(token)

    // 然后根据生成的 token 请求
    // curl --location --request POST 'https://2f4a835da44d2461.wangwang4-mini.1yangai.com/api/en-agent/xdapp_front/v1/permission/tenant_permission' \
    // --header 'Content-Type: application/json' \
    // --data-raw '{
        // "product_key": "agent-cloud-pro",
        // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJxLTYyMzMxYmY1MjE3NzRiMTc0YjM1ZjA3OSIsInVzZXJfaWQiOiIiLCJpc19tYWluX3VzZXIiOnRydWUsImV4cCI6MTc1Mzg2ODk4NSwiaXNzIjoiY29uc29sZS54aWFvZHVvYWkuY29tIn0.2ytwF_skAVlp_f6-55nmkVpbM32xhyOlUjYmAzaWqaw"
    // }'
}
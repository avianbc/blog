+++
date = 2023-08-24T10:49:47-04:00
title = "Serving an Angular CLI App over HTTPS Made Easy"
categories = ['Programming', 'Angular']
+++

I've discovered a simpler method than those discussed in [this Stack Overflow post](https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https) for serving an Angular CLI app over HTTPS using [office-addin-dev-certs](https://www.npmjs.com/package/office-addin-dev-certs):

1. Generate the certificates by running the following command and click "Yes" to trust them when prompted:
   - `npx office-addin-dev-certs install --days 365`
2. You'll find the generated certificates (`localhost.crt` and `localhost.key`) in your home folder `~\.office-addin-dev-certs`
   - Copy them to your angular project: `cp ~\.office-addin-dev-certs\localhost.* .`
   - Don't forget to add them to your `.gitignore`
3. Use these certificates with Angular by running:
   - Run `ng serve --ssl --ssl-key localhost.key --ssl-cert localhost.crt`

Alternatively, add them to your `angular.json` so you can run `ng serve` as usual:

```json
"serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
        "development": {
            "browserTarget": "blank16:build:development",
            "ssl": true,
            "sslKey": "localhost.key",
            "sslCert": "localhost.crt"
        }
    },
    "defaultConfiguration": "development"
},
```

## Automate it

I've even created a PowerShell script that will install the certificates and copy them to your project. Adding this to my repo enabled team members to just clone it and run `.\tools\install-certs.ps1` to get https immediately working:

```powershell
if (-Not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Error "node/npm is not installed, please install node and try again..."
  exit 1
}

$certExpirationDays = 365
$certPath = "$HOME\.office-addin-dev-certs\localhost.crt"
$keyPath = "$HOME\.office-addin-dev-certs\localhost.key"

Write-Host "Installing cert for current user..."
npx office-addin-dev-certs install --days $certExpirationDays
Copy-Item $certPath,$keyPath $PSScriptRoot -Force -Verbose
npx office-addin-dev-certs verify
```

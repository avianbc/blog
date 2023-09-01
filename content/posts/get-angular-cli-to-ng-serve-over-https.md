+++
draft = true
date = 2023-08-24T10:49:47-04:00
title = "Get angular CLI to serve over HTTPS much easier than you think"
categories = ['Programming', 'Angular']
+++

I found a much easier way than any of the methods listed in [this stackoverflow post](https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https) to serve an angular CLI app over HTTPS using [office-addin-dev-certs](https://www.npmjs.com/package/office-addin-dev-certs):

1. Run this command to generate the certs and click "Yes" to trust them when it prompts you:
   - `npx office-addin-dev-certs install --days 365`
2. The generated certs (`localhost.crt` and `localhost.key`) will be in your home folder `~\.office-addin-dev-certs`
   - Copy them to your angular project: `cp ~\.office-addin-dev-certs\localhost.* .`
   - You probably want to add them to your `.gitignore` as well
3. Feed the certs to angular:
   - Run `ng serve --ssl --ssl-key localhost.key --ssl-cert localhost.crt`
   - Or add them to your `angular.json` so you can run `ng serve` as normal:

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

## Automate it with powershell

I actually ended up writing a powershell script that I stuffed into my nx `tools` folder that allowed team members to just clone the repo and run `.\tools\install-certs.ps1` to get https immediately working.

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

Copy-Item $certPath,$keyPath $PSScriptRoot -Force -Verbose # copy generated cert to tools folder
npx office-addin-dev-certs verify
```

# puppeteer-smbc

## About
- Automatically Log-in to your SMBC-InternetBanking Account
- Get your current balance

## Usage

### Construct environment
```shell
$ mkdir puppeteer-smbc
$ cd puppeteer-smbc
$ npm install
$ touch .env
$ vi .env
```

### Edit `.env`
```
BRANCH_CODE=000 # your branch code (3 digits)
ACCOUNT_NUMBER=0000000 # your account number (7 digits)
PASSWORD=0000 # your password (4 digits)
```

### Run
```
$ npm run start
```

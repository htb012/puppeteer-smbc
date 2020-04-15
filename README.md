# About

- 三井住友銀行インターネットバンキングSMBCダイレクト口座に自動ログインし、口座残高を取得
- 参考：[Qiita 三井住友銀行口座の残高を自動取得する（Puppeteerで）](https://qiita.com/embokoir/items/e4bd329c9ca9f57d631e)

## Usage

### Construct environment
```shell
$ git clone https://github.com/embokoir/puppeteer-smbc.git
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

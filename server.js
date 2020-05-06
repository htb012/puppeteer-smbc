const puppeteer = require('puppeteer')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const port = 3000

app.get('/balance', async (req, res) => {
  const client = req.query.client
  if (client === 'gas') {
    res.send('Glitch woke up')
    return
  }

  const balance = await fetchBalance()
  res.send(balance)
})

app.listen(port, () => console.log(`Listening at ${port}...`))

const BRANCH_CODE = process.env.BRANCH_CODE
const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER
const PASSWORD = process.env.PASSWORD

async function fetchBalance()  {
  // validate .env
  if (!BRANCH_CODE || !ACCOUNT_NUMBER || !PASSWORD) {
    console.log('Invalid Try. Make sure to create a file ".env" and write your BRANCH_CODE / ACCOUNT_NUMBER / PASSWORD')
    return
  }

  // launch browser
  console.log('launching browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  // go to page
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 2000 })
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ja'
  })
  const LOGIN_URL = 'https://direct.smbc.co.jp/aib/aibgsjsw5001.jsp'
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' })

  // set input-data then submit
  await page.type('input[name=S_BRANCH_CD]', BRANCH_CODE)
  await page.type('input[name=S_ACCNT_NO]', ACCOUNT_NUMBER)
  await page.type('input[name=PASSWORD]', PASSWORD)
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('input[type=submit]')
  ]).catch(async err => {
    console.log('ログイン失敗')
    console.log(err.response)
    return '!warning ログイン失敗'
  })

  // redirect to balance-page then get balance
  await page.goto('https://direct3.smbc.co.jp/servlet/com.smbc.SUPRedirectServlet')
  const balance = await page.$eval('.fRight', elm => elm.textContent.replace(/\s/g, ''))
        .catch(async err => {
          console.log(err)
          return '残高取得失敗'
        })
  console.log(`Your current balance is ${balance}`)

  // close browser
  await browser.close()
  return balance
}

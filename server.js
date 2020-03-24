const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
dotenv.config()

const BRANCH_CODE = process.env.BRANCH_CODE
const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER
const PASSWORD = process.env.PASSWORD;

(async () => {
    // validate .env
    if (!BRANCH_CODE || !ACCOUNT_NUMBER || !PASSWORD) {
        console.log('Invalid Try. Make sure to create a file ".env" and write your BRANCH_CODE / ACCOUNT_NUMBER / PASSWORD')
        return
    }

    // launch browser
    console.log('launching browser...')
    const browser = await puppeteer.launch({
        headless: false,
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
        console.log(err.response)
        process.exit(1)
    })

    // redirect to balance-page then get balance
    await page.goto('https://direct3.smbc.co.jp/servlet/com.smbc.SUPRedirectServlet')
    const balance = await page.$eval('.fRight', elm => elm.textContent.replace(/\s/g, ''))
          .catch(async err => {
              console.log(err)
              process.exit(1)
          })
    console.log(`Your current balance is ${balance}`)

    // close browser
    await browser.close()
})()

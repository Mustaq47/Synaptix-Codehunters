const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('Starting full website test...');
    try {
        const downloadPath = path.join(__dirname, 'temp_dl_full');
        if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        let errorCount = 0;
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('[BROWSER ERROR]:', msg.text());
                errorCount++;
            }
        });
        page.on('pageerror', err => {
            console.error('[BROWSER EXCEPTION]:', err.message);
            errorCount++;
        });

        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });

        console.log('1. Loading http://localhost:3030...');
        await page.goto('http://localhost:3030');
        await page.waitForSelector('.create-btn', { visible: true });

        console.log('Waiting for Firebase Auth to initialize...');
        await new Promise(r => setTimeout(r, 3000));

        console.log('2. Creating Profile...');
        await page.type('#nameInput', 'QA Tester');
        await page.click('.avatar-opt:first-child');
        await page.click('.title-opt:first-child');
        await page.click('.create-btn');

        console.log('Waiting for Screen Transition...');
        await new Promise(r => setTimeout(r,));

        console.log('3. Selecting Java...');
        await page.waitForSelector('#langJava', { visible: true, timeout: 5000 });
        await page.click('#langJava');
        await page.click('.lang-start-btn');

        console.log('Waiting for AI generation and game start...');
        await new Promise(r => setTimeout(r,));

        console.log('4. Playing Game...');
        await page.waitForSelector('.opt', { visible: true, timeout: 20000 });
        await page.click('.opt:first-child');
        await page.click('.primary-btn[onclick="submitAnswer()"]');
        await new Promise(r => setTimeout(r,));

        console.log('5. Opening Profile Panel...');
        await page.click('.profile-chip');
        await page.waitForSelector('#profilePanel', { visible: true });
        await new Promise(r => setTimeout(r,));
        await page.click('.panel-close');
        await new Promise(r => setTimeout(r,));

        console.log('6. Triggering Career Export (PDF, CSV) from Right Sidebar...');
        await page.click('.action-btn.secondary[onclick="exportProfileReport(\\\'pdf\\\')"]');
        await page.click('.action-btn.secondary[onclick="exportProfileReport(\\\'csv\\\')"]');
        await new Promise(r => setTimeout(r,));

        console.log('7. Quitting game to trigger Assessment Report...');
        await page.click('.quit-btn');
        await page.waitForSelector('#quitModal', { visible: true });
        await new Promise(r => setTimeout(r,));
        await page.click('.quit-confirm-btn');

        console.log('8. Waiting for Assessment Report screen...');
        await page.waitForSelector('#reportArea', { visible: true });
        await new Promise(r => setTimeout(r,));

        console.log('9. Triggering Session Report Exports...');
        await page.click('.action-btn.secondary[onclick="exportReport(\\\'pdf\\\')"]');
        await page.click('.action-btn.secondary[onclick="exportReport(\\\'xml\\\')"]');

        await new Promise(r => setTimeout(r,));

        const files = fs.readdirSync(downloadPath);
        console.log('\n--- Test Summary ---');
        console.log('Frontend Errors log count:', errorCount);
        console.log('Downloaded Files successfully:', files.length > 0 ? files : 'None');

        files.forEach(f => fs.unlinkSync(path.join(downloadPath, f)));
        fs.rmdirSync(downloadPath);

        await browser.close();

        if (errorCount <= 2 && files.length >= 4) {
            console.log('✅ ALL TESTS PASSED SUCCESSFULLY.');
        } else {
            console.error('❌ SOME TESTS FAILED.');
            process.exit(1);
        }
    } catch (e) {
        console.error('Test script crashed:', e.message);
        process.exit(1);
    }
})();

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const downloadPath = path.join(__dirname, 'temp_dl');
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
        });

        console.log('Navigating to app...');
        await page.goto('http://localhost:3030');

        console.log('Injecting mock data and calling export functions...');
        await page.evaluate(async () => {
            window.currentReportStats = {
                score100: 85,
                acc: 90,
                xp: 1500,
                hiStreak: 5,
                topicStats: {
                    'Arrays': { correct: 5, total: 5 },
                    'Loops': { correct: 2, total: 5 }
                },
                lang: 'java',
                rankName: 'Silver',
                totalAnswered: 10,
                totalCorrect: 7
            };
            window.currentReportProfile = {
                name: 'Test',
                title: 'Tester',
                avatar: '🤖'
            };

            console.log('Testing PDF export...');
            try {
                await window.exportReport('pdf');
            } catch (e) {
                console.error('PDF error:', e.message);
            }

            console.log('Testing XML export...');
            try {
                await window.exportReport('xml');
            } catch (e) {
                console.error('XML error:', e.message);
            }
        });

        console.log('Waiting for downloads...');
        await new Promise(r => setTimeout(r, 3000));

        const files = fs.readdirSync(downloadPath);
        console.log('Downloaded files:', files);

        await browser.close();
    } catch (e) {
        console.error('Test script failed:', e.message);
        process.exit(1);
    }
})();

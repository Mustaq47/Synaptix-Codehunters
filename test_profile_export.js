const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const downloadPath = path.join(__dirname, 'temp_dl_profile');
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

        console.log('Injecting mock profile/history data and triggering profile exports...');
        await page.evaluate(async () => {
            // Mock profile
            const p = {
                name: 'TestMaster',
                title: 'Senior Dev',
                avatar: '💻',
                totalXP: 5000,
                gamesPlayed: 10,
                bestScore: 100,
                totalCorrect: 45,
                totalAnswered: 50,
                highestStreak: 12,
                bestRank: 'Gold I'
            };

            // Mock history
            const h = [
                { date: Date.now(), lang: 'java', score100: 90, accuracy: 95, xp: 500 },
                { date: Date.now() - 86400000, lang: 'python', score100: 100, accuracy: 100, xp: 600 }
            ];

            const mod = await import('./src/js/export.js');

            console.log('Testing Profile PDF export...');
            try {
                await mod.downloadProfilePDF(p, h);
            } catch (e) {
                console.error('PDF error:', e.message);
            }

            console.log('Testing Profile CSV export...');
            try {
                await mod.downloadProfileCSV(p, h);
            } catch (e) {
                console.error('CSV error:', e.message);
            }

            console.log('Testing Profile XML export...');
            try {
                await mod.downloadProfileXML(p, h);
            } catch (e) {
                console.error('XML error:', e.message);
            }
        });

        console.log('Waiting for downloads...');
        await new Promise(r => setTimeout(r, 4000));

        const files = fs.readdirSync(downloadPath);
        console.log('Downloaded files:', files);

        // Clean up
        files.forEach(f => fs.unlinkSync(path.join(downloadPath, f)));
        fs.rmdirSync(downloadPath);

        await browser.close();
    } catch (e) {
        console.error('Test script failed:', e.message);
        process.exit(1);
    }
})();

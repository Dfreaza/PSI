const Website = require('../models/website');
const Page = require('../models/page');
const { QualWeb } = require('@qualweb/core');
const { generateEARLReport } = require('@qualweb/earl-reporter');

exports.evaluateWebsiteAccessibility = async (req, res) => {
    const websiteId = req.body.website._id;
    console.log(websiteId);
    const pages = req.body.pages; // Array of page URLs to evaluate
    console.log(pages);

    // Create QualWeb instance
    const plugins = { adBlock: true, stealth: true };
    const clusterOptions = { timeout: 60 * 1000 };
    const launchOptions = {};
    const qualweb = new QualWeb(plugins);
    await qualweb.start(clusterOptions, launchOptions);

    try {
        // Fetch website details from database based on websiteId
        const website = await Website.findOne({ _id: websiteId });

        if (!website) {
            return res.status(404).json({ error: 'Website not found' });
        }

        // Initiate accessibility evaluation for each page using QualWeb core
        //this line has done a fucky wucky 
        const evaluationResults = await Promise.all(pages.map(async (pageObject) => {
            const page = await Website.findOne({ url: pageObject.url, website_id: pageObject.website_id });

            try {
                page.status = 'Em avaliação';
                await page.save();

                // Execute accessibility evaluation
                const qualwebOptions = { url: page.url };
                let report;
                try {
                    report = await qualweb.evaluate(qualwebOptions);
                } catch (error) {
                    console.error('Error during QualWeb evaluation:', error);
                    throw error;
                }

                console.log('Report:', report);

                // Check if report is null
                if (report === null) {
                    console.log('Report is null');
                }

                // Generate EARL report
                const earlOptions = {};
                let earlReport;
                try {
                    earlReport = generateEARLReport(report, earlOptions);
                } catch (error) {
                    console.error('Error during EARL report generation:', error);
                    throw error;
                }

                console.log('EARL Report:', earlReport);

                // Check if EARL report is null
                if (earlReport === null) {
                    console.log('EARL Report is null');
                }

                page.evaluationResult = earlReport;
                page.status = earlReport.errors.length === 0 ? 'Conforme' : 'Não conforme';
                await page.save();

                return earlReport;
            } catch (error) {
                page.status = 'Erro na avaliação';
                await page.save();

                return { error };
            }
    }));

        // Stop QualWeb
        await qualweb.stop();

    } catch (error) {
        console.error('Error evaluating accessibility:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
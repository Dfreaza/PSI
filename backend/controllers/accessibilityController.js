const fs = require('fs');
const path = require('path');
const Website = require('../models/website');
const { QualWeb } = require('@qualweb/core');
const { generateEARLReport } = require('@qualweb/earl-reporter');

exports.evaluateWebsiteAccessibility = async (req, res) => {
    const websiteId = req.body.website._id;
    const pages = req.body.pages; // Array of page URLs to evaluate

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

        // Update website status to 'Em avaliação'
        website.status = 'Em avaliação';
        await website.save();

        // Initiate accessibility evaluation for each page using QualWeb core
        const evaluationResults = await Promise.all(pages.map(async (pageObject) => {
            const page = website.pages.find(page => page.url === pageObject.url);

            if (!page) {
                console.log(`Page not found: ${pageObject.url}`);
                return { error: `Page not found: ${pageObject.url}` };
            }

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

            /// Combine the reports
            const combinedReport = {
                report,
                earlReport
            };

            // Generate a unique filename for each page
            const filename = path.join(__dirname, `reports/${pageObject.url.replace(/\/|:/g, '_')}.json`);

            // Check if the report is not empty and the file does not exist
            if ((Object.keys(report).length !== 0 || Object.keys(earlReport).length !== 0) && !fs.existsSync(filename)) {
                // Write the combined report to a new file
                fs.writeFileSync(filename, JSON.stringify(combinedReport, null, 2));
            } else if (fs.existsSync(filename)) {
                console.log('File already exists');
            }

            page.evaluationResult = earlReport;
            if (earlReport && earlReport.errors) {
                page.conformity = earlReport.errors.length === 0 ? 'Conforme' : 'Não conforme';
            } else {
                console.log('EARL report or errors is undefined');
                page.conformity = 'Conforme';
            }
            page.status = 'Avaliado';
            return earlReport;
        }));

        // Check if any page has status 'Erro na avaliação'
        if (website.pages.some(page => page.status === 'Erro na avaliação')) {
            website.status = 'Erro na avaliação';
        } else {
            website.status = 'Avaliado';
        }

        // Save the website document with the updated pages and status
        await website.save();

        // Stop QualWeb
        await qualweb.stop();

    } catch (error) {
        console.error('Error evaluating accessibility:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const fs = require('fs');
const path = require('path');
const Website = require('../models/website');
const { QualWeb } = require('@qualweb/core');
const { url } = require('inspector');
const Statistics = require('../models/statistics');
const reportService = require('./reportService'); // Import the service fil

exports.getStatistics = async (req, res) => {
    try {
        const statistics = await Statistics.find({ websiteId: req.params.websiteId });
        res.json(statistics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


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

        console.log(`Evaluating ${pages.length} pages:`, pages);

        // Initiate accessibility evaluation for each page using QualWeb core
        const evaluationResults = await Promise.all(pages.map(async (pageObject) => {
            
            //variaveis para as estatisticas
            let errorCodes = [];
            let hasErrorsA = false;
            let hasErrorsAA = false;
            let hasErrorsAAA = false;

            const page = website.pages.find(page => page.url === pageObject.url);


            console.log(`Evaluating page: ${pageObject.url}`);

            if (!page) {
                console.log(`Page not found: ${pageObject.url}`);
                return { error: `Page not found: ${pageObject.url}` };
            }

            // Check if the page has already been evaluated
            if (page.status === 'Avaliado') {
                console.log(`Page already evaluated: ${page.url}`);
                return console.log(`Page already evaluated: ${page.url}`);
            }

            // Execute accessibility evaluation
            const qualwebOptions = { url: page.url };
            let report;
            try {
                report = await qualweb.evaluate(qualwebOptions);
                console.log(`Evaluation result for ${pageObject.url}:`, report);
            } catch (error) {
                console.error('Error during QualWeb evaluation:', error);
                throw error;
            }

            // Extract the errors from the evaluation
            let errors = [];
            console.log("ver a pagina ", page.url);
            const pageReport = report[page.url];
            if(pageReport === undefined){
                console.log("Não foi possivel avaliar a página ", page.url);
            }
            else{
                const modules = pageReport.modules;
                for (const moduleName of Object.keys(modules)) {
                    // Skip the 'best-practices' module
                    if (moduleName === 'best-practices') {
                        continue;
                    }
                    const module = report[page.url].modules[moduleName];
                    //console.log("Ver os erros ", module.metadata.failed);

                    //console.log(`Checking module ${moduleName} for errors`);

                    // Check if module.assertions is iterable
                    if (module.assertions && typeof module.assertions === 'object') {
                        // Iterate over the properties of module.assertions
                        for (const assertionName of Object.keys(module.assertions)) {
                            const assertion = module.assertions[assertionName];
                            if (assertion.metadata.outcome === 'failed') {

                                errors.push(assertion);
                                errorCodes.push(assertion.code);

                                for (let criteria of assertion.metadata['success-criteria']) {
                                    let level = criteria.level;
                                    if (level === 'A') {
                                        hasErrorsA = true;
                                    } else if (level === 'AA') {
                                        hasErrorsAA = true;
                                    } else if (level === 'AAA') {
                                        hasErrorsAAA = true;
                                    }
                                }

                            }
                        }
                    } else {
                        console.log(`module.assertions is not iterable for module ${moduleName}`);
                    }
                }
            }

            // Create a new Statistics object for the page
            const statistics = new Statistics({
                idWebsite: website._id,
                idPage: page._id,
                hasErros: errors.length > 0,
                hasErrosA: hasErrorsA,
                hasErrosAA: hasErrorsAA,
                hasErrosAAA: hasErrorsAAA,
                errorList: errorCodes,
            });

            // Save the Statistics object to the database
            try {
                await statistics.save();
                console.log('Statistics saved successfully');
            } catch (err) {
                console.error('Error saving statistics:', err);
            }

            // Check if report is null
            if (report === null) {
                console.log('Report is null');
            }

            // Save the report as a property of the page object
            const reportId = await reportService.saveReportToDatabase(report);
            page.reportId = reportId;

            console.log("report ", report);

            page.evaluationResult = report;
            if (report && report.errors) {
                page.conformity = report.errors.length === 0 ? 'Conforme' : 'Não conforme';
            } else {
                console.log('Report or errors is undefined');
                page.conformity = 'Conforme';
            }
            page.status = 'Avaliado';
            return report;
        }));

        // Check if any page has status 'Erro na avaliação'
        if (evaluationResults.some(result => result.error)) {
            website.status = 'Erro na avaliação';
            // Update the status of the pages that had an error during evaluation
            website.pages.forEach(page => {
                if (evaluationResults.some(result => result.error && result.error.includes(page.url))) {
                    page.status = 'Erro na avaliação';
                }
            });
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
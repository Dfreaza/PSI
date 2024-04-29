const Website = require('../models/website');
const Page = require('../models/page');
const qualweb = require('@qualweb/core').QualWeb;

exports.evaluateWebsiteAccessibility = async (req, res) => {
    const { websiteId } = req.params;
    const { pages } = req.body; // Array of page URLs to evaluate

    try {
        // Fetch website details from database based on websiteId
        const website = await Website.findOne({ _id: websiteId });

        if (!website) {
            return res.status(404).json({ error: 'Website not found' });
        }

        // Initiate accessibility evaluation for each page using QualWeb core
        const evaluationResults = await Promise.all(pages.map(async (pageUrl) => {
            const page = await Page.findOne({ url: pageUrl, website: websiteId });

            if (!page) {
                return { error: `Page not found: ${pageUrl}` };
            }

            try {
                page.status = 'Em avaliação';
                await page.save();

                const evaluationResult = await qualweb.evaluate(page.url);

                page.evaluationResult = evaluationResult;
                page.status = evaluationResult.errors.length === 0 ? 'Conforme' : 'Não conforme';
                await page.save();

                return evaluationResult;
            } catch (error) {
                page.status = 'Erro na avaliação';
                await page.save();

                return { error };
            }
        }));

        // Handle any errors that occurred during the evaluation
        const errors = evaluationResults.filter(result => result.error);
        if (errors.length > 0) {
            return res.status(500).json({ errors });
        }

        // Update the status of the website based on page statuses
        if (website.pages.some(page => page.status === 'Erro na avaliação')) {
            website.status = 'Erro na avaliação';
        } else if (website.pages.every(page => page.status === 'Conforme' || page.status === 'Não conforme')) {
            website.status = 'Avaliado';
        } else {
            website.status = 'Em avaliação';
        }
        await website.save();

        // Return the evaluation results
        res.status(200).json({ message: 'Accessibility evaluation completed successfully', results: evaluationResults });
    } catch (error) {
        console.error('Error evaluating accessibility:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
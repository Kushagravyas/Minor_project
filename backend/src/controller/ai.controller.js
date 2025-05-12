const aiservice = require('../services/ai.service.js');

module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await aiservice(code);

    res.send(response);
}


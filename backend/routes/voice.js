const express = require('express');
const router = express.Router();
const { generateVoiceReply } = require('../utils/voice-engine');

router.post('/', (req, res) => {
    const { assistant, module, context} = req.body;
    const response = generateVoiceReply(assistant, module, context);
    res.json({ response }); 
});
module.exports = router;
        

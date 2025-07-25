import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import Profile from '../models/profileModel.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
console.log('AI_SERVICE_URL:', AI_SERVICE_URL);
console.log('AI_SERVICE_URL:', process.env.AI_SERVICE_URL);

const getRecommendation = async (req, res) => {
    console.log('--- Inside getRecommendation controller ---');
    try {
        const userId = req.user.id;
        console.log(`Searching for profile with user ID: ${userId}`);

        // AGGRESSIVE DEBUGGING: Log all profiles to see what the server finds
        const allProfiles = await Profile.find({});
        console.log('2. ALL profiles found in database:', allProfiles);
         
        const profile = await Profile.findById(userId);
        if (!profile) {
            console.log('Profile NOT found in database. Sending 404.');
            return res.status(404).json({ message: 'Profile not found for this user. Please save it first.' });
        }

        console.log('Profile being sent to AI service:', profile);
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/recommend`, { profile });
            return res.json(response.data);
        } catch (error) {
            console.error('Error in axios.post:', error.message);
            return res.status(500).json({ message: 'AI service is currently unavailable.' });
        }
    } catch (error) {
        console.error('An error occurred in getRecommendation:', error.message);
        return res.status(500).json({ message: 'AI service is currently unavailable.' });
    }
};

const handleChat = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id;
        const profile = await Profile.findById(userId);
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, { query, profile });
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'AI chat service is currently unavailable.' });
    }
};

export { getRecommendation, handleChat };
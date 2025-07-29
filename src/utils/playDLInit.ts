import play from 'play-dl';

export async function initializePlayDL(): Promise<boolean> {
    try {
        console.log('🔧 Initializing play-dl...');
        
        // Set up play-dl with YouTube cookies (optional but recommended)
        const youtubeCookie = process.env['YOUTUBE_COOKIE'];
        if (youtubeCookie) {
            await play.setToken({
                youtube: {
                    cookie: youtubeCookie
                }
            });
        } else {
            console.log('⚠️ No YouTube cookie provided, using default settings');
        }
        
        // Test the connection by searching for a simple query
        const testResults = await play.search('test', { limit: 1 });
        if (testResults.length > 0) {
            console.log('✅ play-dl initialized successfully');
            return true;
        } else {
            console.log('⚠️ play-dl initialized but search test failed');
            return true; // Still return true as it might work for actual queries
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize play-dl:', error);
        return false;
    }
} 
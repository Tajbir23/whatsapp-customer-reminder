const reorganizeNumber = (number) => {
    console.log('reorganizeNumber', number)
    try {
        // Check if number exists and is a valid type
        if (!number || typeof number !== 'string') {
            console.log('⚠️ Invalid input: number is required and must be a string');
            return false;
        }
        
        // সব special characters remove করা (+, -, space, etc.)
        let cleanedNumber = number.replace(/[\s\-\+\(\)]/g, '');
        
        // Check if cleaned number contains only digits (0-9)
        if (!/^\d+$/.test(cleanedNumber)) {
            console.log(`⚠️ Invalid phone number: "${number}" contains non-numeric characters`);
            return false;
        }
        
        // Check minimum length (at least 10 digits for international numbers)
        if (cleanedNumber.length < 10) {
            console.log(`⚠️ Invalid phone number: "${number}" is too short (minimum 10 digits)`);
            return false;
        }
        
        // Check maximum length (maximum 15 digits for international numbers)
        if (cleanedNumber.length > 15) {
            console.log(`⚠️ Invalid phone number: "${number}" is too long (maximum 15 digits)`);
            return false;
        }
        
        // যদি নাম্বার 0 দিয়ে শুরু হয় এবং 11 digit হয় (বাংলাদেশী নাম্বার)
        if (cleanedNumber.startsWith('0') && cleanedNumber.length === 11) {
            // 0 remove করে 880 যোগ করা
            cleanedNumber = '880' + cleanedNumber.substring(1);
        }
        // যদি নাম্বার 880 দিয়ে শুরু হয় এবং 13 digit হয় (already Bangladesh country code আছে)
        else if (cleanedNumber.startsWith('880') && cleanedNumber.length === 13) {
            // ঠিক আছে, কিছু করার দরকার নেই
            cleanedNumber = cleanedNumber;
        }
        // অন্য দেশের নাম্বার - already country code আছে
        else {
            // যেমন আছে তেমনই রাখা
            cleanedNumber = cleanedNumber;
        }
        
        // WhatsApp format এ return করা
        return cleanedNumber + '@c.us';
    } catch (error) {
        console.error('Error in reorganizeNumber:', error.message);
        return false;
    }
}

module.exports = { reorganizeNumber }
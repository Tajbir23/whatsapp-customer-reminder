const reorganizeNumber = (number) => {
    try {
        // সব special characters remove করা (+, -, space, etc.)
        let cleanedNumber = number.replace(/[\s\-\+\(\)]/g, '');
        
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
        console.log(error);
        return false
    }
}

module.exports = { reorganizeNumber }
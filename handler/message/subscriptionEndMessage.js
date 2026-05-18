const subscriptionEndMessage = async (email, plan) => {
  if (plan === 'gemini-pro') {
    return `আপনার ${email} এর Gemini Pro subscription এর মেয়াদ শেষ হয়েছে।\n
    আপনি কি renew করতে চাচ্ছেন?
    
    _*Renew অথবা Payment করে থাকলে ignore করুন*_

    End
    `;
  }

  const planName = plan === 'business' ? 'ChatGPT Business' : 'ChatGPT Plus';

  const text = `আপনার ${email} এর ${planName} subscription এর মেয়াদ শেষ হয়েছে।\n
    আপনি কি renew করতে চাচ্ছেন?
    
    _*Renew অথবা Payment করে থাকলে ignore করুন*_

    End
    `;

  return text;
};

module.exports = subscriptionEndMessage;

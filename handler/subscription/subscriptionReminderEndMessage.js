const subscriptionReminderEndMessage = async (email, plan) => {
  
  if (plan === 'gemini-pro') {
    return `আসসালামু আলাইকুম

আপনার ${email} এর Gemini Pro subscription এর মেয়াদ আর মাত্র ২ দিন বাকি আছে।

আপনি কি renew করতে চাচ্ছেন?

Reminder
`;
  }

  // Default for 'business' and 'plus'
  const planName = plan === 'business' ? 'ChatGPT Business' : 'ChatGPT Plus';

  const text = `আসসালামু আলাইকুম

আপনার ${email} এর ${planName} subscription এর মেয়াদ আর মাত্র ২ দিন বাকি আছে।

আপনি কি renew করতে চাচ্ছেন?

Reminder
`;

  return text;
};

module.exports = subscriptionReminderEndMessage;

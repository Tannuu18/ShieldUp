// CyberShield Mock Datasets & Interactive Simulation Logic

// 1. Message Analyzer Templates (Examples the user can select to quickly try the tool)
export const MESSAGE_SAMPLES = [
  {
    label: "Fake Bank OTP Request",
    text: "Dear Customer, your ICICI bank account is suspended due to verification failure. Please verify immediately by sharing the OTP sent to your mobile or click here: http://icici-verify-security.in/login. Failure to update in 10 minutes will lead to permanent blockage.",
    type: "Banking Scam",
    risk: "High",
    indicators: ["Urgency Tactic", "Suspicious URL Structure", "Credential Request", "Blockage Threat"],
    explanation: "This message uses authority impersonation and severe time pressure (10 minutes) to scare you into revealing your One Time Password (OTP) and visiting an unverified URL."
  },
  {
    label: "Fake Part-Time Job Offer",
    text: "CONGRATULATIONS! You have been selected for a flexible online part-time job. Earn ₹5000 - ₹15000 daily from home. No experience required, training provided. To register, contact our HR executive on Telegram: https://t.me/hr_sheila_recruitment. Start earning immediately!",
    type: "Job Scam",
    risk: "High",
    indicators: ["Too Good to be True", "Telegram Redirect", "No Official Email", "Generic Greeting"],
    explanation: "Scammers use Telegram links to maintain anonymity. Genuine companies never recruit via random SMS redirects or ask you to pay 'verification fees' before starting work."
  },
  {
    label: "Fake Courier Delivery Fee",
    text: "FedEx Alert: Your package containing international documentations has been put on hold due to outstanding custom duties of ₹850. Please settle the payment at http://fedex-customs-clearance.net/pay within 24 hours to clear delivery.",
    type: "Delivery Scam",
    risk: "High",
    indicators: ["Urgency Tactic", "Payment Link", "Suspicious Domain", "Misaligned branding"],
    explanation: "Post/courier scams exploit expectation. They ask for a small payment (custom duty) to get your credit card details, then swipe larger amounts."
  },
  {
    label: "Legitimate Bank Alert",
    text: "HDFC Bank Alert: You made a transaction of ₹5,000 at AMZN India. If this wasn't you, please call our official helpline at 1800-266-4332 or block your card using the mobile app. Do not share your OTP or PIN with anyone.",
    type: "Legitimate Notification",
    risk: "Safe",
    indicators: ["No links included", "Safety warning present", "Official contact format"],
    explanation: "This is a legitimate transactional alert. Note that it does not contain a clickable login link and explicitly warns you *not* to share passwords or OTPs."
  }
];

// 2. URL Scanner Database
export const MOCK_URLS = {
  "icici-verify-security.in": {
    domain: "icici-verify-security.in",
    riskScore: 92,
    domainAge: "3 days",
    sslValid: false,
    sslIssuer: "Expired / Self-Signed",
    whois: {
      registrar: "Hostinger, UAB",
      registrantCountry: "CN",
      creationDate: "2026-06-10",
      expiryDate: "2027-06-10"
    },
    threatDatabaseFlags: ["Phishing Database", "Google Safe Browsing Blocklist"],
    reasons: [
      "Domain registered less than a week ago.",
      "SSL certificate is invalid or self-signed, exposing connections to hijacking.",
      "WHOIS records show registrant info is hidden or belongs to high-risk location.",
      "Matches known ICICI Bank phishing domain patterns."
    ]
  },
  "fedex-customs-clearance.net": {
    domain: "fedex-customs-clearance.net",
    riskScore: 84,
    domainAge: "12 days",
    sslValid: true,
    sslIssuer: "Let's Encrypt (Free DV)",
    whois: {
      registrar: "Namecheap Inc.",
      registrantCountry: "IS",
      creationDate: "2026-06-01",
      expiryDate: "2027-06-01"
    },
    threatDatabaseFlags: ["Reported in VirusTotal spam feeds"],
    reasons: [
      "Newly registered domain (12 days old).",
      "Using a free Domain Validation SSL certificate typical for short-lived phishing sites.",
      "Impersonates official FedEx trademark in URL structure."
    ]
  },
  "amazon.in": {
    domain: "amazon.in",
    riskScore: 4,
    domainAge: "21 years",
    sslValid: true,
    sslIssuer: "DigiCert Global CA G2",
    whois: {
      registrar: "MarkMonitor Inc.",
      registrantCountry: "IN",
      creationDate: "2005-02-12",
      expiryDate: "2028-02-12"
    },
    threatDatabaseFlags: [],
    reasons: [
      "Extremely old and trusted domain authority.",
      "Valid, high-grade EV/OV SSL Certificate from DigiCert.",
      "Zero malicious listings across 75+ global antivirus scanners."
    ]
  }
};

// 3. Screenshot Templates with Interactive Hotspots
export const SCREENSHOT_TEMPLATES = [
  {
    id: "netflix-billing",
    title: "Netflix Fake Billing Email",
    description: "An email claiming your account is suspended due to payment failure.",
    brand: "Netflix",
    sender: "billing-support@netflix-update-billing.org",
    subject: "Urgent: Update your payment method to avoid suspension",
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #222; background: #000; color: #fff;">
        <div style="color: #E50914; font-size: 24px; font-weight: bold; margin-bottom: 20px;">NETFLIX</div>
        <p style="font-size: 16px; font-weight: bold; color: #ff3b30;">Your membership is on hold.</p>
        <p>We were unable to process your payment for your next billing cycle. As a result, we have temporarily suspended your streaming access.</p>
        <div style="margin: 25px 0;">
          <a href="#" style="background: #E50914; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">RESTART MEMBERSHIP</a>
        </div>
        <p style="font-size: 12px; color: #777;">If you have any questions, please visit the Help Center. Netflix Inc., Los Gatos, CA.</p>
      </div>
    `,
    hotspots: [
      {
        id: "sender",
        top: "8%",
        left: "2%",
        width: "96%",
        height: "8%",
        title: "Suspicious Sender Address",
        description: "The sender domain is 'netflix-update-billing.org' instead of 'netflix.com'. Scammers register lookalike domains to bypass initial checks.",
        risk: "Critical"
      },
      {
        id: "urgency",
        top: "22%",
        left: "2%",
        width: "50%",
        height: "8%",
        title: "Urgency Tactics",
        description: "'Membership is on hold' and 'temporarily suspended' are classic scare tactics designed to stop you from thinking critically before acting.",
        risk: "Warning"
      },
      {
        id: "cta",
        top: "48%",
        left: "15%",
        width: "70%",
        height: "12%",
        title: "Fake Call-to-Action Link",
        description: "Hovering over this button would reveal it points to a credentials harvester (e.g. netflix-update-billing.org/login) rather than Netflix's real site.",
        risk: "Critical"
      }
    ]
  },
  {
    id: "chase-login",
    title: "Chase Bank Fake Login Page",
    description: "A page designed to look exactly like Chase online banking portal.",
    brand: "Chase Bank",
    sender: "Browser URL bar: http://chase-online-access.net/signin",
    subject: "Chase Online | Sign In",
    bodyHtml: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 25px; background: #004687; color: #fff; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0060b8; padding-bottom: 10px; margin-bottom: 20px;">
          <span style="font-size: 20px; font-weight: 800; tracking: 1px;">CHASE &apos;</span>
          <span style="font-size: 11px; color: #75aaff;">Secure Server</span>
        </div>
        <div style="background: white; color: #333; padding: 20px; border-radius: 6px;">
          <h3 style="margin-top: 0; color: #111;">Sign in to your account</h3>
          <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">Username</label>
            <input type="text" placeholder="" style="width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;" disabled value="nehas123" />
          </div>
          <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">Password</label>
            <input type="password" style="width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;" disabled value="••••••••••••••" />
          </div>
          <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">Verify OTP (Sent to mobile)</label>
            <input type="text" placeholder="Enter 6-Digit Code" style="width: 100%; padding: 8px; border: 2px solid #ef4444; box-sizing: border-box;" disabled />
          </div>
          <button style="width: 100%; background: #117aca; color: white; border: none; padding: 12px; font-weight: bold; border-radius: 4px; cursor: pointer;">Sign In</button>
        </div>
      </div>
    `,
    hotspots: [
      {
        id: "url",
        top: "2%",
        left: "2%",
        width: "96%",
        height: "8%",
        title: "Unsecured Protocol & Lookalike URL",
        description: "The browser url is http:// (no SSL/HTTPS) and uses 'chase-online-access.net' instead of 'chase.com'. Banks will always enforce HTTPS on sign-in.",
        risk: "Critical"
      },
      {
        id: "otp-login",
        top: "60%",
        left: "5%",
        width: "90%",
        height: "16%",
        title: "OTP Requested Immediately on Login Screen",
        description: "Genuine banks ask for credentials first, and only trigger OTP if two-factor authorization is requested on separate verification overlays. Demanding OTP on the primary sign-in page is a sign of 'real-time OTP relay' scamming.",
        risk: "Critical"
      }
    ]
  }
];

// 4. Incident Response Playbooks (Cyber Emergency Assistant)
export const EMERGENCY_PLAYBOOKS = {
  phishing_link: {
    title: "I Clicked a Phishing Link",
    subtitle: "Follow these steps immediately to protect your device and accounts.",
    steps: [
      {
        title: "1. Disconnect Network Access",
        detail: "Immediately turn off Wi-Fi or unplug your internet cable. This prevents malicious scripts running in the background from uploading stole files or passwords to the attacker's server."
      },
      {
        title: "2. Clear Browser Cache & Close Tabs",
        detail: "Close the phishing page and clear your history, cache, and cookies. This deletes any session tokens the site might have tried to cookie-jack."
      },
      {
        title: "3. Update Your Passwords (On another device)",
        detail: "If you typed any passwords (email, banking, socials) on that link, change them immediately. Create unique, strong passphrases and use a password manager. Do this from a secure phone or separate laptop if possible."
      },
      {
        title: "4. Activate Multi-Factor Authentication (MFA)",
        detail: "Enable MFA/2FA on all compromised accounts. Use authentication apps (Google Authenticator, Bitwarden, Aegis) instead of SMS OTP, as SMS is vulnerable to SIM-swapping."
      },
      {
        title: "5. Monitor Financial Statements",
        detail: "If it was a banking scam, notify your bank immediately. Place a temporary freeze on your credit card and check for unauthorized debit requests."
      }
    ]
  },
  hacked_socials: {
    title: "My Instagram / WhatsApp was Hacked",
    subtitle: "Steps to recover access and notify your network.",
    steps: [
      {
        title: "1. Attempt Official Recovery Channels",
        detail: "Use the application's 'Forgot Password' or 'Need Help Signing In' link. WhatsApp allows re-registering via SMS verification. Instagram provides visual verification (video selfie) if profile photos exist."
      },
      {
        title: "2. Revoke Logged-In Sessions",
        detail: "If you can still access settings, go to Account Center -> Security -> Where You're Logged In. Log out of all unfamiliar devices."
      },
      {
        title: "3. Notify Friends & Family",
        detail: "Post or message on other platforms warning others that your account is hijacked. Scammers will immediately message your contacts asking for urgent money transfers or sending code-verification links."
      },
      {
        title: "4. Search for linked email changes",
        detail: "Check your email inbox for alerts like 'Your security email was changed'. If you did not trigger this, click the 'Secure my account' link inside that email immediately to undo it."
      }
    ]
  },
  malware_download: {
    title: "I Downloaded a Suspicious File / Executable",
    subtitle: "Contain and purge potential spyware or keyloggers.",
    steps: [
      {
        title: "1. Do Not Run the File",
        detail: "If you haven't opened the file, immediately delete it and empty your Recycle Bin. Do not double-click files with double extensions (e.g. invoice.pdf.exe)."
      },
      {
        title: "2. Disconnect Internet",
        detail: "Shut down network card/Wi-Fi to prevent malware from establishing a command-and-control connection with attackers."
      },
      {
        title: "3. Run a Deep System Scan",
        detail: "Use built-in security software like Windows Defender (Run an offline scan) or download Malwarebytes from a safe device to run a thorough system purge."
      },
      {
        title: "4. Check Startup & Background Services",
        detail: "Open Task Manager (Ctrl+Shift+Esc). Check the Startup tab for suspicious programs, and check active processes consuming unusually high CPU or memory."
      }
    ]
  }
};

// 5. Security Health Score Quiz Questions
export const HEALTH_QUIZ = [
  {
    id: 1,
    question: "How do you manage your passwords for online accounts?",
    options: [
      { text: "I use a password manager to generate and store unique passwords for every site.", score: 10, recommendations: [] },
      { text: "I write them down in a secure physical notebook or a password-locked document.", score: 7, recommendations: ["Migrate to an encrypted password manager to prevent physical theft or copy-paste exposures."] },
      { text: "I use a few strong passwords and rotate them across different platforms.", score: 3, recommendations: ["Stop reusing passwords. If one site suffers a breach, hackers will try that password on all your other accounts (Credential Stuffing)."] },
      { text: "I reuse the same easy-to-remember password for almost everything.", score: 0, recommendations: ["CRITICAL: Immediately set up a password manager and update all duplicate credentials."] }
    ]
  },
  {
    id: 2,
    question: "Where do you have Multi-Factor Authentication (MFA) enabled?",
    options: [
      { text: "On every single account that supports it, using an authenticator app or hardware key.", score: 10, recommendations: [] },
      { text: "Only on critical accounts (Email, Bank) using SMS verification code.", score: 6, recommendations: ["Upgrade from SMS-based MFA to Authenticator Apps (Google/Microsoft/Bitwarden) which are immune to SIM-swapping."] },
      { text: "Only on a few accounts when forced to.", score: 3, recommendations: ["Audit all accounts and toggle on 2-Factor Authentication everywhere. Start with email and social media."] },
      { text: "I don't use Multi-Factor Authentication.", score: 0, recommendations: ["CRITICAL: Enable MFA immediately. It blocks over 99% of automated account takeover attempts."] }
    ]
  },
  {
    id: 3,
    question: "How frequently do you update your phone, computer, and router firmware?",
    options: [
      { text: "Automatically. I install updates as soon as they are released.", score: 10, recommendations: [] },
      { text: "Once a month or when I see a system notification.", score: 7, recommendations: ["Enable automatic updates on your devices so zero-day exploits are patched before they propagate."] },
      { text: "Rarely, I delay updates because they take time and change layouts.", score: 2, recommendations: ["Updates frequently patch security flaws that let attackers take control of your device. Do not postpone updates."] }
    ]
  },
  {
    id: 4,
    question: "What do you do if you receive an email from your bank claiming your account is locked and providing a link to log in?",
    options: [
      { text: "Ignore the link. Go to the bank's official website in a new window or open the official mobile app.", score: 10, recommendations: [] },
      { text: "Click the link but inspect the URL closely before typing any credentials.", score: 4, recommendations: ["Never click login links in urgent emails. Scammers can create perfect domain lookalikes that deceive experts."] },
      { text: "Click the link and sign in to verify. The email had the bank's official logo.", score: 0, recommendations: ["Logo graphics are easy to copy. Treat any urgent call to action via links as suspicious."] }
    ]
  },
  {
    id: 5,
    question: "How do you connect to public Wi-Fi networks (e.g., at coffee shops, airports)?",
    options: [
      { text: "I avoid public Wi-Fi entirely or always use an encrypted VPN (Virtual Private Network).", score: 10, recommendations: [] },
      { text: "I connect to public Wi-Fi but do not access banking or sensitive personal data.", score: 6, recommendations: ["Ensure your browser connects strictly over HTTPS when on public networks, or use your phone's hot-spot instead."] },
      { text: "I connect freely whenever there is free Wi-Fi.", score: 1, recommendations: ["Use a VPN or cellular data. Attackers on the same public network can execute 'Man-in-the-Middle' attacks to intercept your web traffic."] }
    ]
  }
];

// 6. AI Scam Simulator Scenarios (Duolingo Style: Mode A)
export const SIMULATOR_SCENARIOS = [
  {
    id: "scen-recruiter",
    title: "Fake Job Recruiter SMS",
    type: "Job Scam",
    introText: "You receive a message on WhatsApp from a number with a country code you don't recognize (+277). Click on the sections that are red flags, then classify the message.",
    messageText: "[Sender: +27 72 389 4402]\nHey there! I am Sarah from TechRecruit Solutions. 🌟 We saw your resume online and you are a great match for our remote data compiler role! Pay is ₹15,000 - ₹35,000 per day. \n\nNo qualifications required. Simply deposit a ₹499 security check fee to verify your identification account details. Click here to chat with HR: http://techrecruit-registration-desk.net/apply",
    choices: ["Safe", "Suspicious", "Scam"],
    correctChoice: "Scam",
    hotspots: [
      {
        text: "+27 72 389 4402",
        flagged: true,
        label: "International Number",
        explanation: "Recruiter claims to represent an Indian/domestic firm but uses an international VoIP number (+27 is South Africa)."
      },
      {
        text: "₹15,000 - ₹35,000 per day",
        flagged: true,
        label: "Irreconcilable Pay Rate",
        explanation: "Extremely high pay (up to ₹10L/month) for simple 'data entry' tasks is classic lure bait."
      },
      {
        text: "deposit a ₹499 security check fee",
        flagged: true,
        label: "Upfront Payment Request",
        explanation: "No legitimate company will ever charge candidates a fee to register, verify accounts, or receive training."
      },
      {
        text: "http://techrecruit-registration-desk.net/apply",
        flagged: true,
        label: "Suspicious Domain Structure",
        explanation: "A recently registered, unsecured website instead of a corporate portal."
      }
    ],
    redFlagsExplanation: "This scam matches multiple key markers: an unknown international sender, unrealistic daily payouts, a request for upfront fees under the guise of verification, and an unofficial registration web link."
  },
  {
    id: "scen-bank-alert",
    title: "Urgent Debit Alert",
    type: "Banking Scam",
    introText: "You receive an SMS alert claiming a transaction is about to block your funds.",
    messageText: "ALERT: SBI-Debit Card transaction of ₹85,200 at PAYTM-WALLET is initiated. If you did not authorize this, you MUST block your card within 5 minutes. Click to block now: http://sbi-secure-cardblock.info/update. Share this message with nobody.",
    choices: ["Safe", "Suspicious", "Scam"],
    correctChoice: "Scam",
    hotspots: [
      {
        text: "within 5 minutes",
        flagged: true,
        label: "Urgency Pressure",
        explanation: "Scammers create false panic (5 minutes) so that you click in fear without confirming the official bank source."
      },
      {
        text: "http://sbi-secure-cardblock.info/update",
        flagged: true,
        label: "Fake Banking Domain",
        explanation: "Official State Bank of India sites reside strictly on sbi.co.in or onlinesbi.sbi. They do not use .info domains."
      }
    ],
    redFlagsExplanation: "This alert relies on high urgency and redirects users to a malicious credentials harvesting portal mimicking SBI's blocking interface."
  },
  {
  id: "scen-delivery",
  title: "Package Delivery Failed",
  type: "Delivery Scam",

  introText:
    "Courier company claims your parcel cannot be delivered.",

  messageText:
    "Your package delivery failed. Pay ₹50 re-delivery fee immediately at http://india-post-delivery-fix.net",

  choices: ["Safe", "Suspicious", "Scam"],

  correctChoice: "Scam",

  hotspots: [
    {
      text: "₹50 re-delivery fee",
      flagged: true,
      label: "Payment Request",
      explanation:
        "Small charges are often used to steal card information."
    },
    {
      text: "http://india-post-delivery-fix.net",
      flagged: true,
      label: "Fake Domain",
      explanation:
        "Not an official India Post website."
    }
  ],

  redFlagsExplanation:
    "Fake delivery scams commonly use small payment requests and fake courier websites."
}
];

// 7. Scammer Chat Simulations (Mode B - Interactive Chatbot States)
export const CHAT_SCENARIOS = {
  bank_fraud: {
    character: "Inspector Rajesh Kumar (Cyber Cell / SBI Security)",
    avatar: "👮‍♂️",
    initialMsg: "Hello. This is Inspector Rajesh Kumar from the SBI Security division. We have detected suspicious transactions from IP 192.168.4.12 attempting to withdraw ₹45,000 from your online account. Is this your transaction?",
    techniques: ["Authority Impersonation", "Fear Tactic", "Urgency"],
    dialogFlow: {
      start: {
        botReply: "We have detected suspicious transactions from IP 192.168.4.12 attempting to withdraw ₹45,000 from your online account. Is this your transaction?",
        options: [
          { text: "No! That's definitely not me. Please cancel it!", nextState: "panic" },
          { text: "Wait, how did you get my number? What credentials do you have?", nextState: "suspicious" },
          { text: "I don't have an SBI account, you fraudster.", nextState: "expose_scam" }
        ]
      },
      panic: {
        botReply: "Alright. Do not panic. I am freezing the transaction now. To permanently reverse this transfer and lock your account against the hacker, I am sending a 6-digit Security Deactivation Code to your mobile. Please share the code immediately when it arrives.",
        options: [
          { text: "Okay, I will share the code when I get it.", nextState: "fail_otp" },
          { text: "Why do you need a code? Can't you block it yourself?", nextState: "explain_otp" },
          { text: "Wait, is this a transaction OTP? I won't share it.", nextState: "block_scammer" }
        ]
      },
      suspicious: {
        botReply: "I am Senior Inspector Rajesh, Badge Number SBI-9082. This is a secure security channel. If you do not verify details immediately, the funds will leave your account in 3 minutes and we will file an FIR for negligence. Do you wish to proceed with deactivation?",
        options: [
          { text: "Okay, how do we deactivate it?", nextState: "panic" },
          { text: "I am going to hang up and call the official bank branch.", nextState: "expose_scam" }
        ]
      },
      explain_otp: {
        botReply: "The deactivation code is required to authorize our encrypted firewall to override the hacker's active session. Delaying this will lead to full fund drain. What is the code you received?",
        options: [
          { text: "Fine, the code is 482901.", nextState: "fail_otp" },
          { text: "This code says 'Transaction OTP for ₹45,000'! You are trying to steal my money!", nextState: "expose_scam" }
        ]
      },
      fail_otp: {
        botReply: "SYSTEM ERROR: Verification success. Wait, the transaction has been blocked. (SCAMMER STATUS: Succeeded. Attacker withdrew your funds using the OTP provided. Lesson: NEVER share OTPs with callers claiming to be bank inspectors!)",
        isEnd: true,
        rating: "Vulnerable",
        tacticsIdentified: ["Authority Impersonation", "Fear", "Relay OTP exploit"],
        xpEarned: 10
      },
      expose_scam: {
        botReply: "Silence... (SCAMMER STATUS: Disconnected. You successfully identified the red flags and did not comply. Excellent work!)",
        isEnd: true,
        rating: "Scam Hunter",
        tacticsIdentified: ["Spotted spoof badge", "Resisted urgency", "Protected credentials"],
        xpEarned: 100
      },
      block_scammer: {
        botReply: "Account Blocked! (SCAMMER STATUS: Terminated. You caught the OTP trick and protected your details. You are a Cyber Defender!)",
        isEnd: true,
        rating: "Cyber Defender",
        tacticsIdentified: ["Recognized OTP relay", "Secured personal info"],
        xpEarned: 120
      }
    }
  },
  amazon_refund: {
    character: "Alexa (Amazon Billing Representative)",
    avatar: "📦",
    initialMsg: "Thank you for contacting Amazon Support. We are confirming a refund of ₹9,499 for your cancellation of a 'Sony Wireless Headphones' order. Do you wish to claim this refund to your bank account?",
    techniques: ["Trust Exploitation", "Financial Lure", "Remote Access"],
    dialogFlow: {
      start: {
        botReply: "We are confirming a refund of ₹9,499 for your cancellation of a 'Sony Wireless Headphones' order. Do you wish to claim this refund to your bank account?",
        options: [
          { text: "Yes, please credit it. I canceled that order.", nextState: "agree_refund" },
          { text: "I never ordered headphones. Why are you refunding me?", nextState: "refute_order" },
          { text: "This is a scam. I am hanging up.", nextState: "block_scam" }
        ]
      },
      agree_refund: {
        botReply: "Excellent. To process the refund, our system requires you to download our secure 'Amazon Assistant Service Utility' app (AnyDesk) so our manager can sync the gateway. Please go to the App Store and search for AnyDesk.",
        options: [
          { text: "Okay, downloading AnyDesk now.", nextState: "download_anydesk" },
          { text: "Why do I need AnyDesk? Can't you just credit my original card?", nextState: "refuse_app" }
        ]
      },
      refute_order: {
        botReply: "Oh! If you did not make this order, someone has hacked your credentials and ordered it using your saved card. We need to install our security scanner on your phone immediately to lock the hacker out. Download AnyDesk.",
        options: [
          { text: "Okay, let me download it to secure my device.", nextState: "download_anydesk" },
          { text: "No, I will handle security through my official bank.", nextState: "block_scam" }
        ]
      },
      refuse_app: {
        botReply: "Our banking gateway uses direct peer-to-peer verification protocols. Without the AnyDesk sync utility, our billing agent cannot authorize the payment code. If we do not connect, your card will be charged the ₹9,499 instead.",
        options: [
          { text: "Fine, downloading AnyDesk.", nextState: "download_anydesk" },
          { text: "AnyDesk allows remote screen sharing. I will not give you access.", nextState: "block_scam" }
        ]
      },
      download_anydesk: {
        botReply: "Great. Please open AnyDesk and read me the 9-digit Address code showing on your screen. (SCAMMER STATUS: Succeeded. Attacker gained remote desktop access, opened your banking page, and stole credentials. Lesson: Never download remote control software on requests from strangers!)",
        isEnd: true,
        rating: "Vulnerable",
        tacticsIdentified: ["Lure", "Remote Access exploit"],
        xpEarned: 10
      },
      block_scam: {
        botReply: "Refund canceled. Chat disconnected. (SCAMMER STATUS: Exited. You avoided remote desk sharing and exposed the trick. Superb!)",
        isEnd: true,
        rating: "Phishing Detective",
        tacticsIdentified: ["Spotted AnyDesk Remote Trap", "Blocked caller"],
        xpEarned: 100
      }
    }
  }
  ,
upi_support: {
  character: "UPI Customer Support Executive",
  avatar: "💸",
  initialMsg:
    "Hello sir, we noticed a failed refund of ₹2,500 to your UPI account. Would you like us to process it immediately?",

  techniques: [
    "Refund Scam",
    "Social Engineering",
    "UPI Collection Request"
  ],

  dialogFlow: {
    start: {
      botReply:
        "We noticed a failed refund of ₹2,500 to your account. Would you like us to process it immediately?",

      options: [
        {
          text: "Yes, please process it.",
          nextState: "collect_request"
        },

        {
          text: "Which company are you calling from?",
          nextState: "suspicious"
        },

        {
          text: "I never requested a refund.",
          nextState: "safe_end"
        }
      ]
    },

    collect_request: {
      botReply:
        "To receive the refund, please accept the UPI request that will appear on your phone.",

      options: [
        {
          text: "Accepted the request.",
          nextState: "fail_end"
        },

        {
          text: "Refunds should not require payment approval.",
          nextState: "safe_end"
        }
      ]
    },

    suspicious: {
      botReply:
        "Sir, this is an urgent system-generated refund. Please accept the UPI request quickly or the refund will expire.",

      options: [
        {
          text: "Okay, send it.",
          nextState: "fail_end"
        },

        {
          text: "This sounds suspicious.",
          nextState: "safe_end"
        }
      ]
    },

    fail_end: {
      botReply:
        "SCAM SUCCESSFUL. The UPI request actually debited money from your account.",

      isEnd: true,

      rating: "Vulnerable",

      tacticsIdentified: [
        "Refund Scam",
        "Fake Support Agent",
        "UPI Collection Request"
      ],

      xpEarned: 10
    },

    safe_end: {
      botReply:
        "Excellent! You identified the scam. Genuine refunds never require accepting a payment request.",

      isEnd: true,

      rating: "Cyber Defender",

      tacticsIdentified: [
        "Refund Scam",
        "Urgency Tactic",
        "UPI Fraud"
      ],

      xpEarned: 100
    }
  }
}

};

// 8. Achievements List
export const ACHIEVEMENTS = [
  { id: "hunter", title: "Scam Hunter", desc: "Expose a scammer in the chatbot simulator", icon: "🏆", xpRequired: 100 },
  { id: "detective", title: "Phishing Detective", desc: "Spot all 3 red flags on a screenshot overlay", icon: "🔍", xpRequired: 200 },
  { id: "defender", title: "Cyber Defender", desc: "Earn 100% on the Security Health Score Quiz", icon: "🛡️", xpRequired: 300 },
  { id: "streak", title: "Streak Master", desc: "Keep a login streak active", icon: "🔥", xpRequired: 150 }
];
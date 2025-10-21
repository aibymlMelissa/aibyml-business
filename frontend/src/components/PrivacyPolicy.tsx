import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p>
              AI Service Platform ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. This policy complies with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.1 Personal Information</h3>
            <p className="mb-2">We may collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Profile information and preferences</li>
              <li>Communications with us (support requests, feedback)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <p className="mb-2">When you use our Service, we automatically collect certain information, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log files and analytics data</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.3 Third-Party Authentication</h3>
            <p>
              When you authenticate using third-party services (Google, GitHub, WhatsApp), we receive limited information from these providers as authorized by you, such as your name, email address, and profile information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              <li>Personalize your experience and deliver targeted content</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p className="mb-2">If you are located in the European Economic Area (EEA), we process your personal data under the following legal bases:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Consent:</strong> You have given explicit consent for processing your personal data</li>
              <li><strong>Contract:</strong> Processing is necessary to fulfill our contract with you</li>
              <li><strong>Legal Obligation:</strong> Processing is required to comply with legal requirements</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests, provided these do not override your rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Information Sharing and Disclosure</h2>
            <p className="mb-2">We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Privacy Rights</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">7.1 GDPR Rights (EEA Residents)</h3>
            <p className="mb-2">If you are located in the EEA, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation on how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to our processing of your data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">7.2 CCPA Rights (California Residents)</h3>
            <p className="mb-2">If you are a California resident, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Right to Know:</strong> Request disclosure of personal information collected</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell your data)</li>
              <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
            </ul>

            <p className="mt-4">
              To exercise these rights, please contact us at privacy@aiserviceplatform.com. We will respond to your request within the timeframes required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Cookies and Tracking Technologies</h2>
            <p className="mb-2">
              We use cookies and similar tracking technologies to collect and track information about your use of the Service. You can control cookies through your browser settings. Types of cookies we use include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the European Commission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 13 (or 16 in the EEA). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Third-Party Links</h2>
            <p>
              The Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we may provide additional notice (such as email notification). Your continued use of the Service after such modifications constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">14. Contact Us</h2>
            <p className="mb-2">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="ml-4 mt-2 space-y-1">
              <p><strong>Data Protection Officer:</strong></p>
              <p>Email: privacy@aiserviceplatform.com</p>
              <p>Email (GDPR): dpo@aiserviceplatform.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
            <p className="mt-4">
              <strong>For EEA Residents:</strong> You also have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// List of AI services offered by AIbyML.com
export const AI_SERVICES = [
  "AI Bookkeeping Service System via WhatsApp",
  "AI Factory Self-Serviced Generate AI Services",
  "AI Legal Assistant Services",
  "AI Recruitment Services",
  "AI Sales Assistant System Services",
  "AI Secretary Service via WhatsApp",
  "AI Strategic Planning Services"
] as const;

// Mapping of AI services to their corresponding URLs
export const AI_SERVICES_MAP: { [key: string]: string } = {
  "AI Bookkeeping Service System via WhatsApp": "https://fitting-personally-piranha.ngrok-free.app/",
  "AI Factory Self-Serviced Generate AI Services": "https://suitably-moral-newt.ngrok-free.app",
  "AI Legal Assistant Services": "https://guppy-closing-hopefully.ngrok-free.app/",
  "AI Recruitment Services": "https://heartily-lenient-honeybee.ngrok-free.app",
  "AI Sales Assistant System Services": "https://www.aibyml.com",
  "AI Secretary Service via WhatsApp": "https://aibyml-aiwhatsappassistant.static.hf.space",
  "AI Strategic Planning Services": "https://www.aibyml.com"
};

// Default URLs to search when no specific service is selected
export const DEFAULT_AI_SERVICE_URLS = [
  "https://www.aibyml.com",
  "https://fitting-personally-piranha.ngrok-free.app/",
  "https://suitably-moral-newt.ngrok-free.app",
  "https://guppy-closing-hopefully.ngrok-free.app/",
  "https://heartily-lenient-honeybee.ngrok-free.app",
  "https://aibyml-aiwhatsappassistant.static.hf.space"
];

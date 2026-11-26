import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, getCollectionName, logFirestoreError, OperationType } from '../firebase';
import { LeadInquiry, DataSubjectRequest } from '../types';
import { STUDIO_CONFIG } from '../config';

export interface LeadSubmissionResult {
  success: boolean;
  leadId?: string;
  error?: string;
  message: string;
}

export interface DataRequestSubmissionResult {
  success: boolean;
  requestId?: string;
  error?: string;
  message: string;
}

const LEAD_BOUNDS = {
  nameMin: 2,
  nameMax: 120,
  emailMin: 5,
  emailMax: 200,
  whatsappMax: 50,
  projectTypeMax: 120,
  messageMax: 4000,
  samplePhotosLinkMax: 500,
  sourceMax: 80
};

const DATA_REQUEST_BOUNDS = {
  emailMin: 5,
  emailMax: 200,
  whatsappMax: 50,
  nameMax: 120,
  requestTypeMax: 50,
  detailsMax: 2000,
  sourceMax: 80
};

const ALLOWED_DATA_REQUEST_TYPES = new Set<string>([
  'WHATSAPP_OPT_OUT',
  'COMMUNICATION_PREFERENCE',
  'DATA_EXPORT',
  'RIGHT_TO_BE_FORGOTTEN'
]);

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const PHONE_PATTERN = /^[a-zA-Z0-9 +()\-./]{5,50}$/;
const SUBMISSION_COOLDOWN_MS = 5000;
let lastSubmissionTimestamp = 0;

function stripUnsafeChars(value: string, allowNewlines: boolean): string {
  // Remove ASCII C0/C1 control chars and Unicode bidirectional override controls
  const cleaned = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g, '')
    .replace(/[<>]/g, '');
  return allowNewlines ? cleaned : cleaned.replace(/[\r\n]+/g, ' ');
}

function sanitizeString(value: string | undefined, maxLength: number, allowNewlines = false): string {
  if (!value) return '';
  return stripUnsafeChars(value, allowNewlines).trim().slice(0, maxLength);
}

function isSafeHttpsCloudUrl(url: string): boolean {
  if (url.length < 12 || url.length > LEAD_BOUNDS.samplePhotosLinkMax) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;

    const host = parsed.hostname.toLowerCase();
    // Reject localhost, raw IPv4/IPv6 literals, and single-label hosts without a public alphabetic TLD
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
      host.startsWith('[') ||
      !/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function purgeLegacyLocalDraft(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem('2r_last_inquiry_draft');
    } catch {
      // Ignore storage access restrictions
    }
  }
}

/**
 * Validates lead enquiry payload before attempting backend write
 */
function validateLead(lead: Partial<LeadInquiry>): string | null {
  const name = sanitizeString(lead.name, LEAD_BOUNDS.nameMax);
  const email = sanitizeString(lead.email, LEAD_BOUNDS.emailMax).toLowerCase();
  const whatsapp = sanitizeString(lead.whatsapp, LEAD_BOUNDS.whatsappMax);
  const link = sanitizeString(lead.samplePhotosLink, LEAD_BOUNDS.samplePhotosLinkMax);

  if (name.length < LEAD_BOUNDS.nameMin) {
    return 'Please provide your name or studio name.';
  }
  if (email.length < LEAD_BOUNDS.emailMin || !EMAIL_PATTERN.test(email)) {
    return 'Please provide a valid email address.';
  }
  if (!PHONE_PATTERN.test(whatsapp)) {
    return 'Please provide a valid phone or WhatsApp number.';
  }
  if (link.length > 0 && !isSafeHttpsCloudUrl(link)) {
    return 'Please provide a valid https:// cloud storage URL (such as Google Drive, Dropbox, Pixieset, or WeTransfer).';
  }
  return null;
}

/**
 * Submits lead inquiry truthfully to Firestore.
 * Does NOT report success if Firestore fails.
 * Strips unsafe control characters and enforces blueprint volumetric limits before write.
 */
export async function submitLeadInquiry(
  lead: Omit<LeadInquiry, 'createdAt'>,
  honeypot?: string
): Promise<LeadSubmissionResult> {
  purgeLegacyLocalDraft();

  // Anti-spam honeypot verification
  if (honeypot && honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Submission rejected.'
    };
  }

  const now = Date.now();
  if (now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS) {
    return {
      success: false,
      error: 'rate_limited',
      message: 'Please wait a few seconds before submitting another inquiry.'
    };
  }

  // Client validation
  const validationError = validateLead(lead);
  if (validationError) {
    return {
      success: false,
      error: validationError,
      message: validationError
    };
  }

  const timestamp = new Date().toISOString();
  const cleanLink = sanitizeString(lead.samplePhotosLink, LEAD_BOUNDS.samplePhotosLinkMax);

  const structuredLead: Record<string, any> = {
    name: sanitizeString(lead.name, LEAD_BOUNDS.nameMax),
    email: sanitizeString(lead.email, LEAD_BOUNDS.emailMax).toLowerCase(),
    whatsapp: sanitizeString(lead.whatsapp, LEAD_BOUNDS.whatsappMax),
    projectType: sanitizeString(lead.projectType || 'Wedding Album Design', LEAD_BOUNDS.projectTypeMax) || 'Wedding Album Design',
    message: sanitizeString(lead.message, LEAD_BOUNDS.messageMax, true),
    requestFreeSample: Boolean(lead.requestFreeSample),
    whatsappConsent: Boolean(lead.whatsappConsent),
    source: sanitizeString(lead.source || 'website_inquiry_form', LEAD_BOUNDS.sourceMax) || 'website_inquiry_form',
    createdAt: timestamp
  };

  // Only include samplePhotosLink when non-empty (Firestore rejects undefined values)
  if (cleanLink) {
    structuredLead.samplePhotosLink = cleanLink;
  }

  if (!db) {
    return {
      success: false,
      error: 'database_unavailable',
      message: `We couldn’t connect to the inquiry database right now. Please email us directly at ${STUDIO_CONFIG.email}.`
    };
  }

  const collectionPath = getCollectionName('leads');
  lastSubmissionTimestamp = now;

  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...structuredLead,
      serverTimestamp: serverTimestamp()
    });

    return {
      success: true,
      leadId: docRef.id,
      message: 'Your project details have been successfully received by 2R Creations. We will review your scope and respond promptly.'
    };
  } catch (firebaseErr: any) {
    lastSubmissionTimestamp = 0;
    logFirestoreError(firebaseErr, OperationType.CREATE, collectionPath);
    return {
      success: false,
      error: firebaseErr?.code || 'submission_failed',
      message: `We couldn’t submit the enquiry right now. Please email us directly at ${STUDIO_CONFIG.email} or connect via WhatsApp.`
    };
  }
}

/**
 * Submits GDPR/TCPA Data Subject Request (WhatsApp Opt-Out, Data Export, Right to Erasure)
 */
export async function submitDataSubjectRequest(
  request: Omit<DataSubjectRequest, 'createdAt' | 'status'>
): Promise<DataRequestSubmissionResult> {
  const now = Date.now();
  if (now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS) {
    return {
      success: false,
      error: 'rate_limited',
      message: 'Please wait a few seconds before submitting another request.'
    };
  }

  const cleanEmail = sanitizeString(request.email, DATA_REQUEST_BOUNDS.emailMax).toLowerCase();
  if (!cleanEmail || cleanEmail.length < DATA_REQUEST_BOUNDS.emailMin || !EMAIL_PATTERN.test(cleanEmail)) {
    return {
      success: false,
      error: 'invalid_email',
      message: 'Please provide a valid email address so we can record and verify your preference request.'
    };
  }

  const cleanRequestType = sanitizeString(request.requestType, DATA_REQUEST_BOUNDS.requestTypeMax);
  if (!ALLOWED_DATA_REQUEST_TYPES.has(cleanRequestType)) {
    return {
      success: false,
      error: 'invalid_request_type',
      message: 'Please select a valid data subject request action.'
    };
  }

  const cleanWhatsapp = sanitizeString(request.whatsapp, DATA_REQUEST_BOUNDS.whatsappMax);
  if (cleanWhatsapp.length > 0 && !PHONE_PATTERN.test(cleanWhatsapp)) {
    return {
      success: false,
      error: 'invalid_phone',
      message: 'Please provide a valid phone or WhatsApp number.'
    };
  }

  const timestamp = new Date().toISOString();
  const structuredRequest: DataSubjectRequest = {
    email: cleanEmail,
    whatsapp: cleanWhatsapp,
    name: sanitizeString(request.name, DATA_REQUEST_BOUNDS.nameMax),
    requestType: cleanRequestType as DataSubjectRequest['requestType'],
    details: sanitizeString(request.details, DATA_REQUEST_BOUNDS.detailsMax, true),
    status: 'PENDING',
    createdAt: timestamp,
    source: sanitizeString(request.source || 'privacy_preference_center', DATA_REQUEST_BOUNDS.sourceMax) || 'privacy_preference_center'
  };

  if (!db) {
    return {
      success: false,
      error: 'database_unavailable',
      message: `Database connection unavailable. Please email your request directly to ${STUDIO_CONFIG.email}.`
    };
  }

  const collectionPath = getCollectionName('data_requests');
  lastSubmissionTimestamp = now;

  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...structuredRequest,
      serverTimestamp: serverTimestamp()
    });

    return {
      success: true,
      requestId: docRef.id,
      message: 'Your request has been officially recorded and timestamped. Our team will verify and process it immediately.'
    };
  } catch (firebaseErr: any) {
    lastSubmissionTimestamp = 0;
    logFirestoreError(firebaseErr, OperationType.CREATE, collectionPath);
    return {
      success: false,
      error: firebaseErr?.code || 'submission_failed',
      message: `Failed to record request automatically. Please email our data controller at ${STUDIO_CONFIG.email}.`
    };
  }
}

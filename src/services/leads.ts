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

function sanitizeString(value: string | undefined, maxLength: number): string {
  if (!value) return '';
  return value.trim().slice(0, maxLength);
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Validates lead enquiry payload before attempting backend write
 */
function validateLead(lead: Partial<LeadInquiry>): string | null {
  const name = lead.name?.trim() || '';
  const email = lead.email?.trim() || '';
  const whatsapp = lead.whatsapp?.trim() || '';
  const link = lead.samplePhotosLink?.trim() || '';

  if (name.length < LEAD_BOUNDS.nameMin) {
    return 'Please provide your name or studio name.';
  }
  if (email.length < LEAD_BOUNDS.emailMin || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please provide a valid email address.';
  }
  if (whatsapp.length < 5) {
    return 'Please provide a valid phone or WhatsApp number.';
  }
  if (link.length > 0 && !isSafeHttpUrl(link)) {
    return 'Please provide a valid http:// or https:// cloud storage URL for your sample photos.';
  }
  return null;
}

/**
 * Submits lead inquiry truthfully to Firestore.
 * Does NOT report success if Firestore fails.
 * Strips undefined values and enforces blueprint volumetric limits before write.
 */
export async function submitLeadInquiry(
  lead: Omit<LeadInquiry, 'createdAt'>,
  honeypot?: string
): Promise<LeadSubmissionResult> {
  // Anti-spam honeypot verification
  if (honeypot && honeypot.trim().length > 0) {
    console.warn('Bot submission blocked via honeypot.');
    return {
      success: false,
      message: 'Submission rejected.'
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
    projectType: sanitizeString(lead.projectType || 'Wedding Album Design', LEAD_BOUNDS.projectTypeMax),
    message: sanitizeString(lead.message, LEAD_BOUNDS.messageMax),
    requestFreeSample: Boolean(lead.requestFreeSample),
    whatsappConsent: Boolean(lead.whatsappConsent),
    source: sanitizeString(lead.source || 'website_inquiry_form', LEAD_BOUNDS.sourceMax),
    createdAt: timestamp
  };

  // Only include samplePhotosLink when non-empty (Firestore rejects undefined values)
  if (cleanLink) {
    structuredLead.samplePhotosLink = cleanLink;
  }

  // Save local recovery draft so user inputs are never lost if connection drops
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('2r_last_inquiry_draft', JSON.stringify(structuredLead));
    } catch (storageErr) {
      console.warn('Local draft storage error:', storageErr);
    }
  }

  if (!db) {
    return {
      success: false,
      error: 'database_unavailable',
      message: `We couldn’t connect to the inquiry database right now. Please email us directly at ${STUDIO_CONFIG.email}.`
    };
  }

  const collectionPath = getCollectionName('leads');

  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...structuredLead,
      serverTimestamp: serverTimestamp()
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('2r_last_inquiry_draft');
      } catch {
        // Ignore
      }
    }

    return {
      success: true,
      leadId: docRef.id,
      message: 'Your project details have been successfully received by 2R Creations. We will review your scope and respond promptly.'
    };
  } catch (firebaseErr: any) {
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
  const cleanEmail = sanitizeString(request.email, DATA_REQUEST_BOUNDS.emailMax).toLowerCase();
  if (!cleanEmail || cleanEmail.length < DATA_REQUEST_BOUNDS.emailMin || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      error: 'invalid_email',
      message: 'Please provide a valid email address so we can record and verify your preference request.'
    };
  }

  const timestamp = new Date().toISOString();
  const structuredRequest: DataSubjectRequest = {
    email: cleanEmail,
    whatsapp: sanitizeString(request.whatsapp, DATA_REQUEST_BOUNDS.whatsappMax),
    name: sanitizeString(request.name, DATA_REQUEST_BOUNDS.nameMax),
    requestType: sanitizeString(request.requestType, DATA_REQUEST_BOUNDS.requestTypeMax) as DataSubjectRequest['requestType'],
    details: sanitizeString(request.details, DATA_REQUEST_BOUNDS.detailsMax),
    status: 'PENDING',
    createdAt: timestamp,
    source: sanitizeString(request.source || 'privacy_preference_center', DATA_REQUEST_BOUNDS.sourceMax)
  };

  if (!db) {
    return {
      success: false,
      error: 'database_unavailable',
      message: `Database connection unavailable. Please email your request directly to ${STUDIO_CONFIG.email}.`
    };
  }

  const collectionPath = getCollectionName('data_requests');

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
    logFirestoreError(firebaseErr, OperationType.CREATE, collectionPath);
    return {
      success: false,
      error: firebaseErr?.code || 'submission_failed',
      message: `Failed to record request automatically. Please email our data controller at ${STUDIO_CONFIG.email}.`
    };
  }
}

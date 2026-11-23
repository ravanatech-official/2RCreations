import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
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

/**
 * Validates lead enquiry payload before attempting backend write
 */
function validateLead(lead: Partial<LeadInquiry>): string | null {
  if (!lead.name || lead.name.trim().length < 2) {
    return 'Please provide your name or studio name.';
  }
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) {
    return 'Please provide a valid email address.';
  }
  if (!lead.whatsapp || lead.whatsapp.trim().length < 5) {
    return 'Please provide a valid phone or WhatsApp number.';
  }
  return null;
}

/**
 * Submits lead inquiry truthfully to Firestore.
 * Does NOT report success if Firestore fails.
 * Saves to local draft cache purely to prevent user data loss on failure.
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
  const structuredLead: LeadInquiry = {
    ...lead,
    createdAt: timestamp,
    source: lead.source || 'website_inquiry_form'
  };

  // Always save a local recovery draft so user inputs are never lost if connection drops
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

  try {
    // Attempt real Firestore write
    const docRef = await addDoc(collection(db, 'leads'), {
      ...structuredLead,
      serverTimestamp: serverTimestamp()
    });

    // Clear draft on confirmed success
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
    console.error('Firestore write failure:', firebaseErr);
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
  if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email.trim())) {
    return {
      success: false,
      error: 'invalid_email',
      message: 'Please provide a valid email address so we can record and verify your preference request.'
    };
  }

  const timestamp = new Date().toISOString();
  const structuredRequest: DataSubjectRequest = {
    ...request,
    email: request.email.trim().toLowerCase(),
    whatsapp: request.whatsapp?.trim() || '',
    name: request.name?.trim() || '',
    details: request.details?.trim() || '',
    status: 'PENDING',
    createdAt: timestamp,
    source: request.source || 'privacy_preference_center'
  };

  if (!db) {
    return {
      success: false,
      error: 'database_unavailable',
      message: `Database connection unavailable. Please email your request directly to ${STUDIO_CONFIG.email}.`
    };
  }

  try {
    const docRef = await addDoc(collection(db, 'data_requests'), {
      ...structuredRequest,
      serverTimestamp: serverTimestamp()
    });

    return {
      success: true,
      requestId: docRef.id,
      message: 'Your request has been officially recorded and timestamped. Our team will verify and process it immediately.'
    };
  } catch (firebaseErr: any) {
    console.error('Data request write failure:', firebaseErr);
    return {
      success: false,
      error: firebaseErr?.code || 'submission_failed',
      message: `Failed to record request automatically. Please email our data controller at ${STUDIO_CONFIG.email}.`
    };
  }
}


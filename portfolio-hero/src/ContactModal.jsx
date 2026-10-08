import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Mail, 
  User, 
  MessageSquare, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { playClick, playHover, playOpen, playClose } from './soundEffects';
import './ContactModal.css';

/**
 * Available Inquiry Types
 */
export const INQUIRY_TYPES = [
  'Commission',
  'Exhibition',
  'Press / Interview',
  'Gallery Representation',
];

/**
 * ContactModal
 * 
 * Luxury frosted glass modal for initiating studio inquiries.
 * Features:
 * - Inquiry type selection pills
 * - Validation & interactive tactile submission
 * - Elegant confirmation screen with 48h response pledge
 * - Full accessibility: focus trap, escape listener, backdrop click, body scroll lock
 */
export default function ContactModal({ isOpen, onClose }) {
  const [inquiryType, setInquiryType] = useState('Commission');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Close handler with audio feedback
  const handleClose = useCallback(() => {
    playClose();
    onClose?.();
  }, [onClose]);

  // Handle Escape key, Focus Trap, and Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    // Play modal open sound
    playOpen();

    // Store previous focused element to return focus on modal close
    previousActiveElement.current = document.activeElement;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus first input or modal container
    const focusTimer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 50);

    // Keydown listener for Escape and Tab trapping
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previous trigger
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleClose]);

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please provide details regarding your inquiry or proposed project.';
    } else if (formData.message.trim().length < 15) {
      errors.message = 'Please share a brief note of at least 15 characters.';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury dispatch delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      playClick();
    }, 450);
  };

  // Reset form to send another inquiry
  const handleResetForm = () => {
    playClick();
    setFormData({
      name: '',
      email: '',
      organization: '',
      message: '',
    });
    setFormErrors({});
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="contact-modal-overlay" 
      onClick={handleBackdropClick} 
      role="presentation"
    >
      <div
        ref={modalRef}
        className="contact-modal-dialog glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          className="contact-modal-close"
          onClick={handleClose}
          onMouseEnter={playHover}
          aria-label="Close studio inquiry dialog"
        >
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <div className="contact-modal-body">
            {/* Modal Header */}
            <header className="contact-modal-header">
              <div className="modal-header-badge font-cinzel">
                <Sparkles size={14} className="text-olive" />
                <span>Studio Riya • Private Inquiries</span>
              </div>
              <h2 id="contact-modal-title" className="modal-title font-serif">
                Studio Inquiry
              </h2>
              <p className="modal-subtitle">
                Initiating curatorial dialogue for exhibitions, museum commissions, site-specific installations, and acquisitions.
              </p>
            </header>

            {/* Inquiry Type Pills */}
            <div className="inquiry-type-group">
              <label className="input-label font-cinzel">Inquiry Nature</label>
              <div className="inquiry-pills-row" role="radiogroup" aria-label="Inquiry Type">
                {INQUIRY_TYPES.map((type) => {
                  const isSelected = inquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`inquiry-pill ${isSelected ? 'is-active' : ''}`}
                      onClick={() => {
                        playClick();
                        setInquiryType(type);
                      }}
                      onMouseEnter={playHover}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-grid-two">
                {/* Full Name */}
                <div className="form-field">
                  <label htmlFor="inquiry-name" className="input-label font-cinzel">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <User size={15} className="input-icon" />
                    <input
                      ref={firstInputRef}
                      id="inquiry-name"
                      name="name"
                      type="text"
                      className={`form-input ${formErrors.name ? 'has-error' : ''}`}
                      placeholder="e.g. Dr. Elena Rostova"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <span className="error-message" role="alert">{formErrors.name}</span>
                  )}
                </div>

                {/* Email Address */}
                <div className="form-field">
                  <label htmlFor="inquiry-email" className="input-label font-cinzel">
                    Email Address <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Mail size={15} className="input-icon" />
                    <input
                      id="inquiry-email"
                      name="email"
                      type="email"
                      className={`form-input ${formErrors.email ? 'has-error' : ''}`}
                      placeholder="e.g. e.rostova@biennale.org"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <span className="error-message" role="alert">{formErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Organization / Gallery */}
              <div className="form-field">
                <label htmlFor="inquiry-org" className="input-label font-cinzel">
                  Institution, Gallery, or Organization <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-wrapper">
                  <Building2 size={15} className="input-icon" />
                  <input
                    id="inquiry-org"
                    name="organization"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Venice Biennale, Mori Art Museum, or Private Collector"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Project Brief / Message */}
              <div className="form-field">
                <label htmlFor="inquiry-message" className="input-label font-cinzel">
                  Project Brief & Timeline <span className="req-star">*</span>
                </label>
                <div className="input-wrapper textarea-wrapper">
                  <MessageSquare size={15} className="input-icon textarea-icon" />
                  <textarea
                    id="inquiry-message"
                    name="message"
                    rows={4}
                    className={`form-input form-textarea ${formErrors.message ? 'has-error' : ''}`}
                    placeholder="Provide details regarding proposed spatial dimensions, timeline, exhibition themes, or architectural context..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formErrors.message && (
                  <span className="error-message" role="alert">{formErrors.message}</span>
                )}
              </div>

              {/* Submit & Response Timeline */}
              <div className="form-submit-row">
                <div className="form-guarantee">
                  <span className="guarantee-dot" aria-hidden="true" />
                  <span>Confidential studio correspondence • Response within 48h</span>
                </div>

                <button
                  type="submit"
                  className="btn-editorial btn-primary submit-btn"
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <span>Transmit Inquiry</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation Screen */
          <div className="confirmation-screen">
            <div className="confirmation-icon-wrap" aria-hidden="true">
              <CheckCircle2 size={46} className="confirmation-icon" />
            </div>

            <div className="confirmation-badge font-cinzel">
              Transmission Confirmed
            </div>

            <h3 className="confirmation-title font-serif">
              Inquiry Received
            </h3>

            <p className="confirmation-message">
              Studio Riya will be in touch within 48 hours. A curatorial representative will review your proposed 
              timeline and technical specifications.
            </p>

            <div className="confirmation-summary glass-card">
              <div className="summary-row">
                <span className="summary-label">Inquiry Nature:</span>
                <span className="summary-val font-semibold">{inquiryType}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Correspondent:</span>
                <span className="summary-val">{formData.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Email Destination:</span>
                <span className="summary-val">{formData.email}</span>
              </div>
              {formData.organization && (
                <div className="summary-row">
                  <span className="summary-label">Institution:</span>
                  <span className="summary-val">{formData.organization}</span>
                </div>
              )}
            </div>

            <div className="confirmation-actions">
              <button
                type="button"
                className="btn-editorial btn-secondary"
                onClick={handleResetForm}
                onMouseEnter={playHover}
              >
                <RotateCcw size={15} />
                <span>Send Another Inquiry</span>
              </button>

              <button
                type="button"
                className="btn-editorial btn-primary"
                onClick={handleClose}
                onMouseEnter={playHover}
              >
                <span>Return to Portfolio</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

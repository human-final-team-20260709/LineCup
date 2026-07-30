import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import {
  ModalBackdrop,
  ModalCard,
  ModalFooter,
  ModalIcon,
  OutlineButton,
} from './AccountModalCss';

const modalIcons = {
  success: FiCheckCircle,
  error: FiAlertTriangle,
  info: FiInfo,
};

function AccountModal({
  isOpen,
  title,
  message,
  tone = 'success',
  confirmLabel = '확인',
  onConfirm,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  const Icon = modalIcons[tone] || modalIcons.info;
  const handleClose = onClose || onConfirm;

  return (
    <ModalBackdrop role="presentation">
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
        <button type="button" onClick={handleClose} aria-label="닫기">
          <FiX aria-hidden="true" />
        </button>
        <ModalIcon $tone={tone}>
          <Icon aria-hidden="true" />
        </ModalIcon>
        <h2 id="account-modal-title">{title}</h2>
        <p>{message}</p>
        <ModalFooter>
          <OutlineButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </OutlineButton>
        </ModalFooter>
      </ModalCard>
    </ModalBackdrop>
  );
}

export default AccountModal;

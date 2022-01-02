import Modal, { ModalProps } from 'react-responsive-modal'

type Props = typeof defaultProps & ModalProps

const defaultProps = {
  center: true,
}

export default function ActionModal({ children, classNames, ...props }: Props) {
  return (
    <Modal classNames={{ modal: 'modal', ...(classNames ?? {}) }} {...props}>
      {children}
    </Modal>
  )
}

ActionModal.defaultProps = defaultProps

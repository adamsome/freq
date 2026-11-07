import type { JSX } from 'react'
import Modal, { ModalProps } from 'react-responsive-modal'

type Props = Partial<typeof defaultProps> & ModalProps

const defaultProps = {
  center: true,
}

export default function ActionModal({
  children,
  classNames,
  center = defaultProps.center,
  ...props
}: Props): JSX.Element {
  return (
    <Modal
      classNames={{ modal: 'modal', ...(classNames ?? {}) }}
      center={center}
      {...props}
    >
      {children}
    </Modal>
  )
}

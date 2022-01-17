import Auth from './Auth'
import Modal from './Modal'
import * as React from 'react'

export default function AuthModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Auth redirectTo={''} />
    </Modal>
  )
}

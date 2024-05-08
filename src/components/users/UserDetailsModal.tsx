import { AppUser, UserRole } from '@/models/user'
import { Modal } from 'flowbite-react'

export interface UserDetailsModalProps {
  show: boolean
  setShow: (show: boolean) => void
  onClose: () => void
  user: AppUser
}

export default function UserDetailsModal({ show, setShow, onClose, user }: UserDetailsModalProps) {
  const handleClose = () => {
    setShow(false)
    onClose()
  }

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>
        User Details
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <p><span className="font-bold">Name:</span> {user.name}</p>
            <p><span className="font-bold">Email:</span> {user.email}</p>
            <p><span className="font-bold">Username:</span> {user.username}</p>
            <p><span className="font-bold">Role:</span> {user.role}</p>
            <p><span className="font-bold">Address:</span> {user.address}</p>
            <p><span className="font-bold">Phone:</span> {user.phone}</p>
            {[UserRole.GUEST, UserRole.STUDENT].includes(user.role) && (
              <>
                <p><span className="font-bold">Section:</span> {user.section?.name || ''}</p>
                <p><span className="font-bold">Subjects:</span></p>
                {user.subjects && user.subjects.map((subject, i) => (
                  <p key={i}><span className="ml-5">{subject.name}</span></p>
                ))}
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal >
  )
}
